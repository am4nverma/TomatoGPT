"use client";

import { useEffect } from "react";
import { initMoEngage } from "@/lib/moengage";

export function MoEngageProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initMoEngage();
    }, []);

    return <>{children}</>;
}
