"use client";

import { useEffect } from "react";
import { initMoEngage, getDeviceId } from "@/lib/moengage";

export function MoEngageProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initMoEngage();
        // Log device ID for debugging
        setTimeout(() => {
            getDeviceId();
        }, 1000); // Wait for SDK to initialize
    }, []);

    return <>{children}</>;
}
