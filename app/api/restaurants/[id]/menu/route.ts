
import { NextResponse } from 'next/server';
import { RESTAURANTS } from '@/lib/data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    // Next.js 16 params are async
    const { id } = await params;
    const restaurant = RESTAURANTS.find((r) => r.id === id);

    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant.menu);
}
