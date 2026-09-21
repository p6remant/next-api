import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api-routes';
import {
  extractAuthTokens,
  setStoredAccessToken,
  setStoredRefreshToken,
} from '@/lib/api/token';
import { handleRouteError } from '@/lib/api/route-error';
import type { LoginPayload, LoginResponseData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body: LoginPayload = await req.json();
    const data = await serverApi.post<
      ApiResponse<LoginResponseData>,
      LoginPayload
    >(API_ENDPOINTS.AUTH.LOGIN, body);

    const { accessToken, refreshToken } = extractAuthTokens(data);
    if (accessToken) await setStoredAccessToken(accessToken);
    if (refreshToken) await setStoredRefreshToken(refreshToken);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleRouteError(error, 'Login failed');
  }
}
