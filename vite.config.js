import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // MARK: start vite build config

  // vite creates a manifest and assets during the build process (local and prod)
  // django collectstatics will put assets in '/static/student_personal/assets'
  // django will put the manifest in '/static/.vite/manifest.json'
  // vite manifest prefaces all files with the path 'student_personal/assets/xxxx'
  build: {
    manifest: true,
    rollupOptions: {
      input: [
        // list all entry points
        "./student_personal_vue/main.js",
      ],
      output: {
        entryFileNames: "student_personal/assets/main.js",
        assetFileNames: (assetInfo) =>
          `student_personal/assets/${assetInfo.name}`,
      },
    },
    outDir: "./student_personal/static/", // relative path to django's static directory
    assetsDir: "student_personal/assets", // default ('assets')... this is the namespaced subdirectory of outDir that vite uses
    emptyOutDir: false, // set to false to ensure favicon is not overwritten
  },
  base: "/static/", // allows for proper css url path creation during the build process

  // MARK: standard vite/vue plugin and resolver config
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./student_personal_vue", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ["global-builtin", "import"], // silence bootstrap5 related deprecations
      },
    },
  },
});
