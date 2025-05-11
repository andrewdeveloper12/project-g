import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// Detect Railway's default port or fallback to 5173
const PORT = process.env.PORT || 5173;

export default defineConfig({
  base: './', // Change to '/' if you want to serve from the root
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-i18next',
      'axios'
    ],
    exclude: ['lucide-react'],
  },
  server: {
    port: +PORT,
    open: true,
    cors: true,
    host: true, // Allows listening on 0.0.0.0 for Railway
  },
  preview: {
    port: +PORT,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-i18next'],
          icons: ['lucide-react'],
        }
      }
    }
  }
});
