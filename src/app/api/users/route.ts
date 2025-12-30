import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { ApiResponse } from '@/lib/api-response';

export async function GET() {
    try {
        // In real app, check for Admin token here
        const users = await UserService.getAllUsers();
        return ApiResponse.success(users);
    } catch (error: any) {
        return ApiResponse.error('Failed to fetch users', 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, action, role } = body; // action: 'update_role' | 'delete_user'

        if (!userId || !action) {
            return ApiResponse.error('Missing userId or action', 400);
        }

        let result;
        if (action === 'update_role') {
            if (!role || !['admin', 'manager', 'editor', 'user'].includes(role)) {
                return ApiResponse.error('Invalid role', 400);
            }
            result = await UserService.updateRole(userId, role);
        } else if (action === 'delete_user') {
            result = await UserService.deleteUser(userId);
        } else {
            return ApiResponse.error('Invalid action', 400);
        }

        return ApiResponse.success(result);
    } catch (error: any) {
        return ApiResponse.error('Failed to update user', 500);
    }
}
