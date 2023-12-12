/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as process from "process";

const port:number = (process.env.PORT) ? parseInt(process.env.PORT) : 4200;
const portPreview:number = (process.env.PORT_PREVIEW) ? parseInt(process.env.PORT_PREVIEW) : 4300;
let API_URL = (process.env.NODE_ENV === 'production') ? "https://api.safekids.ai" : "http://localhost:3000";
if (process.env.API_URL) {
  API_URL = process.env.API_URL;
}
console.log(`VITE starting on port:${port} and preview port: ${portPreview}`);
export default defineConfig({
  cacheDir: '../../node_modules/.vite/ml-api-web',
  define: {
    'import.meta.env.API_URL': JSON.stringify(API_URL),
  },

  server: {
    port: port,
    host: true,
  },

  preview: {
    port: portPreview,
    host: true,
  },

  plugins:
    [
      react(),
      nxViteTsPaths(),
    ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
