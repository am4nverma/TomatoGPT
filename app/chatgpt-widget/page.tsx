"use client";

import { RestaurantWidget } from '@/components/widgets/RestaurantWidget';
import { RESTAURANTS } from '@/lib/data';
import { useState, useEffect } from 'react';

/**
 * Widget Entry Point for ChatGPT
 * This page is designed to be embedded as a custom widget in ChatGPT
 */
export default function WidgetEntryPage() {
    const [restaurants, setRestaurants] = useState(RESTAURANTS);
    const [query, setQuery] = useState('');

    // Listen for messages from ChatGPT (if applicable)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'SEARCH_RESTAURANTS') {
                const searchQuery = event.data.query?.toLowerCase() || '';
                setQuery(searchQuery);

                const filtered = RESTAURANTS.filter(r =>
                    r.name.toLowerCase().includes(searchQuery) ||
                    r.cuisine.some(c => c.toLowerCase().includes(searchQuery))
                );

                setRestaurants(filtered);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <RestaurantWidget restaurants={restaurants} query={query} />
        </div>
    );
}
