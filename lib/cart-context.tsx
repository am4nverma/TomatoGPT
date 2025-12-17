"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "./data";

type CartItem = MenuItem & { quantity: number; restaurantId: string };

type CartContextType = {
    items: CartItem[];
    addToCart: (item: MenuItem, restaurantId: string) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, delta: number) => void;
    clearCart: () => void;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Hydrate from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("tomato-cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tomato-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item: MenuItem, restaurantId: string) => {
        setItems((prev) => {
            // If adding from a different restaurant, ask user to clear? 
            // For simplicity, we'll allow it but maybe warn in UI or just clear?
            // Zomato usually prompts. We'll just append for this MVP or clear if mismatched.
            // Let's enforce single restaurant cart for simplicity.
            const existingRestaurant = prev[0]?.restaurantId;
            if (existingRestaurant && existingRestaurant !== restaurantId) {
                if (!confirm("Start a fresh cart from this restaurant?")) return prev;
                return [{ ...item, quantity: 1, restaurantId }];
            }

            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1, restaurantId }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setItems((prev) =>
            prev
                .map((i) => {
                    if (i.id === itemId) {
                        return { ...i, quantity: Math.max(0, i.quantity + delta) };
                    }
                    return i;
                })
                .filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
