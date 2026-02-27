const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Core fetch wrapper. Throws a descriptive Error on non-2xx responses.
 * @param {string} path  - e.g. '/memories'
 * @param {RequestInit} [options]
 * @returns {Promise<any>} - parsed JSON body
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json.message || json.errors?.[0]?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

export const api = {
  get:    (path)          => request(path),
  post:   (path, body)    => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)    => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)          => request(path, { method: 'DELETE' }),
};
