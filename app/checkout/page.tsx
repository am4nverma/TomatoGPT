"use client";

import { useCart } from "@/lib/cart-context";
import { Trash2, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { trackEvent, AnalyticsEvents } from "@/lib/moengage";

export default function CheckoutPage() {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const [isOrdering, setIsOrdering] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (items.length > 0) {
            trackEvent(AnalyticsEvents.CHECKOUT_STARTED, {
                total,
                item_count: items.length
            });
        }
    }, [items.length, total]);

    const handlePlaceOrder = async () => {
        setIsOrdering(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsOrdering(false);
        setIsSuccess(true);
        trackEvent(AnalyticsEvents.ORDER_PLACED, {
            total,
            restaurant_id: items[0]?.restaurantId
        });
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-green-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
                    <p className="text-gray-500 mt-2">
                        Your food is being prepared and will be delivered soon.
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                    Browse More Restaurants
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <Image
                    src="https://illustrations.popsy.co/amber/surr-delivery.svg"
                    alt="Empty Cart"
                    width={300}
                    height={300}
                    className="opacity-50"
                />
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500">Go ahead and explore some delicious food.</p>
                <Link
                    href="/"
                    className="mt-4 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                    See Restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Order Summary</h1>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 border rounded-xl bg-white shadow-sm"
                        >
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500">${item.price}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center bg-gray-100 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-3 py-1 hover:bg-gray-200 rounded-l-lg"
                                        >
                                            -
                                        </button>
                                        <span className="px-2 text-sm font-bold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-3 py-1 hover:bg-gray-200 rounded-r-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        ${item.price * item.quantity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bill Details */}
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border space-y-4">
                    <h2 className="font-bold text-gray-900 text-lg">Bill Details</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Item Total</span>
                            <span>${total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>$5</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform Fee</span>
                            <span>$2</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                            <span>To Pay</span>
                            <span>${total + 5 + 2}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isOrdering}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {isOrdering ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            <>
                                Place Order <CreditCard className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
