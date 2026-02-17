```markdown
# ⚛️ TradeBot PRO - React Dashboard

The user interface for TradeBot PRO. It provides a high-performance trading dashboard using financial charting tools and a responsive control panel.

## 🚀 Features
* **Interactive Charts:** Built with Lightweight Charts for smooth performance and real-time updates.
* **Real-time VSA Highlighting:** Visual identification of high-volume candles directly on the chart.
* **Symbol Selector:** Quick asset switching with automated data refetching.
* **Action Panel:** Integrated controls for bot management (Start/Stop) and manual Telegram alerts.

## 🛠️ Installation

1. **Install Dependencies:**
   ```bash
   npm install
Environment Configuration:
Ensure .env.local contains your Backend URL:

Ini, TOML

VITE_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
Start Development Server:

Bash

npm run dev
📊 VSA Coloring Guide
Standard Candles: Normal market activity (Green/Red).

Neon Green: High Bullish Volume (Buying Pressure detected).

Neon Red: High Bearish Volume (Selling Pressure detected).

📁 Project Structure
src/components/CandleChart.jsx: Core charting logic and VSA rendering.

src/App.jsx: Main layout, action handlers, and global state management.