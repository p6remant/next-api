import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/api/server';
import { API_ENDPOINTS, AUTH_COOKIE_KEYS } from '@/constants/api-routes';
import { HttpError } from '@/lib/api/root-http';
import type { RegisterPayload, RegisterResponseData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();
    const data = await serverApi.post<
      ApiResponse<RegisterResponseData>,
      RegisterPayload
    >(API_ENDPOINTS.AUTH.REGISTER, body);

    const response = NextResponse.json(data, { status: 201 });

    // If registration immediately returns a session token, persist it
    const token =
      (data?.data as Record<string, unknown>)?.token ??
      (data?.data as Record<string, unknown>)?.accessToken ??
      (data as unknown as Record<string, unknown>)?.token ??
      (data as unknown as Record<string, unknown>)?.accessToken;

    if (typeof token === 'string' && token.length > 0) {
      response.cookies.set(AUTH_COOKIE_KEYS.ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      const status = error.status || 400;
      const errorBody =
        error.data && typeof error.data === 'object'
          ? error.data
          : { success: false, message: error.message, statusCode: status };
      return NextResponse.json(errorBody, { status });
    }

    const message =
      error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(
      { success: false, message, statusCode: 500 },
      { status: 500 }
    );
  }
}
