"use client";

import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function Header() {
    const { items } = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-500">TomatoGPT</span>
                </Link>

                <div className="flex flex-1 items-center justify-center max-w-md mx-4">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search for restaurants, cuisine or a dish..."
                            className="w-full rounded-lg border bg-gray-50 pl-9 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-6">
                    <Link href="/checkout" className="relative group">
                        <ShoppingBag className="h-6 w-6 text-gray-700 group-hover:text-red-500 transition-colors" />
                        {count > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {count}
                            </span>
                        )}
                    </Link>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-red-500 to-orange-500" />
                </nav>
            </div>
        </header>
    );
}
