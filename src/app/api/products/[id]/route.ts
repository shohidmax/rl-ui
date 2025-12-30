import { NextRequest } from 'next/server';
import { ProductService } from '@/lib/services/product.service';
import { ApiResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const product = await ProductService.getProductById(params.id);
        if (!product) {
            return ApiResponse.error('Product not found', 404);
        }
        return ApiResponse.success(product);
    } catch (error) {
        return ApiResponse.error('Failed to fetch product', 500);
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const body = await request.json();
        const product = await ProductService.updateProduct(params.id, body);
        if (!product) {
            return ApiResponse.error('Product not found', 404);
        }
        return ApiResponse.success(product);
    } catch (error) {
        return ApiResponse.error('Failed to update product', 500);
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const product = await ProductService.deleteProduct(params.id);
        if (!product) {
            return ApiResponse.error('Product not found', 404);
        }
        return ApiResponse.success({ message: 'Product deleted' });
    } catch (error) {
        return ApiResponse.error('Failed to delete product', 500);
    }
}
