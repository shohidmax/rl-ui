
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Category } from '@/lib/models';

export async function GET() {
    await dbConnect();
    try {
        const categories = await Category.find({});
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
