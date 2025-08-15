/// <reference types="vitest" />
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts", "./test/msw.setup.ts"],
    include: ["test/**/*.test.tsx", "test/**/*.test.ts", "test/**/*.spec.tsx", "test/**/*.spec.ts"],
  },
})
