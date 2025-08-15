import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/front_6th_chapter2-3/" : "",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
