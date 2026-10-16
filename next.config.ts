import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The sandbox preview serves the dev server from an E2B host; Next blocks its HMR requests otherwise.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
