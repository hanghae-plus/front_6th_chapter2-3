import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/front_6th_chapter2-3/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
}))
