const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const tradeApi = {
  /**
   * Generic function to send trade commands to the backend.
   * @param {string} action - The endpoint action (e.g., 'buy', 'sell', 'telegram_test').
   */
  async executeAction(action) {
    try {
      // Assuming POST requests for actions
      const response = await fetch(`${API_URL}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({}) // Add payload here if needed later (e.g., volume)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error executing ${action}:`, error);
      throw error;
    }
  }
};