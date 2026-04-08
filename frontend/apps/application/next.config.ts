import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_AMAZON_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AMAZON_S3_REGION}.amazonaws.com`,
      },
      // Ajoute ici l'URL de ton Amazon S3
    ],
  }
};

export default nextConfig;
