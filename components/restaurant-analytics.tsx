"use client";

import { useEffect } from "react";
import { trackEvent, AnalyticsEvents } from "@/lib/moengage";

export function RestaurantAnalytics({
    id,
    name,
}: {
    id: string;
    name: string;
}) {
    useEffect(() => {
        trackEvent(AnalyticsEvents.VIEW_RESTAURANT, {
            restaurant_id: id,
            name: name,
        });
    }, [id, name]);

    return null;
}
