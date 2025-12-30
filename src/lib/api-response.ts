import { NextResponse } from 'next/server';

type ApiResponseData<T> = {
    success: boolean;
    data?: T;
    error?: string;
    meta?: any;
};

export class ApiResponse {
    static success<T>(data: T, status = 200, meta?: any) {
        return NextResponse.json<ApiResponseData<T>>(
            { success: true, data, meta },
            { status }
        );
    }

    static error(message: string, status = 500, errorDetails?: any) {
        return NextResponse.json<ApiResponseData<null>>(
            { success: false, error: message, meta: errorDetails },
            { status }
        );
    }
}
