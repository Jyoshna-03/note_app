const API = 'https://note-app-1hv7.onrender.com';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function isLoggedIn() {
  return !!getToken();
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, {
    method: 'GET',
    headers: authHeaders()
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = 'login.html';
    return null;
  }

  return res.json();
}

async function apiPost(path, body, requireAuth = false) {
  const headers = requireAuth
    ? authHeaders()
    : { 'Content-Type': 'application/json' };

  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  return { ok: res.ok, status: res.status, data: await res.json() };
}

async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  if (res.status === 401) {
    clearAuth();
    window.location.href = 'login.html';
    return null;
  }

  return res.json();
}

async function login(email, password) {
  const { ok, data } = await apiPost('/auth/login', { email, password });
  if (!ok) return { error: data.error };
  saveAuth(data.token, data.user);
  return { success: true };
}

async function signup(name, email, password) {
  const { ok, data } = await apiPost('/auth/signup', { name, email, password });
  if (!ok) return { error: data.error };
  saveAuth(data.token, data.user);
  return { success: true };
}

function logout() {
  clearAuth();
  window.location.href = 'login.html';
}

async function getNotes() {
  const data = await apiGet('/notes');
  return data ? data.notes : [];
}

async function createNote(title, body) {
  const { ok, data } = await apiPost('/notes', { title, body }, true);
  if (!ok) return { error: data.error };
  return { note: data.note };
}

async function deleteNote(id) {
  await apiDelete(`/notes/${id}`);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
}

function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.style.display = 'none';
}
