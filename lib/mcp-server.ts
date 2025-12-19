import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { RESTAURANTS } from "./data";

// Singleton instance to keep state (in a real app, use database)
// Note: Next.js dev server reloads might reset this, but acceptable for demo.
// For production, this should be outside or stateless.
// Since we are using SSE, the transport connection is persistent per session.

let CURRENT_DEVICE_ID: string | null = null;

export const createMcpServer = () => {
    const server = new McpServer({
        name: "TomatoGPT",
        version: "1.0.0",
    });

    server.tool(
        "set_device_id",
        { device_id: z.string().describe("The MoEngage Device ID (MOE_CLIENT_ID) from the user's browser") },
        async ({ device_id }) => {
            CURRENT_DEVICE_ID = device_id;
            return {
                content: [{ type: "text", text: `Device ID set to ${device_id}. Future events will be tracked for this user.` }]
            };
        }
    );

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
            // Construct the widget data with the requested 'visual_mode' flag
            const widgetData = {
                visual_mode: true,
                items: results.map((r) => ({
                    id: r.id,
                    title: r.name,
                    subtitle: r.cuisine.join(" • "),
                    imageUrl: r.image,
                    meta: `⭐ ${r.rating} · ${r.deliveryTime}`,
                    cta: {
                        text: "View Menu",
                        action: "OPEN_MENU",
                        value: r.id
                    }
                }))
            };

            // Return raw JSON string in content (required by SDK)
            // ensure NO markdown wrapping
            const responseText = JSON.stringify(widgetData);

            return {
                content: [
                    { type: "text", text: responseText }
                ]
            };
        }
    );

    server.tool(
        "get_restaurant_menu",
        { restaurant_id: z.string().describe("ID of the restaurant") },
        async ({ restaurant_id }) => {
            const restaurant = RESTAURANTS.find((r) => r.id === restaurant_id);
            if (!restaurant) return { content: [{ type: "text", text: "Restaurant not found" }] };

            // Construct the widget data with the requested 'visual_mode' flag
            const widgetData = {
                visual_mode: true,
                menu: restaurant.menu
            };

            // Return raw JSON string (required by SDK)
            const responseText = JSON.stringify(widgetData);

            return {
                content: [
                    { type: "text", text: responseText }
                ]
            };
        }
    );

    // Note: Cart management via simple tools is tricky without user session context in MCP.
    // For this demo, we can just return what *would* be added, or manage a global mock cart.
    // Apps SDK passes "client" context?
    // We'll just define the tools as requested.

    return server;
};
