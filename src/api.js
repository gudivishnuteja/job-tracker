const base = ''; // uses Vite proxy locally

export const API = {
  async list(params = {}) {
    const qp = new URLSearchParams(params).toString();
    const res = await fetch(`${base}/api/jobs${qp ? '?' + qp : ''}`);
    return res.json();
  },
  async create(formData) {
    const res = await fetch(`${base}/api/jobs`, { method: 'POST', body: formData });
    return res.json();
  },
  async update(id, formData) {
    const res = await fetch(`${base}/api/jobs/${id}`, { method: 'PUT', body: formData });
    return res.json();
  },
  async remove(id) {
    const res = await fetch(`${base}/api/jobs/${id}`, { method: 'DELETE' });
    return res.json();
  },
  async get(id) {
    const res = await fetch(`${base}/api/jobs/${id}`);
    return res.json();
  }
}
