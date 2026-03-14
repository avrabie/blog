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
        // For SSE stability
        timeout: 0,
        proxyTimeout: 0,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            if (req.url?.includes('stream')) {
              proxyReq.setHeader('Connection', 'keep-alive');
              proxyReq.setHeader('Cache-Control', 'no-cache');
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            if (req.url?.includes('stream')) {
              // Ensure we don't have multiple content-type headers
              delete proxyRes.headers['content-type'];
              proxyRes.headers['content-type'] = 'text/event-stream';
              
              proxyRes.headers['cache-control'] = 'no-cache, no-transform';
              proxyRes.headers['connection'] = 'keep-alive';
              proxyRes.headers['x-accel-buffering'] = 'no';
              
              delete proxyRes.headers['content-encoding'];
            }
          });
        }
      },
    },
  },
})
