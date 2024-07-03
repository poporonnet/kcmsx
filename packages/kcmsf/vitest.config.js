/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    reporters: "dot",
    setupFiles: "./test/setup.ts",
  },
  resolve: {
    alias: {
      "@": __dirname + "/src",
    },
  },
});
