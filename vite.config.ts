import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // Ensure path is imported

export default defineConfig({
  // 1. Tell Vite the app lives at /prioritize
  base: '/prioritize/',

  plugins: [
    react(),
    tailwindcss(), // Crucial for Tailwind v4
  ],

  resolve: {
    alias: {
      // Allows you to use '@' as a shorthand for the 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // 2. Multi-Page Input: Defines the landing page and the app entry
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Your root landing page
        prioritize: path.resolve(__dirname, 'prioritize/index.html'), // Your React app
      },
      // 3. Chunk Optimization: Splitting vendor code to keep files small
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});