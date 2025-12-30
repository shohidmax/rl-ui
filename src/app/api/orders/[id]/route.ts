import { NextRequest } from 'next/server';
import { OrderService } from '@/lib/services/order.service';
import { ApiResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const order = await OrderService.getOrderById(params.id);
        if (!order) return ApiResponse.error('Order not found', 404);
        return ApiResponse.success(order);
    } catch (error) {
        return ApiResponse.error('Failed to fetch order', 500);
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json();
        const order = await OrderService.updateOrder(params.id, body);
        if (!order) return ApiResponse.error('Order not found', 404);
        return ApiResponse.success(order);
    } catch (error) {
        return ApiResponse.error('Failed to update order', 500);
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const order = await OrderService.deleteOrder(params.id);
        if (!order) return ApiResponse.error('Order not found', 404);
        return ApiResponse.success({ message: 'Order deleted' });
    } catch (error) {
        return ApiResponse.error('Failed to delete order', 500);
    }
}
