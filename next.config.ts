import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
