import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export static HTML files (replaces `next export`)
  output: "export",
  // Set base path for GitHub Pages subdirectory
  basePath: "/stepping_stones_game",
  /* config options here */
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Disable Next.js hot reload; nodemon handles recompilation
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack's hot module replacement
      config.watchOptions = {
        // Ignore all file changes
        ignored: ["**/*"],
      };
    }
    return config;
  },
  eslint: {
    // Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
