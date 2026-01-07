import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neplex/vectorizer", "sharp", "onnxruntime-node", "@imgly/background-removal-node"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/remove-bg": ["./node_modules/onnxruntime-node/bin/napi-v3/linux/x64/**/*.node", "./node_modules/onnxruntime-node/bin/napi-v3/linux/x64/**/*.so*", "./node_modules/@imgly/background-removal-node/**/*"],
  },
};

export default nextConfig;
