/**
 * APEXEL Backend — with better-sqlite3
 */
'use strict';

const http     = require('http');
const fs       = require('fs');
const path     = require('path');
const crypto   = require('crypto');
const Database = require('better-sqlite3');

// ─── CONFIG ──────────────────────────────────────────────────
const PORT     = process.env.PORT || 3000;
// Persist secret so tokens survive server restarts
const SECRET_FILE = path.join(__dirname, '.jwt_secret');
let JWT_SECRET;
if (process.env.JWT_SECRET) {
  JWT_SECRET = process.env.JWT_SECRET;
} else if (fs.existsSync(SECRET_FILE)) {
  JWT_SECRET = fs.readFileSync(SECRET_FILE, 'utf8').trim();
} else {
  JWT_SECRET = crypto.randomBytes(32).toString('hex');
  try { fs.writeFileSync(SECRET_FILE, JWT_SECRET); } catch(e) { /* read-only FS — set JWT_SECRET env var to persist tokens */ }
}
const STATIC_DIR = path.resolve(__dirname, 'public');  // ← ИСПРАВЛЕНО: теперь указывает на папку public

// ─── TELEGRAM BOT CONFIG ──────────────────────────────────────────
const BOT_CFG_FILE = path.join(__dirname, 'bot.config.json');
let BOT_CFG = {};
if (fs.existsSync(BOT_CFG_FILE)) {
  try { BOT_CFG = JSON.parse(fs.readFileSync(BOT_CFG_FILE, 'utf8')); } catch {}
}
const BOT_INTERNAL_PORT = process.env.BOT_PORT   || BOT_CFG.API_PORT   || 3001;
const BOT_SECRET        = process.env.API_SECRET  || BOT_CFG.API_SECRET || 'apexel_bot_secret';
const BOT_ENABLED       = !!process.env.BOT_TOKEN  || !!BOT_CFG.BOT_TOKEN;
const DB_FILE = process.env.DB_PATH ||
               (process.env.RAILWAY_VOLUME_MOUNT_PATH
                 ? require('path').join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'apexel.db')
                 : require('path').resolve(__dirname, 'apexel.db'));

// ─── DATABASE ─────────────────────────────────────────────────
const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  username  TEXT    UNIQUE NOT NULL COLLATE NOCASE,
  email     TEXT    UNIQUE NOT NULL COLLATE NOCASE,
  password  TEXT    NOT NULL,
  role      TEXT    NOT NULL DEFAULT 'user',
  avatar    TEXT    DEFAULT '',
  banned    INTEGER DEFAULT 0,
  ban_until INTEGER DEFAULT NULL,
  ban_reason TEXT   DEFAULT '',
  created_at INTEGER DEFAULT (unixepoch()),
  telegram_id INTEGER DEFAULT NULL,
  telegram_username TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cars (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  maker      TEXT NOT NULL,
  cls        TEXT NOT NULL DEFAULT 'D',
  image      TEXT DEFAULT '',
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS builds (
  id         TEXT PRIMARY KEY,
  car_id     TEXT NOT NULL,
  user_id    INTEGER NOT NULL,
  name       TEXT NOT NULL,
  author     TEXT NOT NULL,
  desc       TEXT DEFAULT '',
  parts      TEXT DEFAULT '{}',
  image      TEXT DEFAULT '',
  likes      INTEGER DEFAULT 0,
  dislikes   INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  is_recommended INTEGER DEFAULT 0,
  recommended_by TEXT DEFAULT '',
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vinyls (
  id         TEXT PRIMARY KEY,
  car_id     TEXT NOT NULL,
  user_id    INTEGER NOT NULL,
  name       TEXT NOT NULL,
  author     TEXT NOT NULL,
  desc       TEXT DEFAULT '',
  image      TEXT DEFAULT '',
  likes      INTEGER DEFAULT 0,
  dislikes   INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  target_type TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  user_id    INTEGER NOT NULL,
  author     TEXT NOT NULL,
  text       TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS votes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  target_type TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  vote        TEXT NOT NULL CHECK(vote IN ('like','dislike')),
  UNIQUE(user_id, target_type, target_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guides (
  id         TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT NOT NULL,
  blocks     TEXT DEFAULT '[]',
  views      INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id INTEGER,
  target_type TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  reason     TEXT NOT NULL,
  comment    TEXT DEFAULT '',
  status     TEXT DEFAULT 'open',
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS news (
  id         TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  tag        TEXT DEFAULT 'info',
  author     TEXT NOT NULL,
  pinned     INTEGER DEFAULT 0,
  has_img    INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news_images (
  news_id TEXT PRIMARY KEY,
  data    TEXT NOT NULL,
  FOREIGN KEY(news_id) REFERENCES news(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_chats (
  session_id TEXT PRIMARY KEY,
  username   TEXT DEFAULT '',
  closed     INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS support_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  from_role  TEXT NOT NULL CHECK(from_role IN ('user','support')),
  text       TEXT NOT NULL,
  is_system  INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(session_id) REFERENCES support_chats(session_id) ON DELETE CASCADE
);
`);

// ─── MIGRATIONS (safe ALTER TABLE for existing DBs) ─────────────
(function migrate() {
  try { db.exec("ALTER TABLE users ADD COLUMN telegram_id INTEGER DEFAULT NULL"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN telegram_username TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE builds ADD COLUMN is_recommended INTEGER DEFAULT 0"); } catch {}
  try { db.exec("ALTER TABLE builds ADD COLUMN recommended_by TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE builds ADD COLUMN tags TEXT DEFAULT ''"); } catch {}
  // Subscriptions: notify user when new build posted for a car or by an author
  // User follows (profile subscriptions)
  try { db.exec(`CREATE TABLE IF NOT EXISTS user_follows (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    target_username TEXT NOT NULL COLLATE NOCASE,
    created_at  INTEGER DEFAULT (unixepoch()),
    UNIQUE(follower_id, target_username)
  )`); } catch {}
  try { db.exec(`CREATE TABLE IF NOT EXISTS subscriptions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER NOT NULL,
    type       TEXT NOT NULL CHECK(type IN ('car','author')),
    value      TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    UNIQUE(telegram_id, type, value)
  )`); } catch {}
})();

// ─── HELPERS ─────────────────────────────────────────────────
function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function hashPassword(pwd) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(pwd, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(pwd, stored) {
  const [salt, hash] = stored.split(':');
  const h = crypto.pbkdf2Sync(pwd, salt, 100000, 64, 'sha512').toString('hex');
  return h === hash;
}

const TOKEN_TTL = 30 * 24 * 3600;

// Notify a Telegram user via HTTP (no SSL issues)
function notifyTelegram(token, chatId, text) {
  const data = JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' });
  const req = require('http').request({
    hostname: 'api.telegram.org', port: 80,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, res => { res.resume(); });
  req.on('error', e => console.error('[notify tg]', e.message));
  req.write(data); req.end();
} // 30 дней в секундах

function makeToken(userId) {
  const payload = Buffer.from(JSON.stringify({ id: userId, t: Date.now(), exp: Math.floor(Date.now()/1000) + TOKEN_TTL })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url');
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    // Проверяем срок действия токена
    if (data.exp && data.exp < Math.floor(Date.now()/1000)) return null;
    return data;
  } catch { return null; }
}

function getUser(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(payload.id);
  if (!user || user.banned) return null;
  if (user.ban_until && user.ban_until < Math.floor(Date.now()/1000)) {
    db.prepare('UPDATE users SET banned=0,ban_until=NULL WHERE id=?').run(user.id);
    return user;
  }
  if (user.ban_until && user.ban_until > Math.floor(Date.now()/1000)) return null;
  return user;
}

function requireAuth(user, res) {
  if (!user) { json(res, 401, { error: 'Unauthorized' }); return false; }
  return true;
}

function requireAdmin(user, res) {
  if (!user) { json(res, 401, { error: 'Unauthorized' }); return false; }
  if (user.role !== 'admin') { json(res, 403, { error: 'Forbidden' }); return false; }
  return true;
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS' });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 10 * 1024 * 1024) reject(new Error('too large')); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

function serveFile(res, filePath, req) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.webm':'video/webm', '.gif':'image/gif', '.mp3':'audio/mpeg', '.woff2':'font/woff2' }[ext] || 'application/octet-stream';

  // Range requests для видео (нужно чтобы <video> мог начать воспроизведение)
  const isVideo = ext === '.mp4' || ext === '.webm';
  if (isVideo) {
    let stat;
    try { stat = fs.statSync(filePath); } catch(e) {
      console.error('[video 404]', filePath);
      res.writeHead(404); res.end('Not found'); return;
    }
    const total = stat.size;
    const rangeHeader = req && req.headers && req.headers.range;
    if (rangeHeader) {
      const [startStr, endStr] = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10) || 0;
      const end   = endStr ? parseInt(endStr, 10) : Math.min(start + 2 * 1024 * 1024, total - 1);
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });
      stream.on('error', e => { console.error('[video stream]', e.message); try { res.end(); } catch {} });
      res.writeHead(206, {
        'Content-Range':  `bytes ${start}-${end}/${total}`,
        'Accept-Ranges':  'bytes',
        'Content-Length': chunkSize,
        'Content-Type':   mime,
        'Cache-Control':  'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      stream.pipe(res);
    } else {
      // No range — send full file with streaming
      res.writeHead(200, {
        'Content-Type':   mime,
        'Content-Length': total,
        'Accept-Ranges':  'bytes',
        'Cache-Control':  'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      fs.createReadStream(filePath).pipe(res);
    }
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { console.error('[static 404]', filePath); res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime, 'Content-Length': data.length, 'Accept-Ranges': 'bytes', 'Cache-Control': 'public,max-age=3600', 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  });
}

// ─── ROUTER ──────────────────────────────────────────────────
const routes = [];
function route(method, pattern, handler) {
  routes.push({ method, pattern, handler });
}

function matchRoute(method, url) {
  for (const r of routes) {
    if (r.method !== method && r.method !== 'ALL') continue;
    const keys = [];
    const regStr = '^' + r.pattern.replace(/:([^/]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$';
    const m = url.match(new RegExp(regStr));
    if (m) return { handler: r.handler, params: Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i+1])])) };
  }
  return null;
}

// ─── BOT VERIFY HELPER ───────────────────────────────────────────
function verifyTelegramCode(code) {
  return new Promise((resolve) => {
    if (!BOT_ENABLED) return resolve({ ok: true, telegram_id: null, telegram_username: '' });
    const body = JSON.stringify({ code });
    const req = require('http').request({
      hostname: '127.0.0.1', port: BOT_INTERNAL_PORT,
      path: '/verify-code', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'x-bot-secret': BOT_SECRET }
    }, res => {
      let buf = ''; res.on('data', c => buf += c);
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch { resolve({ ok: false, error: 'parse error' }); } });
    });
    req.on('error', () => resolve({ ok: false, error: 'Бот недоступен' }));
    req.write(body); req.end();
  });
}

// ─── AUTH ROUTES ─────────────────────────────────────────────
route('POST', '/api/auth/register', async (req, res) => {
  const { username, email, password, tg_code } = await parseBody(req);
  if (!username || !email || !password) return json(res, 400, { error: 'Заполните все поля' });
  if (username.length < 3) return json(res, 400, { error: 'Имя минимум 3 символа' });
  if (password.length < 6) return json(res, 400, { error: 'Пароль минимум 6 символов' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(res, 400, { error: 'Неверный email' });

  // Telegram verification (required if bot is enabled)
  let tg_id = null, tg_username = '';
  if (BOT_ENABLED) {
    if (!tg_code) return json(res, 400, { error: 'Введите код верификации Telegram' });
    const vr = await verifyTelegramCode(tg_code.trim());
    if (!vr.ok) return json(res, 400, { error: vr.error || 'Неверный код Telegram' });
    tg_id = vr.telegram_id;
    tg_username = vr.telegram_username || '';
    // Check tg_id not already registered
    if (tg_id) {
      const tgExist = db.prepare('SELECT id FROM users WHERE telegram_id=?').get(tg_id);
      if (tgExist) return json(res, 409, { error: 'Этот Telegram уже привязан к другому аккаунту' });
    }
  }

  const existing = db.prepare('SELECT id FROM users WHERE username=? OR email=?').get(username, email);
  if (existing) return json(res, 409, { error: 'Пользователь уже существует' });

  const isFirst = db.prepare('SELECT COUNT(*) as c FROM users').get().c === 0;
  const role = isFirst ? 'admin' : 'user';
  const hashed = hashPassword(password);
  const info = db.prepare('INSERT INTO users (username,email,password,role,telegram_id,telegram_username) VALUES (?,?,?,?,?,?)').run(username, email, hashed, role, tg_id, tg_username);
  const token = makeToken(info.lastInsertRowid);
  json(res, 200, { token, user: { id: info.lastInsertRowid, username, email, role, telegram_username: tg_username } });
});


// ─── SEED CARS (if DB empty) ─────────────────────────────────────
(function seedCars() {
  const count = db.prepare('SELECT COUNT(*) as c FROM cars').get().c;
  if (count > 0) return; // already seeded

  const NFS_CARS = [
    // S CLASS
    {id:'c_gtr_r34',   name:'Skyline GT-R R34',     maker:'Nissan',      cls:'S', img:'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=600&q=65'},
    {id:'c_rx7_fd',    name:'RX-7 Spirit R',        maker:'Mazda',       cls:'S', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=65'},
    {id:'c_m3_gtr',    name:'M3 GTR E46',           maker:'BMW',         cls:'S', img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=65'},
    {id:'c_supra_mk4', name:'Supra RZ',              maker:'Toyota',      cls:'S', img:'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&q=65'},
    {id:'c_evo9',      name:'Lancer Evolution IX',   maker:'Mitsubishi',  cls:'S', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=65'},
    {id:'c_wrx_sti',   name:'Impreza WRX STI',      maker:'Subaru',      cls:'S', img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=65'},
    {id:'c_gto_tt',    name:'3000GT VR-4',           maker:'Mitsubishi',  cls:'S', img:'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=65'},
    {id:'c_nsx_r',     name:'NSX-R',                maker:'Honda',       cls:'S', img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=65'},
    {id:'c_gtr_r35',   name:'GT-R R35',             maker:'Nissan',      cls:'S', img:'https://images.unsplash.com/photo-1616455579100-2ceaa4eb6d37?w=600&q=65'},
    {id:'c_458',       name:'458 Italia',            maker:'Ferrari',     cls:'S', img:'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=65'},
    {id:'c_gallardo',  name:'Gallardo LP 560-4',    maker:'Lamborghini', cls:'S', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=65'},
    {id:'c_carrera_gt',name:'Carrera GT',            maker:'Porsche',     cls:'S', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=65'},
    {id:'c_mclaren_f1',name:'McLaren F1',            maker:'McLaren',     cls:'S', img:'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&q=65'},
    {id:'c_bugatti',   name:'Veyron 16.4',          maker:'Bugatti',     cls:'S', img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=65'},
    // A CLASS
    {id:'c_s2000',     name:'S2000',                maker:'Honda',       cls:'A', img:'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&q=65'},
    {id:'c_350z',      name:'350Z',                 maker:'Nissan',      cls:'A', img:'https://images.unsplash.com/photo-1619037961390-f2047d89bc55?w=600&q=65'},
    {id:'c_gt86',      name:'GT86',                 maker:'Toyota',      cls:'A', img:'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=65'},
    {id:'c_civic_si',  name:'Civic Si',             maker:'Honda',       cls:'A', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=65'},
    {id:'c_m3_e92',    name:'M3 E92',               maker:'BMW',         cls:'A', img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=65'},
    {id:'c_rs4',       name:'RS4',                  maker:'Audi',        cls:'A', img:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=65'},
    {id:'c_mustang',   name:'Mustang GT500',         maker:'Ford',        cls:'A', img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=65'},
    {id:'c_charger',   name:'Charger SRT8',         maker:'Dodge',       cls:'A', img:'https://images.unsplash.com/photo-1518987048-93e29699e79a?w=600&q=65'},
    {id:'c_camaro_ss', name:'Camaro SS',            maker:'Chevrolet',   cls:'A', img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=65'},
    {id:'c_lancer8',   name:'Lancer Evolution VIII', maker:'Mitsubishi',  cls:'A', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=65'},
    {id:'c_silvia',    name:'Silvia S15',           maker:'Nissan',      cls:'A', img:'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=600&q=65'},
    {id:'c_rx8',       name:'RX-8',                maker:'Mazda',       cls:'A', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=65'},
    {id:'c_sti_07',    name:'Impreza WRX STI 07',  maker:'Subaru',      cls:'A', img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=65'},
    {id:'c_c63',       name:'C63 AMG',              maker:'Mercedes',    cls:'A', img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=65'},
    // B CLASS
    {id:'c_golf_gti',  name:'Golf GTI Mk5',         maker:'Volkswagen',  cls:'B', img:'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=65'},
    {id:'c_integra',   name:'Integra Type-R DC5',   maker:'Honda',       cls:'B', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=65'},
    {id:'c_240sx',     name:'240SX',                maker:'Nissan',      cls:'B', img:'https://images.unsplash.com/photo-1619037961390-f2047d89bc55?w=600&q=65'},
    {id:'c_eclipse',   name:'Eclipse GS-T',         maker:'Mitsubishi',  cls:'B', img:'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=65'},
    {id:'c_mx5',       name:'MX-5 Miata',           maker:'Mazda',       cls:'B', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=65'},
    {id:'c_cobalt_ss', name:'Cobalt SS',            maker:'Chevrolet',   cls:'B', img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=65'},
    {id:'c_focus_st',  name:'Focus ST',             maker:'Ford',        cls:'B', img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=65'},
    {id:'c_mini_jcw',  name:'Mini Cooper JCW',      maker:'MINI',        cls:'B', img:'https://images.unsplash.com/photo-1616455579100-2ceaa4eb6d37?w=600&q=65'},
    {id:'c_boxster',   name:'Boxster S',            maker:'Porsche',     cls:'B', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=65'},
    {id:'c_tt',        name:'TT 3.2',               maker:'Audi',        cls:'B', img:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=65'},
    // C CLASS
    {id:'c_civic_em',  name:'Civic Si EM2',         maker:'Honda',       cls:'C', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=65'},
    {id:'c_sentra',    name:'Sentra SE-R',          maker:'Nissan',      cls:'C', img:'https://images.unsplash.com/photo-1619037961390-f2047d89bc55?w=600&q=65'},
    {id:'c_corolla',   name:'Corolla GT-S AE86',    maker:'Toyota',      cls:'C', img:'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&q=65'},
    {id:'c_tiburon',   name:'Tiburon GT',           maker:'Hyundai',     cls:'C', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=65'},
    {id:'c_passat',    name:'Passat W8',            maker:'Volkswagen',  cls:'C', img:'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=65'},
    {id:'c_leon',      name:'León Cupra R',         maker:'SEAT',        cls:'C', img:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=65'},
    // D CLASS
    {id:'c_punto',     name:'Punto HGT',            maker:'Fiat',        cls:'D', img:'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=65'},
    {id:'c_polo',      name:'Polo GTI',             maker:'Volkswagen',  cls:'D', img:'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=65'},
    {id:'c_clio',      name:'Clio RS',              maker:'Renault',     cls:'D', img:'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=65'},
    {id:'c_saxo',      name:'Saxo VTS',             maker:'Citroën',     cls:'D', img:'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=65'},
    // E CLASS
    {id:'c_206',       name:'206 RC',               maker:'Peugeot',     cls:'E', img:'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=65'},
    {id:'c_yaris',     name:'Yaris TS',             maker:'Toyota',      cls:'E', img:'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&q=65'},
    {id:'c_fiesta',    name:'Fiesta ST',            maker:'Ford',        cls:'E', img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=65'},
  ];

  const insert = db.prepare('INSERT OR IGNORE INTO cars (id,name,maker,cls,image) VALUES (?,?,?,?,?)');
  const insertAll = db.transaction((cars) => {
    for (const c of cars) insert.run(c.id, c.name, c.maker, c.cls, c.img||'');
  });
  insertAll(NFS_CARS);
  console.log('[seed] Inserted', NFS_CARS.length, 'cars');
})();

route('GET', '/api/auth/bot-status', async (req, res) => {
  json(res, 200, { bot_enabled: BOT_ENABLED, bot_username: BOT_CFG.BOT_USERNAME || '' });
});

route('POST', '/api/auth/login', async (req, res) => {
  const { login, password } = await parseBody(req);
  if (!login || !password) return json(res, 400, { error: 'Заполните все поля' });
  const user = db.prepare('SELECT * FROM users WHERE username=? OR email=?').get(login, login);
  if (!user) return json(res, 401, { error: 'Неверный логин или пароль' });
  if (!verifyPassword(password, user.password)) return json(res, 401, { error: 'Неверный логин или пароль' });
  if (user.banned) {
    if (!user.ban_until || user.ban_until > Math.floor(Date.now()/1000))
      return json(res, 403, { error: 'Аккаунт заблокирован' + (user.ban_reason ? ': ' + user.ban_reason : '') });
    db.prepare('UPDATE users SET banned=0,ban_until=NULL WHERE id=?').run(user.id);
  }
  const token = makeToken(user.id);
  json(res, 200, { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
});

route('GET', '/api/auth/me', async (req, res) => {
  // Check raw token even if banned - to return ban info
  const auth = req.headers['authorization'] || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const raw = db.prepare('SELECT * FROM users WHERE id=?').get(payload.id);
      if (raw && raw.banned) {
        const now = Math.floor(Date.now()/1000);
        if (!raw.ban_until || raw.ban_until > now) {
          return json(res, 403, { error: 'banned', banned: true, ban_reason: raw.ban_reason || '', ban_until: raw.ban_until || null });
        }
        // Expired ban - lift it
        db.prepare('UPDATE users SET banned=0,ban_until=NULL WHERE id=?').run(raw.id);
      }
    }
  }
  const user = getUser(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  json(res, 200, { id: user.id, username: user.username, email: user.email, role: user.role });
});

route('POST', '/api/auth/logout', async (req, res) => {
  json(res, 200, { ok: true });
});

// ─── USERS (admin) ───────────────────────────────────────────
route('GET', '/api/users', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const users = db.prepare('SELECT id,username,email,role,banned,ban_until,ban_reason,created_at,telegram_id,telegram_username FROM users').all();
  json(res, 200, users);
});

route('PATCH', '/api/users/:id/role', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { role } = await parseBody(req);
  if (!['user','admin','pro'].includes(role)) return json(res, 400, { error: 'Invalid role' });
  db.prepare('UPDATE users SET role=? WHERE id=?').run(role, req.params.id);
  json(res, 200, { ok: true });
});

route('POST', '/api/users/:id/ban', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { days, reason } = await parseBody(req);
  const until = days === 0 ? null : Math.floor(Date.now()/1000) + days * 86400;
  db.prepare('UPDATE users SET banned=1,ban_until=?,ban_reason=? WHERE id=?').run(until, reason || '', req.params.id);
  json(res, 200, { ok: true });
});

route('POST', '/api/users/:id/unban', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  db.prepare("UPDATE users SET banned=0,ban_until=NULL,ban_reason='' WHERE id=?").run(req.params.id);
  json(res, 200, { ok: true });
});


route('DELETE', '/api/users/:id/telegram', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  db.prepare("UPDATE users SET telegram_id=NULL,telegram_username='' WHERE id=?").run(req.params.id);
  json(res, 200, { ok: true });
});

route('POST', '/api/users/me/telegram-link', async (req, res) => {
  const user = getUser(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  const { tg_code } = await parseBody(req);
  if (!tg_code) return json(res, 400, { error: 'Код обязателен' });
  if (!BOT_ENABLED) return json(res, 400, { error: 'Бот не подключён' });
  const vr = await verifyTelegramCode(tg_code.trim());
  if (!vr.ok) return json(res, 400, { error: vr.error || 'Неверный код' });
  const exist = db.prepare('SELECT id FROM users WHERE telegram_id=? AND id!=?').get(vr.telegram_id, user.id);
  if (exist) return json(res, 409, { error: 'Этот Telegram уже привязан к другому аккаунту' });
  db.prepare("UPDATE users SET telegram_id=?,telegram_username=? WHERE id=?").run(vr.telegram_id, vr.telegram_username||'', user.id);
  json(res, 200, { ok: true, telegram_username: vr.telegram_username||'' });
});


// ─── BOT SUBSCRIPTION ENDPOINTS (internal secret auth) ────────
route('GET', '/api/subscriptions/bot', async (req, res) => {
  const secret = req.headers['x-internal-secret'] || '';
  if (secret !== BOT_CFG.API_SECRET && secret !== 'apexel_bot_secret') return json(res, 403, {});
  const url = new URL('http://x' + req.url);
  const tgId = parseInt(url.searchParams.get('tg'));
  if (!tgId) return json(res, 400, { error: 'tg required' });
  const rows = db.prepare('SELECT * FROM subscriptions WHERE telegram_id=?').all(tgId);
  json(res, 200, rows);
});

route('POST', '/api/subscriptions/bot', async (req, res) => {
  const secret = req.headers['x-internal-secret'] || '';
  if (secret !== BOT_CFG.API_SECRET && secret !== 'apexel_bot_secret') return json(res, 403, {});
  const { telegram_id, type, value } = await parseBody(req);
  if (!telegram_id || !type || !value) return json(res, 400, { error: 'Missing fields' });

  let displayName = value.toLowerCase();

  if (type === 'car') {
    // Search car by name (fuzzy: "rx7", "rx-7", "mazda rx7" all match)
    const search = value.toLowerCase().replace(/[-_]/g,' ').trim();
    const cars = db.prepare('SELECT id, name, maker, cls FROM cars').all();
    const match = cars.find(c => {
      const full = (c.maker + ' ' + c.name).toLowerCase().replace(/[-_]/g,' ');
      const nameOnly = c.name.toLowerCase().replace(/[-_]/g,' ');
      return full.includes(search) || nameOnly.includes(search) || search.includes(nameOnly);
    });
    if (!match) {
      return json(res, 404, { error: 'Машина не найдена. Попробуй полное название, например: Mazda RX-7' });
    }
    displayName = (match.maker + ' ' + match.name).toLowerCase();
    return (function(){
      try {
        db.prepare('INSERT OR IGNORE INTO subscriptions (telegram_id,type,value) VALUES (?,?,?)').run(telegram_id, type, displayName);
        json(res, 201, { ok: true, display: match.maker + ' ' + match.name, cls: match.cls });
      } catch(e) { json(res, 500, { error: e.message }); }
    })();
  }

  // author — store as-is lowercase
  try {
    db.prepare('INSERT OR IGNORE INTO subscriptions (telegram_id,type,value) VALUES (?,?,?)').run(telegram_id, type, displayName);
    json(res, 201, { ok: true, display: value });
  } catch(e) { json(res, 500, { error: e.message }); }
});

route('POST', '/api/subscriptions/bot-delete', async (req, res) => {
  const secret = req.headers['x-internal-secret'] || '';
  if (secret !== BOT_CFG.API_SECRET && secret !== 'apexel_bot_secret') return json(res, 403, {});
  const { telegram_id, type, value } = await parseBody(req);
  if (!telegram_id || !type || !value) return json(res, 400, { error: 'Missing fields' });

  if (type === 'car') {
    // Try exact match first, then fuzzy by car name
    const search = value.toLowerCase().replace(/[-_]/g,' ').trim();
    const cars = db.prepare('SELECT id, name, maker FROM cars').all();
    const match = cars.find(c => {
      const full = (c.maker + ' ' + c.name).toLowerCase().replace(/[-_]/g,' ');
      const nameOnly = c.name.toLowerCase().replace(/[-_]/g,' ');
      return full.includes(search) || nameOnly.includes(search) || search.includes(nameOnly);
    });
    const storedName = match ? (match.maker + ' ' + match.name).toLowerCase() : value.toLowerCase();
    const result = db.prepare('DELETE FROM subscriptions WHERE telegram_id=? AND type=? AND lower(value)=?').run(telegram_id, type, storedName);
    return json(res, 200, { ok: result.changes > 0 });
  }

  const result = db.prepare('DELETE FROM subscriptions WHERE telegram_id=? AND type=? AND lower(value)=?').run(telegram_id, type, value.toLowerCase());
  json(res, 200, { ok: result.changes > 0 });
});

route('POST', '/api/internal/unlink-telegram', async (req, res) => {
  const secret = req.headers['x-internal-secret'] || '';
  if (secret !== BOT_SECRET) return json(res, 403, { error: 'forbidden' });
  const { telegram_id } = await parseBody(req);
  if (!telegram_id) return json(res, 400, { error: 'telegram_id required' });
  const u = db.prepare('SELECT id FROM users WHERE telegram_id=?').get(telegram_id);
  if (!u) return json(res, 404, { ok: false, error: 'not found' });
  db.prepare("UPDATE users SET telegram_id=NULL,telegram_username='' WHERE id=?").run(u.id);
  json(res, 200, { ok: true });
});

route('DELETE', '/api/users/me/telegram-link', async (req, res) => {
  const user = getUser(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  db.prepare("UPDATE users SET telegram_id=NULL,telegram_username='' WHERE id=?").run(user.id);
  json(res, 200, { ok: true });
});

// ─── PROFILE / AVATAR ─────────────────────────────────────────
route('GET', '/api/users/:username/profile', async (req, res) => {
  const u = db.prepare('SELECT id,username,role,avatar,created_at FROM users WHERE username=? COLLATE NOCASE').get(req.params.username);
  if (!u) return json(res, 404, { error: 'Not found' });
  // builds
  const builds = db.prepare('SELECT b.*,c.name as car_name,c.maker as car_maker,c.cls as car_cls FROM builds b LEFT JOIN cars c ON b.car_id=c.id WHERE b.user_id=? ORDER BY b.created_at DESC').all(u.id);
  const buildsOut = builds.map(b => ({ ...b, parts: JSON.parse(b.parts||'{}') }));
  // vinyls
  const vinyls = db.prepare('SELECT v.*,c.name as car_name,c.maker as car_maker FROM vinyls v LEFT JOIN cars c ON v.car_id=c.id WHERE v.user_id=? ORDER BY v.created_at DESC').all(u.id);
  // guides
  const guides = db.prepare('SELECT id,title,views,created_at FROM guides WHERE user_id=? ORDER BY created_at DESC').all(u.id);
  json(res, 200, { user: u, builds: buildsOut, vinyls, guides });
});

route('PATCH', '/api/users/me/avatar', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const { avatar } = await parseBody(req);
  if (!avatar) return json(res, 400, { error: 'No avatar data' });
  if (avatar.length > 500000) return json(res, 400, { error: 'Image too large (max ~375KB)' });
  db.prepare('UPDATE users SET avatar=? WHERE id=?').run(avatar, user.id);
  json(res, 200, { ok: true });
});


// ─── CARS ─────────────────────────────────────────────────────
route('GET', '/api/cars', async (req, res) => {
  const cars = db.prepare('SELECT * FROM cars ORDER BY name').all();
  json(res, 200, cars);
});

route('POST', '/api/cars', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { id, name, maker, cls, image } = await parseBody(req);
  if (!id || !name || !maker) return json(res, 400, { error: 'Missing fields' });
  db.prepare('INSERT OR REPLACE INTO cars (id,name,maker,cls,image) VALUES (?,?,?,?,?)').run(id, name, maker, cls||'D', image||'');
  json(res, 200, { ok: true });
});

// Bulk sync cars from frontend cars.js — called once on page load
route('POST', '/api/cars/sync', async (req, res) => {
  const { cars } = await parseBody(req);
  if (!Array.isArray(cars)) return json(res, 400, { error: 'Expected array' });
  const insert = db.prepare('INSERT OR IGNORE INTO cars (id,name,maker,cls,image) VALUES (?,?,?,?,?)');
  for (const c of cars) insert.run(c.id||'', c.name||'', c.maker||c.make||'Unknown', c.cls||c.class||'D', c.img||c.image||'');
  json(res, 200, { synced: cars.length });
});

route('DELETE', '/api/cars/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  db.prepare('DELETE FROM cars WHERE id=?').run(req.params.id);
  json(res, 200, { ok: true });
});

// ─── BUILDS ───────────────────────────────────────────────────
route('GET', '/api/builds', async (req, res) => {
  const url = new URL('http://x' + req.url);
  const carId = url.searchParams.get('car');
  const stmt = carId
    ? db.prepare('SELECT b.*,u.username,u.role as user_role FROM builds b LEFT JOIN users u ON b.user_id=u.id WHERE b.car_id=? ORDER BY b.is_recommended DESC, b.created_at DESC').all(carId)
    : db.prepare('SELECT b.*,u.username,u.role as user_role FROM builds b LEFT JOIN users u ON b.user_id=u.id ORDER BY b.likes DESC LIMIT 50').all();
  const builds = stmt.map(b => ({ ...b, parts: JSON.parse(b.parts || '{}') }));
  json(res, 200, builds);
});

route('POST', '/api/builds', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const { car_id, name, desc, parts, image, car_name, car_maker, car_cls, tags } = await parseBody(req);
  if (!car_id || !name) return json(res, 400, { error: 'Missing fields' });
  // Sanitize tags: max 5, each max 20 chars, alphanumeric+hyphen only
  const cleanTags = (tags || '').split(',').map(t => t.trim().toLowerCase().replace(/[^a-zа-яёa-z0-9-]/gi,'').slice(0,20)).filter(Boolean).slice(0,5).join(',');
  // Auto-register car if not in DB yet
  db.prepare('INSERT OR IGNORE INTO cars (id,name,maker,cls) VALUES (?,?,?,?)').run(car_id, car_name||car_id, car_maker||'Unknown', car_cls||'D');
  const id = 'b_' + Date.now() + '_' + user.id;
  db.prepare('INSERT INTO builds (id,car_id,user_id,name,author,desc,parts,image,tags) VALUES (?,?,?,?,?,?,?,?,?)').run(id, car_id, user.id, name, user.username, desc||'', JSON.stringify(parts||{}), image||'', cleanTags);
  
  // ── Notify subscribers ──────────────────────────────────────
  try {
    const car = db.prepare('SELECT * FROM cars WHERE id=?').get(car_id);
    // Car subscribers
    // Match car subs by name (e.g. "Mazda RX-7") OR by id as fallback
    const carName = car ? (car.maker + ' ' + car.name).toLowerCase() : car_id.toLowerCase();
    const carSubs = db.prepare(
      "SELECT telegram_id FROM subscriptions WHERE type='car' AND (lower(value)=? OR lower(value)=?)"
    ).all(carName, car_id.toLowerCase());
    // Author subscribers
    const authorSubs = db.prepare("SELECT telegram_id FROM subscriptions WHERE type='author' AND lower(value)=?").all(user.username.toLowerCase());
    const allTgIds = [...new Set([...carSubs.map(s=>s.telegram_id), ...authorSubs.map(s=>s.telegram_id)])];
    if (allTgIds.length > 0 && BOT_CFG.BOT_TOKEN) {
      const carLabel = car ? `${car.maker} ${car.name}` : car_id;
      const msg = `🔔 <b>Новая сборка на APEXEL!</b>

🚗 <b>${carLabel}</b>
📋 ${name}
👤 by ${user.username}

👉 http://localhost:${PORT}`;
      allTgIds.forEach(tgId => notifyTelegram(BOT_CFG.BOT_TOKEN, tgId, msg));
    }
  } catch(e) { console.error('[notify]', e.message); }
  
  json(res, 201, { id });
});

route('DELETE', '/api/builds/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const build = db.prepare('SELECT * FROM builds WHERE id=?').get(req.params.id);
  if (!build) return json(res, 404, { error: 'Not found' });
  if (build.user_id !== user.id && user.role !== 'admin') return json(res, 403, { error: 'Forbidden' });
  db.prepare('DELETE FROM builds WHERE id=?').run(req.params.id);
  json(res, 200, { ok: true });
});

// ─── VINYLS ───────────────────────────────────────────────────

route('POST', '/api/builds/:id/recommend', async (req, res) => {
  const user = getUser(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  if (user.role !== 'pro') return json(res, 403, { error: 'Только Pro-водители могут рекомендовать сборки' });
  const build = db.prepare('SELECT * FROM builds WHERE id=?').get(req.params.id);
  if (!build) return json(res, 404, { error: 'Build not found' });
  if (build.user_id !== user.id) return json(res, 403, { error: 'Можно рекомендовать только свои сборки' });
  db.prepare('UPDATE builds SET is_recommended=1, recommended_by=? WHERE id=?').run(user.username, req.params.id);
  json(res, 200, { ok: true });
});

route('DELETE', '/api/builds/:id/recommend', async (req, res) => {
  const user = getUser(req);
  if (!user) return json(res, 401, { error: 'Unauthorized' });
  if (user.role !== 'pro') return json(res, 403, { error: 'Только Pro-водители могут снимать рекомендацию' });
  const build = db.prepare('SELECT * FROM builds WHERE id=?').get(req.params.id);
  if (!build) return json(res, 404, { error: 'Build not found' });
  if (build.user_id !== user.id) return json(res, 403, { error: 'Можно снимать рекомендацию только со своих сборок' });
  db.prepare("UPDATE builds SET is_recommended=0, recommended_by='' WHERE id=?").run(req.params.id);
  json(res, 200, { ok: true });
});

route('GET', '/api/vinyls', async (req, res) => {
  const url = new URL('http://x' + req.url);
  const carId = url.searchParams.get('car');
  const stmt = carId
    ? db.prepare('SELECT v.*,u.username FROM vinyls v LEFT JOIN users u ON v.user_id=u.id WHERE v.car_id=? ORDER BY v.created_at DESC').all(carId)
    : db.prepare('SELECT v.*,u.username FROM vinyls v LEFT JOIN users u ON v.user_id=u.id ORDER BY v.likes DESC LIMIT 50').all();
  json(res, 200, stmt);
});

route('POST', '/api/vinyls', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const { car_id, name, desc, image, car_name, car_maker, car_cls } = await parseBody(req);
  if (!car_id || !name) return json(res, 400, { error: 'Missing fields' });
  // Auto-register car if not in DB yet
  db.prepare('INSERT OR IGNORE INTO cars (id,name,maker,cls) VALUES (?,?,?,?)').run(car_id, car_name||car_id, car_maker||'Unknown', car_cls||'D');
  const id = 'v_' + Date.now() + '_' + user.id;
  db.prepare('INSERT INTO vinyls (id,car_id,user_id,name,author,desc,image) VALUES (?,?,?,?,?,?,?)').run(id, car_id, user.id, name, user.username, desc||'', image||'');
  json(res, 201, { id });
});

route('DELETE', '/api/vinyls/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const v = db.prepare('SELECT * FROM vinyls WHERE id=?').get(req.params.id);
  if (!v) return json(res, 404, { error: 'Not found' });
  if (v.user_id !== user.id && user.role !== 'admin') return json(res, 403, { error: 'Forbidden' });
  db.prepare('DELETE FROM vinyls WHERE id=?').run(req.params.id);
  json(res, 200, { ok: true });
});

// ─── VOTES ────────────────────────────────────────────────────
route('POST', '/api/vote', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const { target_type, target_id, vote } = await parseBody(req);
  if (!['like','dislike'].includes(vote)) return json(res, 400, { error: 'Invalid vote' });
  const existing = db.prepare('SELECT * FROM votes WHERE user_id=? AND target_type=? AND target_id=?').get(user.id, target_type, target_id);
  if (existing) {
    if (existing.vote === vote) {
      db.prepare('DELETE FROM votes WHERE id=?').run(existing.id);
      db.prepare(`UPDATE ${target_type}s SET ${vote}s=${vote}s-1 WHERE id=?`).run(target_id);
      return json(res, 200, { action: 'removed' });
    }
    db.prepare('UPDATE votes SET vote=? WHERE id=?').run(vote, existing.id);
    const other = vote === 'like' ? 'dislike' : 'like';
    db.prepare(`UPDATE ${target_type}s SET likes=likes${vote==='like'?'+1':'-1'}, dislikes=dislikes${vote==='dislike'?'+1':'-1'} WHERE id=?`).run(target_id);
    return json(res, 200, { action: 'changed' });
  }
  db.prepare('INSERT INTO votes (user_id,target_type,target_id,vote) VALUES (?,?,?,?)').run(user.id, target_type, target_id, vote);
  db.prepare(`UPDATE ${target_type}s SET ${vote}s=${vote}s+1 WHERE id=?`).run(target_id);
  json(res, 200, { action: 'added' });
});

// ─── COMMENTS ────────────────────────────────────────────────
route('GET', '/api/comments', async (req, res) => {
  const url = new URL('http://x' + req.url);
  const type = url.searchParams.get('type');
  const id   = url.searchParams.get('id');
  if (!type || !id) return json(res, 400, { error: 'Missing params' });
  const comments = db.prepare('SELECT c.*,u.username FROM comments c LEFT JOIN users u ON c.user_id=u.id WHERE c.target_type=? AND c.target_id=? ORDER BY c.created_at ASC').all(type, id);
  json(res, 200, comments);
});

route('POST', '/api/comments', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const { target_type, target_id, text } = await parseBody(req);
  if (!target_type || !target_id || !text?.trim()) return json(res, 400, { error: 'Missing fields' });
  if (text.trim().length > 1000) return json(res, 400, { error: 'Комментарий слишком длинный (макс. 1000 символов)' });
  // Анти-спам: не более 1 комментария в 10 секунд
  const lastComment = db.prepare('SELECT created_at FROM comments WHERE user_id=? ORDER BY created_at DESC LIMIT 1').get(user.id);
  if (lastComment && (Date.now()/1000 - lastComment.created_at) < 10) return json(res, 429, { error: 'Подождите перед следующим комментарием' });
  const info = db.prepare('INSERT INTO comments (target_type,target_id,user_id,author,text) VALUES (?,?,?,?,?)').run(target_type, target_id, user.id, user.username, text.trim());
  json(res, 201, { id: info.lastInsertRowid });
});

route('DELETE', '/api/comments/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const c = db.prepare('SELECT * FROM comments WHERE id=?').get(req.params.id);
  if (!c) return json(res, 404, { error: 'Not found' });
  if (c.user_id !== user.id && user.role !== 'admin') return json(res, 403, { error: 'Forbidden' });
  db.prepare('DELETE FROM comments WHERE id=?').run(req.params.id);
  json(res, 200, { ok: true });
});

// ─── GUIDES ───────────────────────────────────────────────────
route('GET', '/api/guides', async (req, res) => {
  const guides = db.prepare('SELECT id,title,author,views,created_at FROM guides ORDER BY created_at DESC').all();
  json(res, 200, guides);
});

route('GET', '/api/guides/:id', async (req, res) => {
  const g = db.prepare('SELECT * FROM guides WHERE id=?').get(req.params.id);
  if (!g) return json(res, 404, { error: 'Not found' });
  db.prepare('UPDATE guides SET views=views+1 WHERE id=?').run(g.id);
  json(res, 200, { ...g, blocks: JSON.parse(g.blocks || '[]') });
});

route('POST', '/api/guides', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const { title, blocks } = await parseBody(req);
  if (!title) return json(res, 400, { error: 'Missing title' });
  const id = 'g_' + Date.now() + '_' + user.id;
  db.prepare('INSERT INTO guides (id,user_id,title,author,blocks) VALUES (?,?,?,?,?)').run(id, user.id, title, user.username, JSON.stringify(blocks||[]));
  json(res, 201, { id });
});

route('DELETE', '/api/guides/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  const g = db.prepare('SELECT * FROM guides WHERE id=?').get(req.params.id);
  if (!g) return json(res, 404, { error: 'Not found' });
  if (g.user_id !== user.id && user.role !== 'admin') return json(res, 403, { error: 'Forbidden' });
  db.prepare('DELETE FROM guides WHERE id=?').run(req.params.id);
  json(res, 200, { ok: true });
});

// ─── REPORTS ──────────────────────────────────────────────────
route('GET', '/api/reports', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const reports = db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all();
  json(res, 200, reports);
});

route('POST', '/api/reports', async (req, res) => {
  const user = getUser(req);
  const { target_type, target_id, reason, comment } = await parseBody(req);
  if (!target_type || !target_id || !reason) return json(res, 400, { error: 'Missing fields' });
  db.prepare('INSERT INTO reports (reporter_id,target_type,target_id,reason,comment) VALUES (?,?,?,?,?)').run(user?.id || null, target_type, target_id, reason, comment||'');
  json(res, 201, { ok: true });
});

route('PATCH', '/api/reports/:id/status', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { status } = await parseBody(req);
  db.prepare('UPDATE reports SET status=? WHERE id=?').run(status, req.params.id);
  json(res, 200, { ok: true });
});

route('DELETE', '/api/reports/:id/target', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const r = db.prepare('SELECT * FROM reports WHERE id=?').get(req.params.id);
  if (!r) return json(res, 404, { error: 'Not found' });
  const tables = { build:'builds', vinyl:'vinyls', comment:'comments', guide:'guides' };
  const table = tables[r.target_type];
  if (table) {
    // Try delete by real id first
    const info = db.prepare(`DELETE FROM ${table} WHERE id=?`).run(r.target_id);
    // If nothing deleted, the target_id might be old localStorage format — just resolve the report
    if (info.changes === 0) {
      console.log(`[reports] target not found in DB: ${r.target_type}:${r.target_id}`);
    }
  }
  db.prepare("UPDATE reports SET status='resolved' WHERE id=?").run(r.id);
  json(res, 200, { ok: true });
});

// Direct delete any content by type and id (used from admin)
route('DELETE', '/api/content/:type/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const tables = { build:'builds', vinyl:'vinyls', comment:'comments', guide:'guides', news:'news' };
  const table = tables[req.params.type];
  if (!table) return json(res, 400, { error: 'Unknown type' });
  db.prepare(`DELETE FROM ${table} WHERE id=?`).run(req.params.id);
  json(res, 200, { ok: true });
});

// Get author info from content (for ban-from-report)
route('GET', '/api/content/:type/:id/author', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const tables = { build:'builds', vinyl:'vinyls', comment:'comments', guide:'guides' };
  const table = tables[req.params.type];
  if (!table) return json(res, 400, { error: 'Unknown type' });
  const row = db.prepare(`SELECT user_id FROM ${table} WHERE id=?`).get(req.params.id);
  if (!row) return json(res, 404, { error: 'Not found' });
  const u = db.prepare('SELECT id,username,role FROM users WHERE id=?').get(row.user_id);
  if (!u) return json(res, 404, { error: 'User not found' });
  json(res, 200, u);
});

// ─── NEWS ─────────────────────────────────────────────────────
route('GET', '/api/news', async (req, res) => {
  const news = db.prepare('SELECT id,title,body,tag,author,pinned,has_img,created_at FROM news ORDER BY pinned DESC,created_at DESC').all();
  json(res, 200, news);
});

route('GET', '/api/news/:id/image', async (req, res) => {
  const row = db.prepare('SELECT data FROM news_images WHERE news_id=?').get(req.params.id);
  if (!row) return json(res, 404, { error: 'No image' });
  const data = row.data || '';
  const m = data.match(/^data:([^;]+);base64,(.+)$/);
  if (m) {
    const buf = Buffer.from(m[2], 'base64');
    res.writeHead(200, { 'Content-Type': m[1], 'Content-Length': buf.length, 'Cache-Control': 'public,max-age=86400' });
    return res.end(buf);
  }
  json(res, 200, { image: data });
});

route('POST', '/api/news', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { title, body, tag, author, pinned, image } = await parseBody(req);
  if (!title || !body) return json(res, 400, { error: 'Missing fields' });
  const id = 'news_' + Date.now();
  db.prepare('INSERT INTO news (id,user_id,title,body,tag,author,pinned,has_img) VALUES (?,?,?,?,?,?,?,?)').run(id, user.id, title, body, tag||'info', author||user.username, pinned?1:0, image?1:0);
  if (image) db.prepare('INSERT OR REPLACE INTO news_images (news_id,data) VALUES (?,?)').run(id, image);
  json(res, 201, { id });
});

route('PUT', '/api/news/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { title, body, tag, author, pinned, image } = await parseBody(req);
  db.prepare('UPDATE news SET title=?,body=?,tag=?,author=?,pinned=?,has_img=? WHERE id=?').run(title, body, tag||'info', author||user.username, pinned?1:0, image!==undefined?(image?1:0):undefined||0, req.params.id);
  if (image !== undefined) {
    if (image) db.prepare('INSERT OR REPLACE INTO news_images (news_id,data) VALUES (?,?)').run(req.params.id, image);
    else db.prepare('DELETE FROM news_images WHERE news_id=?').run(req.params.id);
  }
  json(res, 200, { ok: true });
});

route('PATCH', '/api/news/:id/pin', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const n = db.prepare('SELECT pinned FROM news WHERE id=?').get(req.params.id);
  if (!n) return json(res, 404, { error: 'Not found' });
  db.prepare('UPDATE news SET pinned=? WHERE id=?').run(n.pinned ? 0 : 1, req.params.id);
  json(res, 200, { pinned: !n.pinned });
});

route('DELETE', '/api/news/:id', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  db.prepare('DELETE FROM news WHERE id=?').run(req.params.id);
  json(res, 200, { ok: true });
});

// ─── SUPPORT CHAT ─────────────────────────────────────────────
route('GET', '/api/support/sessions', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const sessions = db.prepare(`
    SELECT sc.*, 
      (SELECT text FROM support_messages WHERE session_id=sc.session_id ORDER BY created_at DESC LIMIT 1) as last_msg,
      (SELECT created_at FROM support_messages WHERE session_id=sc.session_id ORDER BY created_at DESC LIMIT 1) as last_time,
      (SELECT COUNT(*) FROM support_messages WHERE session_id=sc.session_id AND from_role='user') as unread
    FROM support_chats sc ORDER BY last_time DESC NULLS LAST
  `).all();
  json(res, 200, sessions);
});

route('GET', '/api/support/:sessionId/messages', async (req, res) => {
  const msgs = db.prepare('SELECT * FROM support_messages WHERE session_id=? ORDER BY created_at ASC').all(req.params.sessionId);
  json(res, 200, msgs);
});

route('POST', '/api/support/:sessionId/messages', async (req, res) => {
  const { text, username, from_role } = await parseBody(req);
  if (!text?.trim()) return json(res, 400, { error: 'Empty message' });
  const role = from_role === 'support' ? 'support' : 'user';
  const sid = req.params.sessionId;
  const existing = db.prepare('SELECT session_id FROM support_chats WHERE session_id=?').get(sid);
  if (!existing) db.prepare('INSERT INTO support_chats (session_id,username) VALUES (?,?)').run(sid, username || '');
  else if (username) db.prepare("UPDATE support_chats SET username=? WHERE session_id=? AND username=''").run(username, sid);
  const info = db.prepare('INSERT INTO support_messages (session_id,from_role,text) VALUES (?,?,?)').run(sid, role, text.trim());
  json(res, 201, { id: info.lastInsertRowid });
});

route('PATCH', '/api/support/:sessionId/close', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  const { closed } = await parseBody(req);
  db.prepare('UPDATE support_chats SET closed=? WHERE session_id=?').run(closed?1:0, req.params.sessionId);
  json(res, 200, { ok: true });
});

route('DELETE', '/api/support/:sessionId', async (req, res) => {
  const user = getUser(req);
  if (!requireAdmin(user, res)) return;
  db.prepare('DELETE FROM support_chats WHERE session_id=?').run(req.params.sessionId);
  json(res, 200, { ok: true });
});

// ─── STATS ────────────────────────────────────────────────────
// ─── LEADERBOARD ──────────────────────────────────────────────
route('GET', '/api/leaderboard', async (req, res) => {
  const url = new URL('http://x' + req.url);
  const period = url.searchParams.get('period') || 'all'; // week | month | all
  const type   = url.searchParams.get('type')   || 'builds'; // builds | authors

  let since = 0;
  if (period === 'week')  since = Math.floor(Date.now()/1000) - 7  * 86400;
  if (period === 'month') since = Math.floor(Date.now()/1000) - 30 * 86400;

  if (type === 'authors') {
    const rows = db.prepare(`
      SELECT u.username, u.role,
             SUM(b.likes) as total_likes,
             COUNT(b.id)  as build_count
      FROM builds b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.created_at >= ? AND u.username IS NOT NULL
      GROUP BY b.user_id
      ORDER BY total_likes DESC
      LIMIT 20
    `).all(since);
    return json(res, 200, rows);
  }

  // builds
  const rows = db.prepare(`
    SELECT b.id, b.name, b.author, b.likes, b.car_id, b.created_at,
           b.is_recommended, b.tags,
           c.name as car_name, c.maker as car_maker, c.cls as car_cls,
           u.role as user_role
    FROM builds b
    LEFT JOIN cars c ON b.car_id = c.id
    LEFT JOIN users u ON b.user_id = u.id
    WHERE b.created_at >= ?
    ORDER BY b.likes DESC
    LIMIT 20
  `).all(since);
  json(res, 200, rows);
});

// ─── TAGS ──────────────────────────────────────────────────────
route('GET', '/api/tags/popular', async (req, res) => {
  // Count all tags across all builds, return top 20
  const builds = db.prepare("SELECT tags FROM builds WHERE tags IS NOT NULL AND tags != ''").all();
  const freq = {};
  builds.forEach(b => {
    (b.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean).forEach(t => {
      freq[t] = (freq[t] || 0) + 1;
    });
  });
  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,20).map(([tag,count]) => ({ tag, count }));
  json(res, 200, sorted);
});

// ─── SUBSCRIPTIONS ─────────────────────────────────────────────
route('GET', '/api/subscriptions', async (req, res) => {
  const user = getUser(req);
  if (!user || !user.telegram_id) return json(res, 200, []);
  const rows = db.prepare('SELECT * FROM subscriptions WHERE telegram_id=?').all(user.telegram_id);
  json(res, 200, rows);
});

route('POST', '/api/subscriptions', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  if (!user.telegram_id) return json(res, 400, { error: 'Привяжи Telegram для подписок' });
  const { type, value } = await parseBody(req);
  if (!type || !value) return json(res, 400, { error: 'type и value обязательны' });
  try {
    db.prepare('INSERT OR IGNORE INTO subscriptions (telegram_id,type,value) VALUES (?,?,?)').run(user.telegram_id, type, value.toLowerCase());
    json(res, 201, { ok: true });
  } catch(e) { json(res, 500, { error: e.message }); }
});

route('DELETE', '/api/subscriptions', async (req, res) => {
  const user = getUser(req);
  if (!requireAuth(user, res)) return;
  if (!user.telegram_id) return json(res, 400, { error: 'Нет Telegram' });
  const { type, value } = await parseBody(req);
  db.prepare('DELETE FROM subscriptions WHERE telegram_id=? AND type=? AND value=?').run(user.telegram_id, type, value.toLowerCase());
  json(res, 200, { ok: true });
});

route('GET', '/api/stats', async (req, res) => {
  const stats = {
    cars:     db.prepare('SELECT COUNT(*) as c FROM cars').get().c,
    builds:   db.prepare('SELECT COUNT(*) as c FROM builds').get().c,
    vinyls:   db.prepare('SELECT COUNT(*) as c FROM vinyls').get().c,
    guides:   db.prepare('SELECT COUNT(*) as c FROM guides').get().c,
    users:    db.prepare('SELECT COUNT(*) as c FROM users').get().c,
    reports:  db.prepare("SELECT COUNT(*) as c FROM reports WHERE status='open'").get().c,
    comments: db.prepare('SELECT COUNT(*) as c FROM comments').get().c,
  };
  json(res, 200, stats);
});

// ─── HTTP SERVER ──────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0].replace(/\/+$/, '') || '/';

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS' });
    return res.end();
  }

  // API routes
  if (url.startsWith('/api/')) {
    const match = matchRoute(req.method, url);
    if (match) {
      req.params = match.params;
      try { await match.handler(req, res); } catch (e) { console.error(e); json(res, 500, { error: 'Internal server error' }); }
    } else {
      json(res, 404, { error: 'Not found' });
    }
    return;
  }

  // Static files
  // Handle HEAD requests for video (browser preflight)
  if (req.method === 'HEAD' && (url.endsWith('.mp4') || url.endsWith('.webm'))) {
    const vp = fs.existsSync(path.join(__dirname, url.slice(1)))
      ? path.join(__dirname, url.slice(1))
      : path.join(STATIC_DIR, url.slice(1));
    if (fs.existsSync(vp)) {
      const st = fs.statSync(vp);
      res.writeHead(200, { 'Content-Type':'video/mp4', 'Content-Length':st.size, 'Accept-Ranges':'bytes' });
      return res.end();
    }
  }

  // Log video requests for debug
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    console.log(`[video] ${req.method} ${url} Range: ${req.headers.range || 'none'}`);
  }

  // ss.mp4: check public/ first, then root
  if (url === '/ss.mp4') {
    const pubVideo  = path.join(STATIC_DIR, 'ss.mp4');
    const rootVideo = path.join(__dirname, 'ss.mp4');
    if (fs.existsSync(pubVideo))  return serveFile(res, pubVideo, req);
    if (fs.existsSync(rootVideo)) return serveFile(res, rootVideo, req);
    console.error('[video] ss.mp4 not found in', STATIC_DIR, 'or', __dirname);
    res.writeHead(404); return res.end('ss.mp4 not found');
  }

  let filePath = path.join(STATIC_DIR, url === '/' ? 'index.html' : url);
  if (!filePath.startsWith(STATIC_DIR)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
  if (fs.existsSync(filePath)) return serveFile(res, filePath, req);

  // SPA fallback
  serveFile(res, path.join(STATIC_DIR, 'index.html'), req);
});

server.listen(PORT, () => {
  console.log(`\n🚀 APEXEL Backend running at http://localhost:${PORT}`);
  console.log(`📁 Serving static from: ${STATIC_DIR}`);
  console.log(`🗄️  Database: ${DB_FILE}`);
  console.log(`\nAPI endpoints:`);
  console.log(`  POST /api/auth/register`);
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  GET  /api/cars | POST /api/cars`);
  console.log(`  GET  /api/builds | POST /api/builds`);
  console.log(`  GET  /api/news | POST /api/news`);
  console.log(`  GET  /api/stats`);
  console.log(`  ... and more\n`);
});
