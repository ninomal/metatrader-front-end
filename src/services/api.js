const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const botService = {
  async getStatus() {
    const response = await fetch(`${API_URL}/status`);
    if (!response.ok) throw new Error("API Offline");
    return response.json();
  },

  async sendCommand(action) {
    const response = await fetch(`${API_URL}/${action}`, { method: 'POST' });
    const data = await response.json();
    if (data.status !== 'success' && data.status !== 'warning') {
      throw new Error(data.message);
    }
    return data;
  }
};