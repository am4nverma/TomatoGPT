
import { NextResponse } from 'next/server';
import { RESTAURANTS } from '@/lib/data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() ?? '';

    const results = RESTAURANTS.filter(
        (r) =>
            r.name.toLowerCase().includes(query) ||
            r.cuisine.some((c) => c.toLowerCase().includes(query)) ||
            r.menu.some((m) => m.name.toLowerCase().includes(query))
    );

    // Transform to widget-compatible schema
    const response = {
        visual_mode: true,
        display_type: "carousel", // Hint for ChatGPT GPT visual rendering
        items: results.map((r) => ({
            id: r.id,
            title: r.name,
            subtitle: r.cuisine.join(" • "),
            imageUrl: r.image,
            meta: `⭐ ${r.rating} · ${r.deliveryTime}`,
            cta: {
                text: "View Menu",
                action: "OPEN_MENU",
                value: r.id
            }
        }))
    };

    return NextResponse.json(response);
}
