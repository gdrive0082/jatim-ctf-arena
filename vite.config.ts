import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // wajib absolut: route /lab/* me-rewrite ke index.html
  plugins: [inspectAttr(), react()],
  build: {
    sourcemap: true, // [internal] jangan deploy ke publik — lihat internal-notes.ts
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
