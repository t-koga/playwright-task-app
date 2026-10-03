import type { NextConfig } from "next";

const isPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  ...(isPagesBuild
    ? { output: "export", basePath: "/playwright-task-app" }
    : {}),
};

export default nextConfig;
