import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { device_id } = body;

        if (!device_id) {
            return NextResponse.json(
                { error: 'device_id is required' },
                { status: 400 }
            );
        }

        // In a real app, you would bind this device_id to a session or user
        console.log(`Device ID registered: ${device_id}`);

        return NextResponse.json({ success: true, device_id });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
