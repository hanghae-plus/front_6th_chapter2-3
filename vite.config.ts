import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
const base = process.env.NODE_ENV === "production" ? "/front_6th_chapter2-3/" : ""
const entryFileName = "index.html"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, entryFileName),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
