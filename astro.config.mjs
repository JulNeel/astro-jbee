// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://julienbruneel.fr",
  trailingSlash: "never",
  image: {
    domains: ["passionate-fireworks-eca5333975.media.strapiapp.com"],
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Séparer le runtime React des composants
            'react-vendor': ['react', 'react-dom'],
            // Séparer les librairies interactives
            'interactive': ['jarallax', 'glightbox']
          }
        }
      },
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          passes: 2
        }
      }
    },
    ssr: {
      noExternal: ['@fontsource-variable/inter', '@fontsource/oswald']
    }
  },
  integrations: [react()],
});
