#!/usr/bin/env node
// thinking-canvas CLI. One verb: render.
//
// Usage:
//   node canvas.js render --topic <topic>
//
// Behavior:
//   - Computes TOPIC_DIR = <cwd>/docs/brainstorm/<slug>
//   - If no server running for this topic: forks self in --server mode, writes lockfile
//   - If server running: broadcasts reload via SSE
//   - Always prints JSON {url, port, topic_dir} to stdout
//
// Internal:
//   node canvas.js --server --topic <topic> --topic-dir <dir> --port <port>
//     Runs the HTTP/SSE server in foreground. 30-min idle exit.

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

// ---- arg parsing ----
const argv = process.argv.slice(2);
const args = {};
let verb = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--') && verb === null) { verb = a; continue; }
  if (a === '--server') { args.server = true; continue; }
  if (a.startsWith('--')) { args[a.slice(2)] = argv[++i]; }
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

function topicDir(topic) {
  return path.resolve(process.cwd(), 'docs', 'brainstorm', slugify(topic));
}

// ---- server mode ----
function runServer() {
  const dir = args['topic-dir'] || topicDir(args.topic);
  const port = parseInt(args.port, 10);
  const filePath = path.join(dir, 'visual.html');
  const lockPath = path.join(dir, '.canvas.lock');
  const IDLE_MS = 30 * 60 * 1000;
  let lastActivity = Date.now();
  const sseClients = new Set();

  const SSE_INJECT = `<script>
(function(){var es=new EventSource('/_e');es.onmessage=function(e){if(e.data==='reload')location.reload();};})();
</script>`;

  function broadcast(msg) {
    for (const res of sseClients) {
      try { res.write(`data: ${msg}\n\n`); } catch (_) {}
    }
  }

  function injectReload(html) {
    if (html.includes('</body>')) return html.replace('</body>', SSE_INJECT + '</body>');
    return html + SSE_INJECT;
  }

  function safeJoin(req) {
    const p = path.resolve(dir, '.' + decodeURIComponent(req.url.split('?')[0]));
    return p.startsWith(dir) ? p : null;
  }

  const server = http.createServer((req, res) => {
    lastActivity = Date.now();

    if (req.url === '/_e') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      res.write(': connected\n\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    if (req.url === '/_reload' && req.method === 'POST') {
      broadcast('reload');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
      return;
    }

    if (req.url === '/' || req.url === '/visual.html') {
      let html;
      try { html = fs.readFileSync(filePath, 'utf8'); }
      catch (_) { html = '<!DOCTYPE html><html><body><h1>Waiting for canvas…</h1></body></html>'; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(injectReload(html));
      return;
    }

    const p = safeJoin(req);
    if (p && fs.existsSync(p) && fs.statSync(p).isFile()) {
      res.writeHead(200);
      res.end(fs.readFileSync(p));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  server.listen(port, '127.0.0.1', () => {
    fs.writeFileSync(lockPath, JSON.stringify({
      pid: process.pid, port, started_at: new Date().toISOString(),
    }));
  });

  const cleanup = () => { try { fs.unlinkSync(lockPath); } catch (_) {} process.exit(0); };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  setInterval(() => {
    if (Date.now() - lastActivity > IDLE_MS) cleanup();
  }, 60 * 1000).unref();
}

if (args.server) {
  runServer();
} else {
  runClient();
}

function runClient() {

if (verb !== 'render') {
  process.stderr.write('Usage: node canvas.js render --topic <topic>\n');
  process.exit(1);
}
if (!args.topic) {
  process.stderr.write('Error: --topic is required\n');
  process.exit(1);
}

const dir = topicDir(args.topic);
fs.mkdirSync(dir, { recursive: true });
const lockPath = path.join(dir, '.canvas.lock');

function isAlive(pid) {
  try { process.kill(pid, 0); return true; } catch (_) { return false; }
}

function findFreePort(cb) {
  const srv = net.createServer();
  srv.listen(0, '127.0.0.1', () => {
    const p = srv.address().port;
    srv.close(() => cb(p));
  });
}

function postReload(port, done) {
  const req = http.request({
    host: '127.0.0.1', port, path: '/_reload', method: 'POST',
  }, (res) => { res.resume(); res.on('end', done); });
  req.on('error', done);
  req.end();
}

function emit(port) {
  const out = { url: `http://localhost:${port}`, port, topic_dir: dir };
  process.stdout.write(JSON.stringify(out) + '\n');
}

function startServer(cb) {
  findFreePort((port) => {
    const child = spawn(process.execPath, [
      __filename, '--server',
      '--topic', args.topic,
      '--topic-dir', dir,
      '--port', String(port),
    ], { detached: true, stdio: 'ignore' });
    child.unref();
    const deadline = Date.now() + 3000;
    (function poll() {
      if (fs.existsSync(lockPath)) return cb(port);
      if (Date.now() > deadline) {
        process.stderr.write('Error: server failed to start within 3s\n');
        process.exit(1);
      }
      setTimeout(poll, 50);
    })();
  });
}

let existing = null;
if (fs.existsSync(lockPath)) {
  try { existing = JSON.parse(fs.readFileSync(lockPath, 'utf8')); } catch (_) {}
}
if (existing && isAlive(existing.pid)) {
  postReload(existing.port, () => emit(existing.port));
} else {
  if (existing) { try { fs.unlinkSync(lockPath); } catch (_) {} }
  startServer((port) => {
    setTimeout(() => postReload(port, () => emit(port)), 100);
  });
}

}

