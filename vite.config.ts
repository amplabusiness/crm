import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function apiMiddleware() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = req.url || '';
          if (!url.startsWith('/api/')) return next();
          const name = url.replace(/^\/?api\//, '').split('?')[0];
          const filePath = path.join(process.cwd(), 'api', `${name}.js`);
          // Try dynamic import; if not found, 404
          let mod;
          try {
            const href = pathToFileURL(filePath).href;
            mod = await import(href);
          } catch {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'not_found' }));
            return;
          }

          // Read body once
          const chunks: Buffer[] = [];
          await new Promise<void>((resolve) => {
            req.on('data', (c) => chunks.push(Buffer.from(c)));
            req.on('end', () => resolve());
          });
          const raw = Buffer.concat(chunks).toString('utf8');
          try { (req as any).body = raw ? JSON.parse(raw) : undefined; } catch { (req as any).body = undefined; }

          // Helpers
          (res as any).status = (code: number) => { res.statusCode = code; return res; };
          (res as any).json = (obj: any) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };

          const handler = mod.default || mod.handler;
          if (typeof handler !== 'function') {
            res.statusCode = 500;
            (res as any).json({ error: 'invalid_handler' });
            return;
          }
          await handler(req as any, res as any);
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: String(e?.message || e) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiMiddleware()],
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true }
});
