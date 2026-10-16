/**
 * Meratto & De Franko — Production-Ready Node.js / Express API Server
 * Handles order submissions and securely forwards them to Telegram Bot API.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './api-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually parse .env file
const loadEnv = () => {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
};

loadEnv();

const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Create native Node HTTP Server with CORS & unified API routing
const server = http.createServer(async (req, res) => {
  try {
    const handled = await handleApiRequest(req, res, process.env);
    if (handled) return;

    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
  } catch (err) {
    console.error('[Server Error]:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`[Meratto Production Server] running on http://localhost:${PORT}`);
  console.log(`Bot Token: ${BOT_TOKEN ? (BOT_TOKEN.slice(0, 10) + '...') : 'O\'RNATILMAGAN'}`);
  console.log(`Chat ID: ${CHAT_ID || 'O\'RNATILMAGAN'}`);
  console.log(`Admin Password: ${process.env.ADMIN_PASSWORD ? 'O\'rnatilgan' : 'Default (meratto2026)'}`);
});

