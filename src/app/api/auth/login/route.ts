import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { ApiResponse } from '@/lib/api-response';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parseResult = loginSchema.safeParse(body);

        if (!parseResult.success) {
            return ApiResponse.error('Invalid input', 400);
        }

        const { email, password } = parseResult.data;
        const user = await UserService.findUserByEmail(email);

        if (!user || user.password !== password) { // Simple password check for demo
            return ApiResponse.error('Invalid credentials', 401);
        }

        // In a real app, generate JWT here.
        // For this demo, returning the user object is sufficient for client-side state
        return ApiResponse.success(user);
    } catch (error: any) {
        return ApiResponse.error(error.message || 'Login failed', 500);
    }
}
