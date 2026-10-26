import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lms/shared-ui", "@lms/users", "@lms/data-grid"],
};

export default nextConfig;
