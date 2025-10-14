const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function safeJoin(base, target) {
  const targetPath = path.posix.normalize('/' + target).replace(/^\/+/, '');
  return path.join(base, targetPath);
}

function serveFile(filePath, res) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      res.statusCode = 500;
      res.end('Internal server error');
    });
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '').split('?')[0]);
  const requestedPath = urlPath === '/' ? 'index.html' : urlPath;
  const filePath = safeJoin(PUBLIC_DIR, requestedPath);

  // Prevent path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      return serveFile(path.join(filePath, 'index.html'), res);
    }
    if (!err && stats.isFile()) {
      return serveFile(filePath, res);
    }
    // Fallback to index.html for unknown routes (SPA support)
    serveFile(path.join(PUBLIC_DIR, 'index.html'), res);
  });
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}/`);
});
