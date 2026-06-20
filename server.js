const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 8080);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8'
};

function sendFile(file, response) {
  response.writeHead(200, {
    'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff'
  });
  fs.createReadStream(file).pipe(response);
}

function findFile(candidates, response) {
  const file = candidates.shift();
  if (!file) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  fs.stat(file, (error, stat) => {
    if (!error && stat.isFile()) return sendFile(file, response);
    findFile(candidates, response);
  });
}

http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch (_) {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const relative = pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relative || 'index.html');
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  const candidates = relative
    ? [target, path.join(target, 'index.html')]
    : [target];
  findFile(candidates, response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Cinderella preview: http://127.0.0.1:${port}`);
});
