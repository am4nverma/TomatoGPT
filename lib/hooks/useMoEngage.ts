"use client";

import { useState, useEffect, useCallback } from 'react';
import moengage from '@moengage/web-sdk';

interface UseMoEngageOptions {
    app_id: string;
    debug_logs?: number;
    cluster?: string;
}

interface MoEngageInstance {
    isInitialized: boolean;
    trackEvent: (eventName: string, attributes?: Record<string, any>) => void;
    changeUser: (userId: string) => void;
    addUserAttribute: (key: string, value: any) => void;
    openSession: () => void;
}

/**
 * Custom hook for MoEngage integration in ChatGPT widgets
 * Similar to Braze's useBraze hook
 */
export function useMoEngage(options: UseMoEngageOptions): MoEngageInstance {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            // Initialize MoEngage
            moengage.initialize({
                app_id: options.app_id,
                debug_logs: options.debug_logs ?? 0,
                cluster: options.cluster ?? 'DC_1'
            });

            setIsInitialized(true);
            console.log('[MoEngage Widget] Initialized successfully');
        } catch (error) {
            console.error('[MoEngage Widget] Initialization failed:', error);
        }

        // Cleanup on unmount
        return () => {
            // MoEngage SDK doesn't have a destroy method
            // Cleanup is handled automatically
            console.log('[MoEngage Widget] Component unmounting');
        };
    }, [options.app_id, options.debug_logs, options.cluster]);

    const trackEvent = useCallback((eventName: string, attributes: Record<string, any> = {}) => {
        if (!isInitialized) {
            console.warn('[MoEngage Widget] Not initialized, cannot track event');
            return;
        }

        try {
            moengage.track_event(eventName, attributes);
            console.log(`[MoEngage Widget] Tracked: ${eventName}`, attributes);
        } catch (error) {
            console.error('[MoEngage Widget] Track event failed:', error);
        }
    }, [isInitialized]);

    const changeUser = useCallback((userId: string) => {
        if (!isInitialized) {
            console.warn('[MoEngage Widget] Not initialized, cannot change user');
            return;
        }

        try {
            moengage.add_unique_user_id(userId);
            console.log(`[MoEngage Widget] User changed to: ${userId}`);
        } catch (error) {
            console.error('[MoEngage Widget] Change user failed:', error);
        }
    }, [isInitialized]);

    const addUserAttribute = useCallback((key: string, value: any) => {
        if (!isInitialized) {
            console.warn('[MoEngage Widget] Not initialized, cannot add attribute');
            return;
        }

        try {
            moengage.add_user_attribute(key, value);
            console.log(`[MoEngage Widget] Added attribute: ${key} = ${value}`);
        } catch (error) {
            console.error('[MoEngage Widget] Add attribute failed:', error);
        }
    }, [isInitialized]);

    const openSession = useCallback(() => {
        if (!isInitialized) {
            console.warn('[MoEngage Widget] Not initialized, cannot open session');
            return;
        }

        try {
            // MoEngage doesn't have explicit openSession, but we can track it
            trackEvent('session_started', {
                source: 'chatgpt_widget',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('[MoEngage Widget] Open session failed:', error);
        }
    }, [isInitialized, trackEvent]);



    return {
        isInitialized,
        trackEvent,
        changeUser,
        addUserAttribute,
        openSession
    };
}
