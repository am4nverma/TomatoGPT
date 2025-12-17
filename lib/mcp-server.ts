import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { RESTAURANTS } from "./data";

// Singleton instance to keep state (in a real app, use database)
// Note: Next.js dev server reloads might reset this, but acceptable for demo.
// For production, this should be outside or stateless.
// Since we are using SSE, the transport connection is persistent per session.

export const createMcpServer = () => {
    const server = new McpServer({
        name: "TomatoGPT",
        version: "1.0.0",
    });

    server.tool(
        "search_restaurants",
        { query: z.string().describe("Search query for restaurants or food") },
        async ({ query }) => {
            const q = query.toLowerCase();
            const results = RESTAURANTS.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
                    r.menu.some((m) => m.name.toLowerCase().includes(q))
            );
            return {
                content: [{ type: "text", text: JSON.stringify(results.map(r => ({ name: r.name, id: r.id, cuisine: r.cuisine }))) }]
            };
        }
    );

    server.tool(
        "get_restaurant_menu",
        { restaurant_id: z.string().describe("ID of the restaurant") },
        async ({ restaurant_id }) => {
            const restaurant = RESTAURANTS.find((r) => r.id === restaurant_id);
            if (!restaurant) return { content: [{ type: "text", text: "Restaurant not found" }] };
            return {
                content: [{ type: "text", text: JSON.stringify(restaurant.menu) }]
            };
        }
    );

    // Note: Cart management via simple tools is tricky without user session context in MCP.
    // For this demo, we can just return what *would* be added, or manage a global mock cart.
    // Apps SDK passes "client" context?
    // We'll just define the tools as requested.

    return server;
};
