
// Simple WebRTC signaling server with Express static hosting.
// - Serves HTTP on port 3000
// - If ./certs/cert.pem and ./certs/key.pem exist, also serves HTTPS on 8443
// - WebSocket signaling at /ws (same origin)

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');
const { WebSocketServer } = require('ws');

const app = express();
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('/health', (_req, res) => res.json({ ok: true }));

const httpServer = http.createServer(app);
const servers = [{ server: httpServer, kind: 'http', port: 3000 }];

// Optional HTTPS for getUserMedia on non-localhost origins
const certPath = path.join(__dirname, 'certs', 'cert.pem');
const keyPath = path.join(__dirname, 'certs', 'key.pem');
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  try {
    const options = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };
    const httpsServer = https.createServer(options, app);
    servers.push({ server: httpsServer, kind: 'https', port: 8443 });
  } catch (e) {
    console.warn('Could not start HTTPS:', e.message);
  }
} else {
  console.warn('[Notice] No TLS certs found at ./certs .');
  console.warn('To use your phone over LAN, you generally need HTTPS.');
  console.warn('See README.md for mkcert/openssl instructions.');
}

// In-memory rooms: very lightweight. For demos only.
const rooms = new Map(); // roomId -> Set of client sockets

function getRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  return rooms.get(roomId);
}

function makeWSS(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (ws) => {
    ws.id = Math.random().toString(36).slice(2);
    ws.roomId = null;

    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      if (msg.type === 'join' && msg.room) {
        const room = getRoom(msg.room);
        ws.roomId = msg.room;
        room.add(ws);
        // Notify others that someone joined
        for (const peer of room) {
          if (peer !== ws) {
            peer.send(JSON.stringify({ type: 'peer-joined', id: ws.id }));
          }
        }
        ws.send(JSON.stringify({ type: 'joined', id: ws.id, peers: [...room].filter(p=>p!==ws).map(p=>p.id) }));
        return;
      }

      // Relay SDP/ICE to peers in same room
      if (ws.roomId && ['offer','answer','candidate','bye'].includes(msg.type)) {
        const room = getRoom(ws.roomId);
        for (const peer of room) {
          if (peer !== ws) {
            peer.send(JSON.stringify({ ...msg, from: ws.id }));
          }
        }
      }
    });

    ws.on('close', () => {
      if (ws.roomId) {
        const room = getRoom(ws.roomId);
        room.delete(ws);
        for (const peer of room) {
          peer.send(JSON.stringify({ type: 'bye', from: ws.id }));
        }
        if (room.size === 0) rooms.delete(ws.roomId);
      }
    });
  });
  return wss;
}

for (const { server, kind, port } of servers) {
  makeWSS(server);
  server.listen(port, () => {
    console.log(`Serving ${kind.toUpperCase()} on port ${port}`);
  });
}

console.log('http://localhost:3000/viewer.html?room=coins');
console.log('https://<IP-PC>:8443/phone.html?room=coins');
