import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Clock, MapPin } from "lucide-react";
import { RESTAURANTS } from "@/lib/data";
import { MenuItemCard } from "@/components/menu-item-card";
import { RestaurantAnalytics } from "@/components/restaurant-analytics";

// Next.js 15/16 App Router Dynamic Route Params
type Props = {
    params: Promise<{ id: string }>;
};

export default async function RestaurantPage({ params }: Props) {
    const { id } = await params;
    const restaurant = RESTAURANTS.find((r) => r.id === id);

    if (!restaurant) {
        notFound();
    }

    // Group menu by category
    const categories = Array.from(new Set(restaurant.menu.map((m) => m.category)));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative h-[250px] w-full rounded-2xl overflow-hidden">
                <RestaurantAnalytics id={restaurant.id} name={restaurant.name} />
                <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-2">
                    <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="px-2 py-0.5 bg-green-600 rounded text-white flex items-center gap-1">
                            {restaurant.rating} <Star className="h-3 w-3 fill-current" />
                        </span>
                        <span>{restaurant.cuisine.join(", ")}</span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {restaurant.deliveryTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {restaurant.address}
                        </span>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                {/* Sidebar Categories (Sticky) */}
                <aside className="hidden md:block">
                    <div className="sticky top-24 space-y-1">
                        <h3 className="font-bold text-gray-900 mb-4 px-2">Categories</h3>
                        {categories.map((cat) => (
                            <a
                                key={cat}
                                href={`#${cat}`}
                                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors"
                            >
                                {cat}
                            </a>
                        ))}
                    </div>
                </aside>

                {/* Menu Items */}
                <div className="space-y-10">
                    {categories.map((cat) => (
                        <div key={cat} id={cat} className="scroll-mt-24 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                                {cat}
                            </h2>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {restaurant.menu
                                    .filter((m) => m.category === cat)
                                    .map((item) => (
                                        <MenuItemCard
                                            key={item.id}
                                            item={item}
                                            restaurantId={restaurant.id}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
