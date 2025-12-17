"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

// Types for window.openai
declare global {
    interface Window {
        openai?: {
            toolOutput?: any;
            callTool?: (name: string, args: any) => Promise<any>;
        };
    }
}

export default function WidgetPage() {
    const [data, setData] = useState<any>(null);

    // Listen for openai:set_globals event to update state
    useEffect(() => {
        const handleSetGlobals = (event: any) => {
            const globals = event.detail?.globals;
            if (globals?.toolOutput) {
                setData(globals.toolOutput);
            }
        };

        window.addEventListener("openai:set_globals", handleSetGlobals);

        // Initial check
        if (window.openai?.toolOutput) {
            setData(window.openai.toolOutput);
        }

        return () => {
            window.removeEventListener("openai:set_globals", handleSetGlobals);
        };
    }, []);

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-sm">
                Waiting for interaction...
            </div>
        );
    }

    // Render logic based on the tool output content
    // Assuming the tool output returns raw JSON in "text" or structured content.
    // My MCP server usage returns `content: [{ type: "text", text: JSON... }]`.
    // So I need to parse it.

    let content = null;
    try {
        const text = data.content?.[0]?.text;
        if (text) content = JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse content", e);
    }

    if (!content) {
        return (
            <div className="p-4 text-sm">
                <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    }

    // If content is array of restaurants
    if (Array.isArray(content) && content[0]?.cuisine) { // Simple heuristic
        // Render Restaurant List Logic (Simplified)
        return (
            <div className="space-y-4 p-4">
                <h2 className="font-bold text-lg">Results</h2>
                <ul className="space-y-2">
                    {content.map((r: any) => (
                        <li key={r.id} className="border p-2 rounded">
                            <div className="font-bold">{r.name}</div>
                            <div className="text-xs text-gray-500">{r.cuisine.join(", ")}</div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // If content is menu (array of items)
    if (Array.isArray(content) && content[0]?.price) {
        return (
            <div className="space-y-4 p-4">
                <h2 className="font-bold text-lg">Menu</h2>
                <ul className="space-y-2">
                    {content.map((item: any) => (
                        <li key={item.id} className="border p-2 rounded flex justify-between items-center bg-white">
                            <div>
                                <div className="font-bold text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500">${item.price}</div>
                            </div>
                            {/* Add to Cart via callTool if available */}
                            <button
                                onClick={() => window.openai?.callTool?.("add_to_cart", { item_id: item.id, quantity: 1 })}
                                className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                            >
                                Add
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="p-4 overflow-auto max-h-[500px]">
            <pre className="text-xs">{JSON.stringify(content, null, 2)}</pre>
        </div>
    );
}
