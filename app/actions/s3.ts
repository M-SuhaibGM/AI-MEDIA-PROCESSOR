"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/Prisma";

const s3 = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedPostUrl(fileName: string, contentType: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const fileKey = `uploads/${session.user.id}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileKey,
    ContentType: contentType,
  });

  const fileRecord = await prisma.file.create({
    data: {
      userId: session.user.id as string,
      key: fileKey,
      name: fileName,
      type: contentType,
      uploadStatus: "PENDING",
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileKey}`
    }
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  // Do NOT call processFileContent here.
  return { url, fileId: fileRecord.id ,key:fileKey }; 
}