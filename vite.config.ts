import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteTsConfigPaths(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],

  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
});