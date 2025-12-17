import moengage from "@moengage/web-sdk";

export const MOENGAGE_APP_ID = "YOUR_MOENGAGE_APP_ID"; // Replace with actual App ID

export const initMoEngage = () => {
    moengage.initialize({
        app_id: MOENGAGE_APP_ID,
        debug_logs: 1, // Enable for dev
        cluster: "DC_1", // Default cluster, adjust if needed
    });
};

export const trackEvent = (eventName: string, attributes: Record<string, any> = {}) => {
    try {
        moengage.track_event(eventName, attributes);
        console.log(`[MoEngage] Tracked: ${eventName}`, attributes);
    } catch (e) {
        console.error("[MoEngage] Failed to track event", e);
    }
};

export const AnalyticsEvents = {
    VIEW_HOME: "view_home",
    VIEW_RESTAURANT: "view_restaurant",
    ADD_TO_CART: "add_to_cart",
    REMOVE_FROM_CART: "remove_from_cart",
    CHECKOUT_STARTED: "checkout_started",
    ORDER_PLACED: "order_placed",
    SEARCH: "search",
};
