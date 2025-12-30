import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ApiResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return ApiResponse.error('No file uploaded', 400);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure dir exists (simplified, assuming public exists, or we might need fs.mkdir)
        const { mkdir } = require('fs/promises');
        await mkdir(uploadDir, { recursive: true });

        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        const url = `/uploads/${filename}`;
        return ApiResponse.success({ url });
    } catch (error: any) {
        console.error('Upload error:', error);
        return ApiResponse.error('Upload failed', 500);
    }
}
