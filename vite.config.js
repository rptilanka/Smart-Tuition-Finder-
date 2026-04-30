import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Expose both `VITE_*` and `NEXT_PUBLIC_*` env vars to the client so the
// same `.env.local` works regardless of which framework convention the
// developer uses.
export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
