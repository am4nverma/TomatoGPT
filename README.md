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
To run the app (using the local Node.js environment if global is missing):
```bash
./dev.sh
```
Open [http://localhost:3000](http://localhost:3000) to view the web app.

## OpenAI Apps SDK (ChatGPT Integration)

This app exposes an MCP (Model Context Protocol) server to be used as a ChatGPT App.

### Development Setup (Recommended)
Since Vercel Serverless Functions have timeouts incompatible with MCP SSE (Server-Sent Events), use **ngrok** for testing.

1. Start the app: `./dev.sh`
2. Start ngrok: `ngrok http 3000`
3. Copy the ngrok HTTPS URL (e.g., `https://your-tunel.ngrok-free.app`).

### Connecting to ChatGPT
1. Go to **Settings** -> **Apps & Connectors** -> **Advanced settings** -> Enable **Developer Mode**.
2. Go to **Settings** -> **Connectors** -> **Create**.
3. **MCP Endpoint URL**: `https://<your-ngrok-id>.ngrok-free.app/api/mcp`
4. **Authentication**: None.

### Troubleshooting
- **500 Error**: Ensure `bodyParser` is disabled in `pages/api/mcp.ts` (Next.js config).
- **401 Error on Vercel**: Disable "Employment Protection" or Vercel Authentication in your Vercel Dashboard.

### MoEngage Integration
To enable real analytics:
1. Open `lib/moengage.ts`.
2. Replace `YOUR_MOENGAGE_APP_ID` with your actual App ID from the MoEngage Dashboard.
