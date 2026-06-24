import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_AMAZON_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AMAZON_S3_REGION}.amazonaws.com`,
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
