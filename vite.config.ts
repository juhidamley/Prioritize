import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // 1. Your main portfolio entry point
        main: resolve(__dirname, 'index.html'), 
        // 2. Your Prioritize app entry point
        prioritize: resolve(__dirname, 'prioritize/index.html') 
      }
    }
  }
});