import { createMcpServer } from "@/lib/mcp-server";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { NextApiRequest, NextApiResponse } from "next";

// Global map to store transports by session/connection if needed.
// For simple demo, we'll try to handle it within the same instance if possible,
// or just instantiate a transport per connection.
// But POST request comes separately. The Transport needs to be retrieved.
// IN MEMORY STORAGE (Only works for single instance dev server).
// Global map to store transports by session ID
const transportMap = new Map<string, SSEServerTransport>();
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'mcp-debug.log');

function log(message: string) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    try {
        fs.appendFileSync(LOG_FILE, logLine);
    } catch (e) {
        // console.error("Failed to write log", e);
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
    // Widget CSP Configuration for ChatGPT Custom Widgets
    // MoEngage whitelisting URLs - https://developers.moengage.com/hc/en-us/articles/360060713252
    "openai/widgetCSP": {
        connect_domains: [
            // MoEngage API endpoints (all data centers)
            "https://api-01.moengage.com",
            "https://api-02.moengage.com",
            "https://api-03.moengage.com",
            "https://api-04.moengage.com",
            "https://api-05.moengage.com",
            "https://api-06.moengage.com",
            "https://api-07.moengage.com",
            "https://api-08.moengage.com",
            "https://api-09.moengage.com",
            "https://api-10.moengage.com",
            "https://api-11.moengage.com",
            "https://api-12.moengage.com",
            "https://api-13.moengage.com",
            "https://api-14.moengage.com",
            "https://api-15.moengage.com",
            "https://api-16.moengage.com",
            "https://api-17.moengage.com",
            "https://api-18.moengage.com",
            "https://api-19.moengage.com",
            "https://api-20.moengage.com"
        ],
        resource_domains: [
            // MoEngage CDN for SDK and assets
            "https://cdn.moengage.com",
            "https://cdn-01.moengage.com",
            "https://cdn-02.moengage.com",
            "https://cdn-03.moengage.com",
            "https://cdn-04.moengage.com",
            "https://cdn-05.moengage.com",
            // Additional resources
            "https://use.fontawesome.com" // For icons if needed
        ]
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    log(`MCP Request: ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        log(`Query: ${JSON.stringify(req.query)}`);
    }

    if (req.method === "GET") {
        log("MCP: Starting SSE connection");
        try {
            const transport = new SSEServerTransport("/api/mcp", res);
            const server = createMcpServer();

            // Store global transport for fallback
            (global as any).mcpTransport = transport;

            // Try to store in map if sessionId exists
            // The SDK creates sessionId in constructor.
            const sessionId = (transport as any).sessionId;
            if (sessionId) {
                log(`MCP: Registering session ${sessionId}`);
                transportMap.set(sessionId, transport);
            } else {
                log("MCP: No session ID found on transport");
            }

            log("MCP: Server connected to transport");
            server.connect(transport);

            // Cleanup on close
            res.on("close", () => {
                log("MCP Connection closed");
                server.close();
                if ((global as any).mcpTransport === transport) {
                    (global as any).mcpTransport = null;
                    log("MCP: Global transport cleared");
                }
                if (sessionId) {
                    transportMap.delete(sessionId);
                    log(`MCP: Session ${sessionId} cleared`);
                }
            });
        } catch (error) {
            log(`MCP: Error establishing SSE connection: ${error}`);
            res.status(500).json({ error: "Failed to connect" });
        }
        return;
    }

    if (req.method === "POST") {
        log("MCP: Handling POST message");

        const { sessionId } = req.query;
        let transport: SSEServerTransport | undefined;

        if (typeof sessionId === 'string') {
            log(`MCP: Looking up session ${sessionId}`);
            transport = transportMap.get(sessionId);
        }

        // Fallback to global
        if (!transport) {
            log("MCP: Session not found or not provided, checking global fallback");
            transport = (global as any).mcpTransport as SSEServerTransport;
        }

        if (!transport) {
            log("MCP: No active transport found (connection might be closed)");
            log(`MCP: Query: ${JSON.stringify(req.query)}`);
            res.status(404).json({ error: "No active connection" });
            return;
        }

        try {
            log("MCP: Delegating to transport.handlePostMessage");
            await transport.handlePostMessage(req, res);
            log("MCP: POST message handled successfully");
        } catch (error: any) {
            log(`MCP: Error handling POST message full error: ${error}`);
            // Check for specific error types if possible
            const errorMessage = error instanceof Error ? error.message : String(error);
            log(`MCP: Stack trace: ${error?.stack}`);

            res.status(500).json({
                error: "Internal Server Error",
                details: errorMessage
            });
        }
        return;
    }

    res.status(405).json({ error: "Method not allowed" });
}
