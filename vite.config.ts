import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/front_6th_chapter2-3/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@features": path.resolve(__dirname, "src/features"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@entities": path.resolve(__dirname, "src/entities"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
})
