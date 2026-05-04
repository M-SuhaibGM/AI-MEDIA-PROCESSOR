import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CRITICAL: This allows Amplify to run your SSR/API routes
  output: 'standalone', 
  
  serverExternalPackages: ['pdf-parse'],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: `${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `s3.${process.env.AWS_REGION || 'eu-north-1'}.amazonaws.com`,
      },
    ],
  },
};

export default nextConfig;