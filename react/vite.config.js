import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // base: mode === "development" ? "/" : "/dist/",
  base: "/",
  css: {
    preprocessorOptions: {
      css: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [ tailwindcss, autoprefixer],
    },
  },
  build: {
    outDir: "../api/public/dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash][extname]`,
        manualChunks: {
          vendor: ["react", "react-dom"],
          auth: ["react-router-dom", "uuid"],
          core: ["axios"],
          icons: [
            "@headlessui/react",
            "@heroicons/react",
            "@tailwindcss/forms",
            "react-bootstrap-icons",
            "tw-elements",
          ],
          notification: ["react-toastify"],
          print: ["react-to-print"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: mode === "development" ? "https://admin.masjidtuanabdullah.com/" : "/api",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
