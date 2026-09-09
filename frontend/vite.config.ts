import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * Frontend Vite config.
 * All /api and /ws requests are proxied to the backend server on port 5000.
 */
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR can be disabled in sandboxes via DISABLE_HMR env var
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy API calls and WebSocket to the backend
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.VITE_BACKEND_PORT || 5000}`,
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: `ws://localhost:${process.env.VITE_BACKEND_PORT || 5000}`,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});
