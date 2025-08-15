/// <reference types="vitest" />
import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const base = process.env.NODE_ENV === "production" ? "/front_6th_chapter2-3/" : ""

export default defineConfig({
  base,
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/app": path.resolve(__dirname, "src/app"),
      "@/entities": path.resolve(__dirname, "src/entities"),
      "@/features": path.resolve(__dirname, "src/features"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/shared": path.resolve(__dirname, "src/shared"),
      "@/widgets": path.resolve(__dirname, "src/widgets"),
      "~": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        target: "https://dummyjson.com",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
})
