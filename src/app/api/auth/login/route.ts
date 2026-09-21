import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/api/server';
import { API_ENDPOINTS, AUTH_COOKIE_KEYS } from '@/constants/api-routes';
import { HttpError } from '@/lib/api/root-http';
import type { LoginPayload, LoginResponseData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body: LoginPayload = await req.json();
    const data = await serverApi.post<
      ApiResponse<LoginResponseData>,
      LoginPayload
    >(API_ENDPOINTS.AUTH.LOGIN, body);

    const response = NextResponse.json(data);

    // Extract auth token if returned in body
    const token =
      data?.data?.token ??
      (data?.data as Record<string, unknown>)?.accessToken ??
      (data as unknown as Record<string, unknown>)?.token ??
      (data as unknown as Record<string, unknown>)?.accessToken;

    if (typeof token === 'string' && token.length > 0) {
      response.cookies.set(AUTH_COOKIE_KEYS.ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // Extract refresh token if returned in body
    const refreshToken =
      (data?.data as Record<string, unknown>)?.refreshToken ??
      (data as unknown as Record<string, unknown>)?.refreshToken;

    if (typeof refreshToken === 'string' && refreshToken.length > 0) {
      response.cookies.set(AUTH_COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
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

    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { success: false, message, statusCode: 500 },
      { status: 500 }
    );
  }
}
