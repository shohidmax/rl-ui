import { NextRequest } from 'next/server';
import { UserService } from '@/lib/services/user.service';
import { ApiResponse } from '@/lib/api-response';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parseResult = registerSchema.safeParse(body);

        if (!parseResult.success) {
            return ApiResponse.error('Invalid input', 400, parseResult.error.format());
        }

        const { name, email, password } = parseResult.data;

        // Check if it's the first user -> auto make admin? Optional nice-to-have.
        // For now, simple create.
        const user = await UserService.createUser({ name, email, password, role: 'user' });

        return ApiResponse.success(user, 201);
    } catch (error: any) {
        return ApiResponse.error(error.message || 'Registration failed', 400);
    }
}
