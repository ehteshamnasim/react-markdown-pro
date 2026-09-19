import { defineConfig } from "vite";
import { resolve } from "path";

// Relative assets work locally and when this repository is deployed to GitHub Pages.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        demo: resolve(__dirname, "demo.html"),
      },
    },
  },
});
