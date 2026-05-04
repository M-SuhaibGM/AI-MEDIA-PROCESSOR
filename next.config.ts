import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
     Treat 'pdf-parse' as a standard Node.js package 
     to avoid bundling errors in the browser.
  */
  serverExternalPackages: ['pdf-parse'],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Keeping your existing UploadThing support
      },
      {
        protocol: "https",
        // This dynamically allows your specific AWS S3 Bucket
        hostname: `${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com`,
      },
      {
        protocol: "https",
        // Recommended: This allows all S3 buckets in your specific region
        hostname: `s3.${process.env.AWS_REGION}.amazonaws.com`,
      },
    ],
  },
};

export default nextConfig;