import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@focusflow/ui': resolve(__dirname, '../packages/ui/src'),
        '@focusflow/types': resolve(__dirname, '../packages/types/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
});
