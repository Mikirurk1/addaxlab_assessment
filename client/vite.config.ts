import path from 'path';
import fs from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function webmanifestDevMiddleware() {
  const siteManifestPath = path.resolve(__dirname, 'public', 'site.webmanifest');
  const assetsManifestPath = path.resolve(
    __dirname,
    'public',
    'assets',
    'site.webmanifest'
  );

  return {
    name: 'webmanifest-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const urlPath = (req.url ?? '').split('?')[0] ?? '';

        const filePath =
          urlPath === '/site.webmanifest'
            ? siteManifestPath
            : urlPath === '/assets/site.webmanifest'
              ? assetsManifestPath
              : null;

        if (!filePath) return next();

        try {
          const raw = fs.readFileSync(filePath, 'utf8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(raw);
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.VITE_DEV_PORT ?? '5173', 10);
  const proxyTarget = (env.VITE_API_PROXY_TARGET ?? '').trim();

  const proxy: Record<string, any> = proxyTarget
    ? {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/ws': {
          target: proxyTarget,
          ws: true,
        },
      }
    : {};

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [webmanifestDevMiddleware(), react()],
    server: {
      port,
      proxy,
    },
  };
});
