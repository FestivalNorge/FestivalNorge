import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')   //  @  →  <root>/src
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/', // Base path for Firebase hosting
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});