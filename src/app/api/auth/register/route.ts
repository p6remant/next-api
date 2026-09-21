import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api-routes';
import {
  extractAuthTokens,
  setStoredAccessToken,
  setStoredRefreshToken,
} from '@/lib/api/token';
import { handleRouteError } from '@/lib/api/route-error';
import type { RegisterPayload, RegisterResponseData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();
    const data = await serverApi.post<
      ApiResponse<RegisterResponseData>,
      RegisterPayload
    >(API_ENDPOINTS.AUTH.REGISTER, body);

    // If registration immediately returns session tokens, persist them.
    const { accessToken, refreshToken } = extractAuthTokens(data);
    if (accessToken) await setStoredAccessToken(accessToken);
    if (refreshToken) await setStoredRefreshToken(refreshToken);

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    return handleRouteError(error, 'Registration failed');
  }
}
