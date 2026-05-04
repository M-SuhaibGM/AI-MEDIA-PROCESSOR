import { streamText, convertToModelMessages } from "ai";
import { prisma } from "@/lib/Prisma";
import { auth } from "@/lib/auth";
import { createGroq } from "@ai-sdk/groq";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1. Initialize Clients
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

// ... existing imports

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const data = await req.json();
  const { fileId, messages } = data;

  // FIX 1: Use the fileId from the request body, not a hardcoded string
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId: session.user.id },
  });

  if (!file) return new Response("File not found", { status: 404 });

  const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
  const TEXT_MODEL = "llama-3.3-70b-versatile";

  // --- CASE 1: IMAGES ---
  if (file.type.startsWith("image/")) {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: file.key,
    });

    const temporaryViewUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 600 });

    // FIX 2: Safely extract text from the "parts" array
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.parts?.find((p: any) => p.type === 'text')?.text
      || lastMessage.content
      || "Analyze this image";

    return streamText({
      model: groq(VISION_MODEL),
      messages: [
        {
          role: "system",
          content: "You are a vision assistant. Describe the provided image based on the user's request."
        },
        {
          role: "user",
          content: [
            { type: "text", text: userQuery },
            { type: "image", image: new URL(temporaryViewUrl) },
          ],
        },
      ],
    }).toUIMessageStreamResponse();
  }

  // --- CASE 2: PDF/AUDIO ---
  else {
    const documentContext = file.summary || "No content extracted.";

    return streamText({
      model: groq(TEXT_MODEL),
      system: `You are an expert assistant. Focus ONLY on: ${file.name}. \n\n Content: ${documentContext}`,
      // convertToModelMessages handles the "parts" array for standard text models
      messages: await convertToModelMessages(messages),
    }).toUIMessageStreamResponse();
  }
}