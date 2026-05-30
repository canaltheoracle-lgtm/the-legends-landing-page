const API_BASE = 'http://localhost:3001/api';

const getHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: async (endpoint: string, token: string | null = null) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  },
  post: async (endpoint: string, data: any, token: string | null = null) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  },
  put: async (endpoint: string, data: any, token: string | null = null) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  },
  delete: async (endpoint: string, token: string | null = null) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Request failed');
  },
};
