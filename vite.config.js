import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
// FIX 1: Changed to an arrow function so you can declare variables inside
export default defineConfig(({ mode }) => {
  // MARK: start vite build config
  // vite creates a manifest and assets during the build process (local and prod)
  // django collectstatics will put assets in '/static/student_personal/assets'
  // django will put the manifest in '/static/.vite/manifest.json'
  // vite manifest prefaces all files with the path 'student_personal/assets/xxxx'

  const env = loadEnv(mode, process.cwd(), ""); // load all env vars (including custom ones without the VITE_ prefix)
  const isLocalDev = env.ENV === "localdev";

  // FIX 2: Correctly return the configuration object from the function
  return {
    build: {
      manifest: true,
      sourcemap: isLocalDev, // only generate source maps for local development
      rolldownOptions: {
        input: [
          // list all entry points
          "./student_personal_vue/main.js",
        ],
        output: {
          // Include source maps in the manifest for local development, but not in production
          sourcemapExcludeSources: false,
          // optimize css asset file names (remove hash) for better Clarity caching
          assetFileNames: (assetInfo) => {
            const prefix = "student_personal/assets/";
            const name = assetInfo.names?.[0] ?? "";
            if (name.endsWith(".css")) {
              return `${prefix}[name][extname]`;
            }
            return `${prefix}[name]-[hash][extname]`;
          },
        },
      },
      outDir: "./student_personal/static/", // relative path to django's static directory
      assetsDir: "student_personal/assets", // default ('assets')... this is the namespaced subdirectory of outDir that vite uses
      emptyOutDir: true,
    },
    publicDir: "student_personal_vue/public", // Vite will copy contents to outDir
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
  }; // FIX 3: Removed the trailing syntax fragments and wrapped the object closure properly
});
