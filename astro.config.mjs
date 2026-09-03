// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import dotenv from "dotenv";
dotenv.config();

// https://astro.build/config
export default defineConfig({
  site: "https://andreslopez.co",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
