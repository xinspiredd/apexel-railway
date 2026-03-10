/**
 * APEXEL — Frontend API Client
 * Connects to backend at /api/*
 * Usage: window.API.login(...), window.API.news.getAll(), etc.
 */

const API_BASE = window.APEXEL_API || '';   // same origin by default

// ─── Token storage ────────────────────────────────────────────────────────────
const Auth = {
  _user: null,
  getToken: () => localStorage.getItem('apexel_jwt') || '',
  setToken: (t) => { if (t) localStorage.setItem('apexel_jwt', t); else localStorage.removeItem('apexel_jwt'); },
  getUser:  () => {
    if (Auth._user) return Auth._user;
    try { const raw = localStorage.getItem('apexel_user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  setUser:  (u) => { Auth._user = u; if (u) localStorage.setItem('apexel_user', JSON.stringify(u)); else localStorage.removeItem('apexel_user'); },
  clear:    () => { Auth.setToken(null); Auth.setUser(null); Auth._user = null; },
  isAdmin:  () => Auth.getUser()?.role === 'admin',
  isLoggedIn: () => !!Auth.getToken(),
};

// ─── Base fetch ───────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Don't set Content-Type for FormData
  if (!(opts.body instanceof FormData) && opts.body && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }

  try {
    const res = await fetch(API_BASE + path, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, message: data.error || `HTTP ${res.status}` };
    return data;
  } catch (e) {
    if (e.status) throw e;
    throw { status: 0, message: 'Сервер недоступен' };
  }
}

// ─── API namespaces ───────────────────────────────────────────────────────────
const API = {
  Auth,

  // AUTH
  async login(login, password) {
    const d = await apiFetch('/api/auth/login', { method: 'POST', body: { login, password } });
    Auth.setToken(d.token);
    Auth.setUser(d.user);
    return d;
  },
  async register(username, email, password) {
    const d = await apiFetch('/api/auth/register', { method: 'POST', body: { username, email, password } });
    Auth.setToken(d.token);
    Auth.setUser(d.user);
    return d;
  },
  async logout() {
    Auth.clear();
    window.dispatchEvent(new CustomEvent('apexel:logout'));
  },
  async fetchMe() {
    try {
      const user = await apiFetch('/api/auth/me');
      Auth.setUser(user);
      return user;
    } catch {
      Auth.clear();
      return null;
    }
  },

  // NEWS
  news: {
    getAll: ()        => apiFetch('/api/news'),
    get:    (id)      => apiFetch(`/api/news/${id}`),
    create: (fd)      => apiFetch('/api/news',       { method: 'POST',   body: fd }),
    update: (id, fd)  => apiFetch(`/api/news/${id}`, { method: 'PUT',    body: fd }),
    delete: (id)      => apiFetch(`/api/news/${id}`, { method: 'DELETE' }),
    pin:    (id)      => apiFetch(`/api/news/${id}/pin`, { method: 'POST' }),
  },

  // REPORTS
  reports: {
    getAll:       ()                      => apiFetch('/api/reports'),
    create:       (target_type, target_id, reason) =>
                                          apiFetch('/api/reports', { method: 'POST', body: { target_type, target_id, reason } }),
    updateStatus: (id, status)            => apiFetch(`/api/reports/${id}/status`, { method: 'PUT', body: { status } }),
    delete:       (id)                    => apiFetch(`/api/reports/${id}`, { method: 'DELETE' }),
  },

  // SUPPORT CHAT
  support: {
    getChat:     (sid)           => apiFetch(`/api/support/chat/${sid}`),
    sendMessage: (sid, body, username) =>
                                   apiFetch(`/api/support/chat/${sid}/message`, { method: 'POST', body: { body, username } }),
    adminGetAll: ()              => apiFetch('/api/support/chats'),
    adminReply:  (sid, body, system) =>
                                   apiFetch(`/api/support/chat/${sid}/reply`,   { method: 'POST', body: { body, system } }),
    close:       (sid)           => apiFetch(`/api/support/chat/${sid}/close`,  { method: 'POST' }),
    read:        (sid)           => apiFetch(`/api/support/chat/${sid}/read`,   { method: 'POST' }),
    delete:      (sid)           => apiFetch(`/api/support/chat/${sid}`,        { method: 'DELETE' }),
  },

  // ADMIN USERS
  admin: {
    getUsers: ()               => apiFetch('/api/admin/users'),
    ban:      (id, reason)     => apiFetch(`/api/admin/users/${id}/ban`,   { method: 'POST', body: { reason } }),
    unban:    (id)             => apiFetch(`/api/admin/users/${id}/unban`, { method: 'POST' }),
    delete:   (id)             => apiFetch(`/api/admin/users/${id}`,       { method: 'DELETE' }),
  },

  // COMMENTS
  comments: {
    get:    (type, id)                  => apiFetch(`/api/comments/${type}/${id}`),
    add:    (type, id, body, author)    => apiFetch(`/api/comments/${type}/${id}`, { method: 'POST', body: { body, author_name: author } }),
    delete: (id)                        => apiFetch(`/api/comments/${id}`,          { method: 'DELETE' }),
  },

  // STATS
  stats: () => apiFetch('/api/stats'),
};

window.API    = API;
window.APIAuth = Auth;
