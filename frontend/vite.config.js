import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    mimeTypes: {
      ".wasm": "application/wasm", // 指定 .wasm MIME 类型
    },
  },
});
