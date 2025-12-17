# TomatoGPT

A Next.js food delivery application clone integrated with OpenAI Apps SDK (MCP).

## Features
- 🍔 Restaurant Listing & Search
- 🍕 Detailed Menu & Cart Management
- 💳 Mock Payment Gateway
- 📊 **MoEngage Analytics** Integration
- 🤖 **ChatGPT App Integration** (MCP + Widget)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the web app.

## OpenAI Apps SDK (ChatGPT Integration)

This app exposes an MCP (Model Context Protocol) server to be used as a ChatGPT App.

### Endpoints
- **MCP Server (SSE)**: `/api/mcp` (e.g., `https://your-domain.com/api/mcp`)
- **Widget UI**: `/widget` (e.g., `https://your-domain.com/widget`)

### How to Add to ChatGPT
1. Deploy this app to a public URL (e.g., Vercel, ngrok to localhost).
2. Go to **ChatGPT Settings** -> **Apps & Connectors** -> **Advanced settings** -> Enable **Developer Mode**.
3. Go to **Settings** -> **Connectors** -> **Create**.
4. Enter your MCP Endpoint URL: `https://<your-domain>/api/mcp`.
5. ChatGPT will detect the tools (`search_restaurants`, `get_restaurant_menu`).
6. Configure the **Widget URL** if prompted or use the tools normally.

### MoEngage Integration
To enable real analytics:
1. Open `lib/moengage.ts`.
2. Replace `YOUR_MOENGAGE_APP_ID` with your actual App ID from the MoEngage Dashboard.
