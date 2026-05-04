// app/actions/audio.ts
"use server";

import { prisma } from "@/lib/Prisma";
import { getDocumentProxy, extractText } from "unpdf";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import Groq from "groq-sdk"; // Import Groq for transcription

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function processFileContent(fileId: string, s3Key: string) {
  try {
    // 1. Mark as Processing
    await prisma.file.update({
      where: { id: fileId },
      data: { uploadStatus: "PROCESSING" },
    });

    // 2. Get file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });
    const response = await s3Client.send(command);
    const arrayBuffer = await response.Body?.transformToByteArray();

    if (!arrayBuffer) throw new Error("Could not read file body");

    let finalContent = "";

    // --- NEW AUDIO LOGIC ---
    if (s3Key.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
      // Create a File object from the buffer for Groq
      const audioData = new Uint8Array(
        arrayBuffer.buffer as ArrayBuffer,
        arrayBuffer.byteOffset,
        arrayBuffer.byteLength
      );
      const file = new File([audioData], s3Key, { type: response.ContentType });

      const transcription = await groq.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
        response_format: "text",
      });

      finalContent = transcription as unknown as string;
    }
    // --- YOUR ORIGINAL PDF LOGIC (UNTOUCHED) ---
    else {
      const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
      const { text } = await extractText(pdf);
      finalContent = Array.isArray(text) ? text.join("\n") : (text || "No text could be extracted from this PDF.");
    }
    // 4. Update Database with the extracted text (PDF or Audio)
    await prisma.file.update({
      where: { id: fileId },
      data: {
        summary: finalContent,
        uploadStatus: "COMPLETED"
      },
    });

  } catch (error) {
    console.error("Processing Error:", error);
    await prisma.file.update({
      where: { id: fileId },
      data: { uploadStatus: "FAILED" },
    });
  }
}