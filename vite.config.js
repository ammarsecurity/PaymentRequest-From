import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    // proxy: {
    //   '/api': {
    //     target: 'https://epp-api.lab-logic.com',
    //     changeOrigin: true,
    //     // rewrite: (path) => {
    //     //   path.replace(/^\/api/, '');
    //     // },
    //   },
    // },
  },
  plugins: [
    vue(),
    Components({
      /* options */
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
