// src/api.js
const API_BASE = import.meta.env.VITE_API_URL; 

export const API = {
  async list(params) {
    const res = await fetch(`${API_BASE}/api/jobs?` + new URLSearchParams(params));
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_BASE}/api/jobs`, {
      method: "POST",
      body: data
    });
    if (!res.ok) throw new Error("Failed to create job");
    return res.json();
  },

  async get(id) {
    const res = await fetch(`${API_BASE}/api/jobs/${id}`);
    if (!res.ok) throw new Error("Failed to fetch job details");
    return res.json();
  }
};

