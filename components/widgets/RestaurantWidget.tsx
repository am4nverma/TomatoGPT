"use client";

import { useState, useEffect } from 'react';
import { useMoEngage } from '@/lib/hooks/useMoEngage';
import { Restaurant } from '@/lib/data';
import Image from 'next/image';

interface RestaurantWidgetProps {
    restaurants: Restaurant[];
    query?: string;
}

/**
 * Custom ChatGPT Widget for Restaurant Discovery
 * Includes MoEngage tracking (similar to Braze implementation)
 */
export function RestaurantWidget({ restaurants, query = '' }: RestaurantWidgetProps) {
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    // Initialize MoEngage (like Braze's useBraze)
    const moengage = useMoEngage({
        app_id: "TEST_MOENGAGE_KEY",
        debug_logs: 1
    });

    useEffect(() => {
        if (!moengage.isInitialized) {
            return;
        }

        // Set user identity (if available)
        // In production, get this from ChatGPT context
        moengage.changeUser("chatgpt-user-123");

        // Track widget view
        moengage.trackEvent("widget_viewed", {
            widget_type: "restaurant_list",
            query: query,
            results_count: restaurants.length,
            source: "chatgpt_widget"
        });

        // Open session
        moengage.openSession();

        return () => {
            // Cleanup handled by hook
        };
    }, [moengage.isInitialized, query, restaurants.length]);

    const handleRestaurantClick = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);

        // Track restaurant click
        moengage.trackEvent("restaurant_clicked", {
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name,
            cuisine: restaurant.cuisine.join(", "),
            rating: restaurant.rating
        });
    };

    const handleViewMenu = (restaurant: Restaurant) => {
        // Track menu view
        moengage.trackEvent("menu_viewed", {
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name,
            source: "widget_button"
        });
    };

    if (restaurants.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No restaurants found for "{query}"
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
                🍅 Restaurants {query && `for "${query}"`}
            </h2>

            {/* Horizontal Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="min-w-[300px] snap-center bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => handleRestaurantClick(restaurant)}
                    >
                        {/* Restaurant Image */}
                        <div className="relative h-48 w-full">
                            <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Restaurant Info */}
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                {restaurant.cuisine.join(" • ")}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-yellow-500">⭐ {restaurant.rating}</span>
                                <span className="text-gray-500">{restaurant.deliveryTime}</span>
                            </div>

                            {/* View Menu Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewMenu(restaurant);
                                }}
                                className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                View Menu
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Restaurant Details */}
            {selectedRestaurant && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">
                        Selected: {selectedRestaurant.name}
                    </h3>
                    <p className="text-sm text-gray-700">
                        You selected {selectedRestaurant.name}.
                        Click "View Menu" to see available items.
                    </p>
                </div>
            )}

            {/* Tracking Info (Debug) */}
            {moengage.isInitialized && (
                <div className="mt-4 p-3 bg-green-50 rounded text-xs text-green-800">
                    ✅ MoEngage tracking active in widget
                </div>
            )}
        </div>
    );
}
