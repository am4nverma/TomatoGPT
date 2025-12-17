import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { Restaurant } from "@/lib/data";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    return (
        <Link href={`/restaurant/${restaurant.id}`} className="group block">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-gray-800 backdrop-blur-sm">
                        {restaurant.deliveryTime}
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                            {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1 rounded-md bg-green-600 px-1.5 py-0.5 text-white">
                            <span className="text-xs font-bold">{restaurant.rating}</span>
                            <Star className="h-3 w-3 fill-current" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <p className="truncate">{restaurant.cuisine.join(", ")}</p>
                        <p>${restaurant.priceForTwo} for two</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
