"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { MenuItem } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { trackEvent, AnalyticsEvents } from "@/lib/moengage";

export function MenuItemCard({
    item,
    restaurantId,
}: {
    item: MenuItem;
    restaurantId: string;
}) {
    const { items, addToCart, removeFromCart, updateQuantity } = useCart();
    const cartItem = items.find((i) => i.id === item.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        addToCart(item, restaurantId);
        trackEvent(AnalyticsEvents.ADD_TO_CART, {
            item_id: item.id,
            name: item.name,
            price: item.price,
            restaurant_id: restaurantId,
        });
    };

    const handleIncrement = () => {
        addToCart(item, restaurantId);
        trackEvent("increment_quantity", { item_id: item.id });
    };

    const handleDecrement = () => {
        updateQuantity(item.id, -1);
        trackEvent("decrement_quantity", { item_id: item.id });
    };

    return (
        <div className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-all bg-white">
            <div className="flex-1 space-y-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-gray-900">${item.price}</span>
                    {item.isVeg && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded border border-green-200">
                            VEG
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="w-24">
                    {quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="w-full py-1.5 px-3 bg-red-50 text-red-600 font-bold text-sm rounded-lg border border-red-100 hover:bg-red-100 transition-colors uppercase"
                        >
                            Add
                        </button>
                    ) : (
                        <div className="flex items-center justify-between bg-red-500 text-white rounded-lg p-1">
                            <button
                                onClick={handleDecrement}
                                className="p-1 hover:bg-red-600 rounded"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-bold text-sm">{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="p-1 hover:bg-red-600 rounded"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
