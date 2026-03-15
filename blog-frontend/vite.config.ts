import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/sse': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        // SSE stability: prevent proxy timeouts
        timeout: 0,
        proxyTimeout: 0,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Vite Proxy] SSE request:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[Vite Proxy] SSE response status:', proxyRes.statusCode);
            console.log('[Vite Proxy] Response headers:', proxyRes.headers);

            // Fix the connection header for SSE streaming
            if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
              delete proxyRes.headers['connection'];
              proxyRes.headers['connection'] = 'keep-alive';
              console.log('[Vite Proxy] Fixed SSE connection header to keep-alive');
            }
          });
        },
      },
    },
  },
})
