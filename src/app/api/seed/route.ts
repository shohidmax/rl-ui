
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product, Order, Category } from '@/lib/models';
import { products, categories, recentOrders } from '@/lib/data';

export async function POST() {
    try {
        await dbConnect();

        // Clear existing data to avoid duplicates (Optional: remove if you want to append)
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});

        // Seed Products
        await Product.insertMany(products);

        // Seed Categories
        await Category.insertMany(categories);

        // Seed Orders
        await Order.insertMany(recentOrders);

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
