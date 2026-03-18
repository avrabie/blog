import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const devBackendUrl = 'http://localhost:9090';
  const isDev = mode === 'development';

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: isDev ? {
      proxy: {
        '/oauth2': {
          target: devBackendUrl,
          changeOrigin: true,
        },
        '/api/bff': {
          target: devBackendUrl,
          changeOrigin: true,
        },
        '/api/blog/sse': {
          target: devBackendUrl,
          changeOrigin: true,
          timeout: 0,
          proxyTimeout: 0,
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req) => {
              console.log('[Vite Proxy] SSE request:', req.url);
            });
            proxy.on('proxyRes', (proxyRes) => {
              console.log('[Vite Proxy] SSE response status:', proxyRes.statusCode);

              if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
                delete proxyRes.headers['connection'];
                proxyRes.headers['connection'] = 'keep-alive';
              }
            });
          },
        },
        '/api/blog': {
          target: devBackendUrl,
          changeOrigin: true,
        },
      },
    } : undefined,
  };
});
