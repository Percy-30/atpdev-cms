import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../../.."),
    resolveAlias: {
      "@atpdev/database": "./packages/database/src/index.ts",
    },
  },
  transpilePackages: ["@atpdev/database"],
  experimental: {
    // Por defecto Next.js limita el body de Server Actions a 1MB, y eso rompe
    // la subida manual de imágenes del CMS. Lo subimos a 8MB (haremos que el
    // propio input del formulario ya valide "máx 5MB" antes de llegar aquí).
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;