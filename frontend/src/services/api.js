// Central API helper.
// In production set VITE_API_URL to your deployed backend URL.
// During local development it falls back to http://localhost:5000/api.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  getPortfolio: () => request("/portfolio"),
  sendMessage: (payload) =>
    request("/messages", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  savePortfolio: (payload, token) =>
    request("/portfolio", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${token}` },
    }),
  getMessages: (token) =>
    request("/messages", { headers: { Authorization: `Bearer ${token}` } }),
  deleteMessage: (id, token) =>
    request(`/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
