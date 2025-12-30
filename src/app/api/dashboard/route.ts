import { NextRequest } from 'next/server';
import { OrderService } from '@/lib/services/order.service';
import { ProductService } from '@/lib/services/product.service';
import { ApiResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const orders = await OrderService.getOrders();
        const products = await ProductService.getProducts();
        return ApiResponse.success({ orders, products });
    } catch (error) {
        return ApiResponse.error('Failed to fetch dashboard data', 500);
    }
}
