// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import dotenv from "dotenv";
dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: "https://andreslopez.co",
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            animations: ["framer-motion"],
            particles: ["@tsparticles/engine", "@tsparticles/react", "@tsparticles/slim"],
          },
        },
      },
    },
  },

  integrations: [react(), sitemap()],
});