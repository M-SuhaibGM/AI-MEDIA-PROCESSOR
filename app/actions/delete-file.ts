"use server";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/Prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteFile(fileId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // 1. Find the file to get the S3 Key
  const file = await prisma.file.findUnique({
    where: { id: fileId, userId: session.user.id },
  });

  if (!file) throw new Error("File not found");

  try {
    // 2. Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: file.key,
    });
    await s3Client.send(deleteCommand);

    // 3. Delete from Database
    await prisma.file.delete({
      where: { id: fileId },
    });

    // 4. Refresh the dashboard UI
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { success: false, error: "Failed to delete file" };
  }
}