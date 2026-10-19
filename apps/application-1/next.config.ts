import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lms/shared-ui", "@lms/users"],
};

export default nextConfig;
