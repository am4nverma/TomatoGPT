import { createMcpServer } from "@/lib/mcp-server";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { NextApiRequest, NextApiResponse } from "next";

// Global map to store transports by session/connection if needed.
// For simple demo, we'll try to handle it within the same instance if possible,
// or just instantiate a transport per connection.
// But POST request comes separately. The Transport needs to be retrieved.
// IN MEMORY STORAGE (Only works for single instance dev server).
const transports = new Map<string, SSEServerTransport>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // Start SSE connection
        const transport = new SSEServerTransport("/api/mcp", res);
        const server = createMcpServer();

        // Store transport (using session ID? The SDK generates a session ID?)
        // SSEServerTransport generates a session ID internally usually, or works with the path.
        // We'll trust the SDK.

        // Actually, handling this in Next.js Serverless functions is hard because we can't share state.
        // BUT we are running locally `next dev` so it might work.

        // With SDK, we create a server and connect.
        await server.connect(transport);

        // We need to keep a reference to this transport for the POST handler?
        // The SDK's SSEServerTransport usually expects us to route the POST request to `transport.handlePostMessage`.
        // But we need THAT specific transport instance.
        // If we have multiple connections, we need to map session ID -> Transport.

        // Workaround: Use a single global transport for the "latest" connection (Demo only).
        // Or parse session ID from query params if SDK sends it?

        // Better: Allow the transport to handle itself.
        // The `transport.start(res)` is not explicitly in the new SDK syntax?
        // It's `server.connect(transport)`.

        // Let's look at SDK examples for SSE.
        // Usually:
        // app.get("/sse", (req, res) => transport.start(res));
        // app.post("/messages", (req, res) => transport.handlePostMessage(req, res));

        // So we need to store `transport`.
        // I'll store it in a global map keyed by... wait, the client implementation of SSE sends a session ID?
        // Initial GET doesn't have it.

        // Let's just implement a single global transport for simplicity.
        // This allows ONE user to connect at a time.

        (global as any).mcpTransport = transport;

        // Keep connection open
        res.on("close", () => {
            console.log("MCP Connection closed");
            server.close();
        });

        return;
    }

    if (req.method === "POST") {
        const transport = (global as any).mcpTransport as SSEServerTransport;
        if (!transport) {
            res.status(404).json({ error: "No active connection" });
            return;
        }
        await transport.handlePostMessage(req, res);
        return;
    }

    res.status(405).json({ error: "Method not allowed" });
}
