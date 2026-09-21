import { NextResponse } from 'next/server';
import { serverApi } from '@/lib/api/server';
import { API_ENDPOINTS, AUTH_COOKIE_KEYS } from '@/constants/api-routes';
import {
  extractAuthTokens,
  getStoredRefreshToken,
  setStoredAccessToken,
} from '@/lib/api/token';
import { handleRouteError } from '@/lib/api/route-error';
import type { RefreshTokenResponseData } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function POST() {
  const refreshToken = await getStoredRefreshToken();

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: 'Refresh token is missing or expired' },
      { status: 401 }
    );
  }

  try {
    const data = await serverApi.post<ApiResponse<RefreshTokenResponseData>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      undefined,
      {
        headers: {
          Cookie: `${AUTH_COOKIE_KEYS.REFRESH_TOKEN}=${refreshToken}`,
        },
      }
    );

    // The refresh token itself is never rotated or overwritten here.
    const { accessToken } = extractAuthTokens(data);
    if (accessToken) await setStoredAccessToken(accessToken);

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleRouteError(error, 'Token refresh failed');
  }
}
