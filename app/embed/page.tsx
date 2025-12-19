"use client";

import { useState, useEffect } from "react";
import { Restaurant } from "@/lib/data";
import { RestaurantCard } from "@/components/restaurant-card";

export default function EmbedPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await fetch("/api/search?q=");
                const data = await res.json();

                if (data.items) {
                    const mappedRestaurants: Restaurant[] = data.items.map((item: any) => {
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
                }
            } catch (error) {
                console.error("Failed to fetch restaurants", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    🍅 TomatoGPT Restaurants
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                        {restaurants.map((r) => (
                            <div key={r.id} className="min-w-[300px] snap-center">
                                <RestaurantCard restaurant={r} />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && restaurants.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        No restaurants found.
                    </div>
                )}
            </div>
        </div>
    );
}
