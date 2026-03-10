/**
 * APEXEL — Telegram Verification Bot
 * Node.js built-ins only, fetch-based (Node 18+)
 *
 * Запуск: node bot.js
 * Требует: BOT_TOKEN в окружении или bot.config.json
 *
 * Команды бота:
 *   /start  — приветствие
 *   /verify — получить код верификации
 */
'use strict';

// Используем встроенный fetch (Node 18+) вместо https модуля
// Это полностью обходит проблему с OpenSSL TLS session id на Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

// ─── CONFIG ──────────────────────────────────────────────────────
const CFG_FILE = path.join(__dirname, 'bot.config.json');
let cfg = {};
if (fs.existsSync(CFG_FILE)) {
  try { cfg = JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')); } catch {}
}

const BOT_TOKEN  = process.env.BOT_TOKEN  || cfg.BOT_TOKEN  || '';
const API_SECRET = process.env.API_SECRET || cfg.API_SECRET || 'apexel_bot_secret';
const API_PORT   = process.env.API_PORT   || cfg.API_PORT   || 3001; // internal bot↔server port
const MAIN_PORT  = process.env.MAIN_PORT  || cfg.MAIN_PORT  || 3000; // main server port

if (!BOT_TOKEN) {
  console.error('❌  BOT_TOKEN не задан!');
  console.error('    Создай bot.config.json: {"BOT_TOKEN":"123456:ABC...","API_SECRET":"любой_секрет"}');
  console.error('    Или запусти: BOT_TOKEN=xxx node bot.js');
  process.exit(1);
}

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ─── PENDING CODES store (in-memory, TTL 10 min) ─────────────────
// Map: code → { telegram_id, telegram_username, expires }
const pending = new Map();

function genCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function cleanExpired() {
  const now = Date.now();
  for (const [code, v] of pending) {
    if (v.expires < now) pending.delete(code);
  }
}

// ─── TELEGRAM API HELPER ─────────────────────────────────────────
// Использует http (порт 80) как fallback если https/fetch падает на Windows
function tgPostHttp(method, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: 'api.telegram.org',
      port: 80,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = http.request(opts, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch { resolve({ ok: false }); } });
    });
    req.on('error', e => { console.error(`[bot] http fallback error (${method}):`, e.message); resolve({ ok: false, error: e.message }); });
    req.write(data); req.end();
  });
}

async function tgPost(method, body) {
  // Try fetch first (uses system TLS, works on most systems)
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json;
  } catch (e) {
    // fetch failed (SSL issue on Windows) — fall back to plain HTTP port 80
    console.warn(`[bot] fetch failed for ${method}, trying HTTP fallback...`);
    return tgPostHttp(method, body);
  }
}

function sendMsg(chat_id, text, extra = {}) {
  return tgPost('sendMessage', { chat_id, text, parse_mode: 'HTML', ...extra });
}

function apiGet(path) {
  return new Promise(resolve => {
    const r = http.request({ hostname:'127.0.0.1', port: MAIN_PORT, path, method:'GET',
      headers:{'x-internal-secret': API_SECRET} }, res => {
      let b=''; res.on('data',c=>b+=c);
      res.on('end',()=>{ try{resolve(JSON.parse(b))}catch{resolve(null)} });
    });
    r.on('error',()=>resolve(null)); r.end();
  });
}

function apiPost(path, body) {
  return new Promise(resolve => {
    const data = JSON.stringify(body);
    const r = http.request({ hostname:'127.0.0.1', port: MAIN_PORT, path, method:'POST',
      headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data),'x-internal-secret': API_SECRET} }, res => {
      let b=''; res.on('data',c=>b+=c);
      res.on('end',()=>{ try{resolve(JSON.parse(b))}catch{resolve(null)} });
    });
    r.on('error',()=>resolve(null)); r.write(data); r.end();
  });
}

// ─── HANDLE TELEGRAM UPDATE ───────────────────────────────────────
async function handleUpdate(upd) {
  const msg = upd.message;
  if (!msg || !msg.text) return;

  const chat_id  = msg.chat.id;
  const text     = msg.text.trim();
  const tg_id    = msg.from.id;
  const tg_user  = msg.from.username || msg.from.first_name || String(tg_id);

  console.log(`[bot] ${tg_user} (${tg_id}): ${text}`);

  if (text === '/start' || text.startsWith('/start ')) {
    await sendMsg(chat_id,
      `👋 <b>Добро пожаловать в APEXEL!</b>\n\n` +
      `Этот бот используется для верификации аккаунта на платформе.\n\n` +
      `Для получения кода верификации нажми кнопку ниже или отправь /verify`,
      { reply_markup: { keyboard: [[{ text: '🔑 Получить код верификации' }, { text: '🔗 Отвязать аккаунт APEXEL' }],[{ text: '📋 Мои подписки' }, { text: '/help' }]], resize_keyboard: true, one_time_keyboard: false } }
    );
    return;
  }

  if (text === '/unlink' || text === '🔗 Отвязать аккаунт APEXEL') {
    // Ask the main server to unlink this telegram_id
    const payload = JSON.stringify({ telegram_id: tg_id });
    const req2 = require('http').request({
      hostname: '127.0.0.1', port: MAIN_PORT, path: '/api/internal/unlink-telegram',
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-internal-secret': API_SECRET }
    }, res2 => {
      let b=''; res2.on('data',c=>b+=c);
      res2.on('end', () => {
        try {
          const d = JSON.parse(b);
          if (d.ok) sendMsg(chat_id, '\u2705 <b>Telegram успешно отвязан от APEXEL.</b>\n\nВы можете заново привязать аккаунт через настройки на сайте.');
          else sendMsg(chat_id, '❌ Этот Telegram не привязан ни к одному аккаунту APEXEL.');
        } catch { sendMsg(chat_id, '❌ Ошибка при отвязке. Попробуйте позже.'); }
      });
    });
    req2.on('error', () => sendMsg(chat_id, '❌ Сервер APEXEL недоступен.'));
    req2.write(payload); req2.end();
    return;
  }

  if (text === '/verify' || text === '🔑 Получить код верификации') {
    cleanExpired();

    // Remove any existing code for this user
    for (const [code, v] of pending) {
      if (v.telegram_id === tg_id) pending.delete(code);
    }

    const code    = genCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    pending.set(code, { telegram_id: tg_id, telegram_username: tg_user, expires });

    await sendMsg(chat_id,
      `🔑 <b>Твой код верификации:</b>\n\n` +
      `<code>${code}</code>\n\n` +
      `⏱ Действителен <b>10 минут</b>\n` +
      `📋 Введи этот код в форму регистрации на APEXEL`,
      { reply_markup: { keyboard: [[{ text: '🔑 Получить код верификации' }, { text: '🔗 Отвязать аккаунт APEXEL' }]], resize_keyboard: true } }
    );
    return;
  }

  // ── SUBSCRIPTIONS ──────────────────────────────────────────────
  if (text === '/mysubscriptions' || text === '\u{1F4CB} \u041C\u043E\u0438 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438') {
    const subs = await apiGet('/api/subscriptions/bot?tg=' + tg_id);
    if (!subs || !subs.length) {
      await sendMsg(chat_id, '\u{1F4ED} \u041D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043F\u043E\u0434\u043F\u0438\u0441\u043E\u043A.\n\n/subscribe_car [car_id] \u2014 \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F \u043D\u0430 \u043C\u0430\u0448\u0438\u043D\u0443\n/subscribe_author [username] \u2014 \u043D\u0430 \u0430\u0432\u0442\u043E\u0440\u0430');
    } else {
      const lines = subs.map(function(s){ return '\u2022 ' + (s.type === 'car' ? '\u{1F697}' : '\u{1F464}') + ' <b>' + s.value + '</b>'; }).join('\n');
      await sendMsg(chat_id, '\u{1F4CB} <b>\u0422\u0432\u043E\u0438 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438:</b>\n\n' + lines + '\n\n\u0414\u043B\u044F \u043E\u0442\u043F\u0438\u0441\u043A\u0438: /unsubscribe_car [car_id] \u0438\u043B\u0438 /unsubscribe_author [username]');
    }
    return;
  }

  if (text.startsWith('/subscribe_car ') || text.startsWith('/subscribe_author ')) {
    const parts2 = text.split(' ');
    const cmd2   = parts2[0];
    const type2  = cmd2 === '/subscribe_car' ? 'car' : 'author';
    const value2 = parts2.slice(1).join(' ').trim();
    if (!value2) {
      await sendMsg(chat_id, '\u274C \u0423\u043A\u0430\u0436\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435. \u041F\u0440\u0438\u043C\u0435\u0440: ' + cmd2 + ' ' + (type2 === 'car' ? 'mazda_rx7' : 'srxlords'));
      return;
    }
    const r2 = await apiPost('/api/subscriptions/bot', { telegram_id: tg_id, type: type2, value: value2 });
    if (r2 && r2.ok) {
      const icon2 = type2 === 'car' ? '\u{1F697}' : '\u{1F464}';
      const displayName = (r2.display) || value2;
      const clsLabel = r2.cls ? ' [' + r2.cls + ']' : '';
      await sendMsg(chat_id, '\u2705 ' + icon2 + ' \u041F\u043E\u0434\u043F\u0438\u0441\u0430\u043B\u0441\u044F \u043D\u0430 ' + (type2 === 'car' ? '\u043C\u0430\u0448\u0438\u043D\u0443' : '\u0430\u0432\u0442\u043E\u0440\u0430') + ' <b>' + displayName + clsLabel + '</b>\n\u{1F514} \u0411\u0443\u0434\u0435\u0448\u044C \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E \u043D\u043E\u0432\u044B\u0445 \u0441\u0431\u043E\u0440\u043A\u0430\u0445!');
    } else {
      await sendMsg(chat_id, '\u274C ' + (r2 && r2.error ? r2.error : '\u041E\u0448\u0438\u0431\u043A\u0430.'));
    }
    return;
  }

  if (text.startsWith('/unsubscribe_car ') || text.startsWith('/unsubscribe_author ')) {
    const parts3 = text.split(' ');
    const type3  = parts3[0] === '/unsubscribe_car' ? 'car' : 'author';
    const value3 = parts3.slice(1).join(' ').trim();
    if (!value3) { await sendMsg(chat_id, '\u274C \u0423\u043A\u0430\u0436\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435.'); return; }
    const r3 = await apiPost('/api/subscriptions/bot-delete', { telegram_id: tg_id, type: type3, value: value3 });
    await sendMsg(chat_id, r3 && r3.ok ? '\u2705 \u041E\u0442\u043F\u0438\u0441\u0430\u043B\u0441\u044F \u043E\u0442 <b>' + value3 + '</b>' : '\u274C \u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.');
    return;
  }

  if (text === '/help') {
    await sendMsg(chat_id,
      '<b>APEXEL Bot \u2014 \u043A\u043E\u043C\u0430\u043D\u0434\u044B:</b>\n\n' +
      '\u{1F511} /verify \u2014 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u043E\u0434 \u0432\u0435\u0440\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0438\n' +
      '\u{1F517} /unlink \u2014 \u043E\u0442\u0432\u044F\u0437\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\n\n' +
      '\u{1F4CB} /mysubscriptions \u2014 \u043C\u043E\u0438 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438\n' +
      '\u{1F697} /subscribe_car [\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435] \u2014 \u043D\u043E\u0432\u044B\u0435 \u0441\u0431\u043E\u0440\u043A\u0438 \u043D\u0430 \u043C\u0430\u0448\u0438\u043D\u0443\n' +
      '\u{1F464} /subscribe_author [username] \u2014 \u043D\u0430 \u0430\u0432\u0442\u043E\u0440\u0430\n' +
      '/unsubscribe_car [id] \u2014 \u043E\u0442\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F\n' +
      '/unsubscribe_author [username] \u2014 \u043E\u0442\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F'
    );
    return;
  }

  // Unrecognised
  await sendMsg(chat_id,
    `Нажми кнопку или отправь /help для списка команд`
  );
}

// ─── INTERNAL HTTP SERVER (for main server to call) ───────────────
// POST /verify-code  { code, expected_tg_user? }
// Returns { ok, telegram_id, telegram_username } or { ok: false, error }
const botServer = http.createServer((req, res) => {
  const setJSON = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  if (req.method === 'POST' && req.url === '/unlink-tg') {
    const secret = req.headers['x-bot-secret'] || '';
    if (secret !== API_SECRET) return setJSON(403, { error: 'forbidden' });
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      let data; try { data = JSON.parse(body); } catch { return setJSON(400, {}); }
      // Call main server to unlink
      const http2 = require('http');
      const payload = JSON.stringify({ telegram_id: data.telegram_id });
      const r2 = http2.request({
        hostname: '127.0.0.1', port: MAIN_PORT, path: '/api/internal/unlink-telegram',
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'x-internal-secret': API_SECRET }
      }, res2 => { let b=''; res2.on('data',c=>b+=c); res2.on('end',()=>{ try{setJSON(200,JSON.parse(b))}catch{setJSON(200,{ok:true})} }); });
      r2.on('error', () => setJSON(500, { error: 'server error' }));
      r2.write(payload); r2.end();
    });
    return;
  }
  if (req.method !== 'POST' || req.url !== '/verify-code') {
    return setJSON(404, { error: 'not found' });
  }

  // Validate secret header
  const secret = req.headers['x-bot-secret'] || '';
  if (secret !== API_SECRET) return setJSON(403, { error: 'forbidden' });

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    let data;
    try { data = JSON.parse(body); } catch { return setJSON(400, { error: 'bad json' }); }

    const { code } = data;
    if (!code) return setJSON(400, { error: 'code required' });

    cleanExpired();
    const entry = pending.get(String(code));
    if (!entry) return setJSON(400, { error: 'Код неверный или истёк срок действия' });

    // Consume code (one-time use)
    pending.delete(String(code));
    setJSON(200, { ok: true, telegram_id: entry.telegram_id, telegram_username: entry.telegram_username });
  });
});

// ─── TELEGRAM LONG POLLING ────────────────────────────────────────
let offset = 0;

async function poll() {
  try {
    const upd = await tgPost('getUpdates', { offset, timeout: 30, allowed_updates: ['message'] });
    if (upd.result && upd.result.length > 0) {
      for (const u of upd.result) {
        offset = u.update_id + 1;
        handleUpdate(u).catch(e => console.error('[bot] handler error:', e.message));
      }
    }
  } catch (e) {
    console.error('[bot] poll error:', e.message);
    await new Promise(r => setTimeout(r, 5000));
  }
  setImmediate(poll);
}

// ─── STARTUP ─────────────────────────────────────────────────────
botServer.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error(`[bot] Порт ${API_PORT} уже занят — завершите старый процесс бота.`);
    console.error(`[bot] Windows: taskkill /F /IM node.exe  (или используйте start_bot.bat)`);
    process.exit(1);
  }
  throw e;
});

botServer.listen(API_PORT, '127.0.0.1', () => {
  console.log(`[bot] Internal API listening on 127.0.0.1:${API_PORT}`);
});

// Delete webhook to use long polling
tgPost('deleteWebhook', {}).then(() => {
  console.log(`[bot] Starting long polling...`);
  poll();
  tgPost('getMe', {}).then(r => {
    if (r.result) {
      console.log(`[bot] Running as @${r.result.username}`);
      // Save username into config file so main server can return it to frontend
      try {
        const saved = fs.existsSync(CFG_FILE) ? JSON.parse(fs.readFileSync(CFG_FILE, 'utf8')) : {};
        saved.BOT_USERNAME = r.result.username;
        fs.writeFileSync(CFG_FILE, JSON.stringify(saved, null, 2));
      } catch(e) { console.error('[bot] cfg write:', e.message); }
    }
  });
}).catch(e => console.error('[bot] startup error:', e.message));

// Periodic cleanup
setInterval(cleanExpired, 60_000);
