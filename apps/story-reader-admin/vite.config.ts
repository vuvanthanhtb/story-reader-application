/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/story-reader-admin',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, "./src/app/"),
      modules: path.resolve(__dirname, "./src/modules/"),
      shared: path.resolve(__dirname, "./src/shared/"),
      configs: path.resolve(__dirname, "./src/configs/"),
      assets: path.resolve(__dirname, "./src/assets/"),
    },
  },
}));
