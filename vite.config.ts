import { defineConfig, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(async ({ command }): Promise<UserConfig> => {
  const config: UserConfig = {
    base: "./",
    define: { "process.env": {} },
    plugins: [
      // Vue3
      vue({
        template: {
          // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#image-loading
          transformAssetUrls,
        },
      }),
      // Vuetify Loader
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#vite-plugin-vuetify
      vuetify(),
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      // checker({
      //   typescript: true,
      //   vueTsc: true,
      //   eslint: {
      //     lintCommand:
      //       "eslint . --fix --cache --cache-location ./node_modules/.vite/vite-plugin-eslint", // for example, lint .ts & .tsx
      //   },
      // }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    build: {
      target: "esnext",
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            vuetify: [
              "vuetify",
              "vuetify/components",
              "vuetify/directives",
              "webfontloader",
            ],
            materialdesignicons: ["@mdi/font/css/materialdesignicons.css"],
          },
        },
      },
    },
    esbuild: {
      drop: command === "serve" ? [] : ["console"],
    },
  };
  return config;
});
