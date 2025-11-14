import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["webfrontend-aspirenextjskeycloak.dev.localhost"],
};

export default nextConfig;
