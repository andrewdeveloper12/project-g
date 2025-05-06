import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add other aliases as needed
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-i18next',
      'axios'
    ],
    exclude: ['lucide-react'], // Keep this if you're having tree-shaking issues
  },
  server: {
    port: 5173, // Set your preferred port
    open: true // Automatically open browser
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-i18next'],
          icons: ['lucide-react']
        }
      }
    }
  }
});