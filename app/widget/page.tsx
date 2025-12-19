"use client";

import { useEffect, useState } from "react";
import { Search, ArrowLeft, ShoppingBag } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant-card";
import { MenuItemCard } from "@/components/menu-item-card";
import { Restaurant, MenuItem } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { trackEvent } from "@/lib/moengage";

type ViewState = "list" | "menu";

export default function WidgetPage() {
    const [view, setView] = useState<ViewState>("list");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isInIframe, setIsInIframe] = useState(false);

    const { items: cartItems } = useCart();
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Iframe detection
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const inIframe = window.self !== window.top;
                setIsInIframe(inIframe);
                if (inIframe) {
                    document.body.classList.add("widget-mode");
                }
            } catch (e) {
                setIsInIframe(true);
            }
        }
    }, []);

    // Initial load - fetch all restaurants & set device ID
    useEffect(() => {
        // Bind device ID
        const bindDevice = async () => {
            try {
                // Generate a random ID if not exists, or use a constant
                const deviceId = "widget-user-" + Math.random().toString(36).substring(7);
                await fetch("/api/set_device_id", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ device_id: deviceId }),
                });
                console.log("Device ID bound:", deviceId);
            } catch (e) {
                console.error("Failed to bind device ID", e);
            }
        };

        bindDevice();
        fetchRestaurants();

        // Listen for tool results from the host (LLM)
        const handleToolResult = (event: any) => {
            console.log("TOOL RESULT EVENT RECEIVED:", event.detail);
            let toolOutput = event.detail?.globals?.toolOutput;

            // Parse if string (common with MCP text content)
            if (typeof toolOutput === "string") {
                try {
                    toolOutput = JSON.parse(toolOutput);
                } catch (e) {
                    console.error("Failed to parse tool output:", e);
                }
            }

            if (toolOutput && toolOutput.visual_mode) {
                console.log("Visual mode active, rendering items:", toolOutput.items);
                if (toolOutput.items) {
                    // Map items to Restaurant format if needed, or use directly if schema matches
                    // valid schema: items[{ id, title, subtitle, imageUrl, meta, cta }]
                    // target schema: Restaurant[{ id, name, cuisine, rating, deliveryTime, image, ... }]

                    const mappedRestaurants: Restaurant[] = toolOutput.items.map((item: any) => {
                        let rating = 4.5;
                        let deliveryTime = "30-40 min";
                        if (item.meta) {
                            const parts = item.meta.split("·").map((s: string) => s.trim());
                            if (parts[0]) rating = parseFloat(parts[0].replace("⭐", "").trim()) || 4.5;
                            if (parts[1]) deliveryTime = parts[1];
                        }

                        return {
                            id: item.id,
                            name: item.title,
                            cuisine: item.subtitle ? item.subtitle.split("•").map((s: string) => s.trim()) : [],
                            rating: rating,
                            deliveryTime: deliveryTime,
                            priceForTwo: 30,
                            image: item.imageUrl,
                            address: "Unknown Address",
                            menu: []
                        };
                    });
                    setRestaurants(mappedRestaurants);
                    setView("list");
                }
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("openai:set_globals", handleToolResult);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("openai:set_globals", handleToolResult);
            }
        };
    }, []);

    const fetchRestaurants = async (query: string = "") => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/search?q=${query}`);
            const data = await res.json();
            // Map the API response (items[]) back to Restaurant objects if needed
            // The API now returns: { items: [...] } where items have title, imageUrl etc.
            // We need to map it back to our internal Restaurant type for the components

            if (data.items) {
                const mappedRestaurants: Restaurant[] = data.items.map((item: any) => {
                    // Parse meta "⭐ 4.5 · 30-40 min"
                    let rating = 4.5;
                    let deliveryTime = "30-40 min";
                    if (item.meta) {
                        const parts = item.meta.split("·").map((s: string) => s.trim());
                        if (parts[0]) rating = parseFloat(parts[0].replace("⭐", "").trim()) || 4.5;
                        if (parts[1]) deliveryTime = parts[1];
                    }

                    return {
                        id: item.id,
                        name: item.title,
                        cuisine: item.subtitle ? item.subtitle.split("•").map((s: string) => s.trim()) : [],
                        rating: rating,
                        deliveryTime: deliveryTime,
                        priceForTwo: 30, // Default
                        image: item.imageUrl,
                        address: "Unknown Address",
                        menu: []
                    };
                });
                setRestaurants(mappedRestaurants);
            }
        } catch (error) {
            console.error("Failed to fetch restaurants", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRestaurants(searchQuery);
    };

    const handleRestaurantClick = async (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsLoading(true);
        try {
            // Fetch menu
            const res = await fetch(`/api/restaurants/${restaurant.id}/menu`); // Assuming this endpoint exists from previous context
            // If it doesn't exist, we might need to rely on the static data or the previous logic
            // Checking existing files... we do have /api/restaurants/[id]/menu

            if (res.ok) {
                const menu = await res.json();
                setMenuItems(menu);
                setView("menu");
                trackEvent("view_menu", { restaurant_id: restaurant.id, restaurant_name: restaurant.name });
            } else {
                console.error("Failed to load menu");
            }
        } catch (error) {
            console.error("Error loading menu", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setView("list");
        setSelectedRestaurant(null);
        setMenuItems([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
            {/* Header / Search */}
            <div className="sticky top-0 z-10 bg-white shadow-sm p-4">
                {view === "list" ? (
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search for restaurants..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </form>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{selectedRestaurant?.name}</h2>
                            <p className="text-xs text-gray-500">{selectedRestaurant?.deliveryTime} • {selectedRestaurant?.rating} ⭐</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : view === "list" ? (
                    <div className="space-y-4">
                        <h2 className="font-bold text-lg px-1 mb-2">Nearby Restaurants</h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-1 scrollbar-hide">
                            {restaurants.map((r) => (
                                <div key={r.id} onClick={() => handleRestaurantClick(r)} className="cursor-pointer min-w-[280px] snap-center">
                                    <RestaurantCard restaurant={r} />
                                </div>
                            ))}
                        </div>
                        {restaurants.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                No restaurants found.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {menuItems.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    restaurantId={selectedRestaurant?.id || ""}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Cart Footer */}
            {cartCount > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-20">
                    <button className="w-full bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:bg-green-700 transition-transform active:scale-95">
                        <div className="flex items-center gap-2">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">{cartCount}</span>
                            <span className="font-medium text-sm">View Cart</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                            <span>${cartTotal.toFixed(2)}</span>
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
