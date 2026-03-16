import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_BACKEND_URL || 'http://127.0.0.1:8082';
  console.log('[Vite] VITE_BACKEND_URL:', backendUrl);

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/sse': {
          target: backendUrl,
          changeOrigin: true,
          // SSE stability: prevent proxy timeouts
          timeout: 0,
          proxyTimeout: 0,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('[Vite Proxy] SSE request:', req.url);
            });
            proxy.on('proxyRes', (proxyRes, _req, _res) => {
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
  };
})
