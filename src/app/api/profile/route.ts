import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { ApiResponse } from '@/lib/api-response';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models'; // Direct model access for granular updates or stick to service if possible. 
// Extending service is better but direct here for speed on complex nested updates if service isn't ready.
// Actually, let's stick to direct DB here for specific profile logic or add a generic updateUser in service.

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return ApiResponse.error('Email is required', 400);
        }

        const user = await UserService.findUserByEmail(email);
        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        // Return everything except password
        const { password, ...userWithoutPassword } = user.toObject();
        return ApiResponse.success(userWithoutPassword);
    } catch (error: any) {
        return ApiResponse.error('Failed to fetch profile', 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, ...updateData } = body;

        if (!email) {
            return ApiResponse.error('Email is required', 400);
        }

        await dbConnect();

        // Prevent role update here for security, use admin API for that
        delete (updateData as any).role;
        delete (updateData as any).password;

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return ApiResponse.error('User not found', 404);
        }

        const { password, ...userWithoutPassword } = updatedUser.toObject();
        return ApiResponse.success(userWithoutPassword);
    } catch (error: any) {
        return ApiResponse.error('Failed to update profile', 500);
    }
}
