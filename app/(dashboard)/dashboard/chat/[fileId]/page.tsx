import ChatInterface from "@/app/components/ChatInterface";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/Prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redirect } from "next/navigation";
import NotFound from "../../not-found";

// 1. Initialize the S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});


interface PageProps {
    params: {
        fileId: string;
    };
}

export default async function ChatPage({ params }: PageProps) {
    const session = await auth();
    const { fileId } = await params;

    if (!session?.user) redirect("/auth");

    const file = await prisma.file.findFirst({
        where: { id: fileId , userId: session.user.id },
    });

    if (!file) {
        NotFound();
    }

    // 2. Generate the Signed URL
    // We extract the 'Key' from your stored URL
    const fileKey = file?.url.split('amazonaws.com/')[1];

    const command = new GetObjectCommand({
        Bucket: "suhaib-ai-input-raw",
        Key: fileKey,
    });

    // This URL will only work for the next 3600 seconds (1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return (
        <div className="flex flex-col h-[80vh] bg-[#020617] text-slate-100 overflow-hidden rounded-xl border border-slate-800">
            {/* ... Header ... */}
            <div className="flex-1 flex overflow-hidden">
                <div className="w-1/2 border-r border-slate-800 bg-slate-950 flex items-center justify-center p-4">
                    {file?.type.startsWith("image/") ? (
                        <div className="relative group w-full h-full flex items-center justify-center">
                            {/* REMOVED onError to fix the crash */}
                            <img
                                src={signedUrl}
                                alt={file.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                    ) :
                        file?.type.startsWith("audio/") ? (
                            <div className="flex flex-col items-center gap-6 w-full max-w-md p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
                                <audio controls className="w-full">
                                    <source src={signedUrl} type={file.type} />
                                </audio>
                            </div>
                        ) : (
                            <iframe
                                src={`${signedUrl}#toolbar=0`}
                                className="w-full h-full rounded-lg bg-white"
                                title="PDF Viewer"
                            />
                        )}
                </div>
                <div className="w-full md:w-1/2 flex flex-col relative bg-slate-900/30">
                    <ChatInterface fileId={fileId} />
                </div>
            </div>
        </div>
    );
}