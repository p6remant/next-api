import 'server-only';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_KEYS } from '@/constants/api-routes';

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function buildCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function getStoredAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN)?.value;
}

export async function getStoredRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_KEYS.REFRESH_TOKEN)?.value;
}

export async function setStoredAccessToken(tokenValue: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE_KEYS.ACCESS_TOKEN,
    tokenValue,
    buildCookieOptions(ACCESS_TOKEN_MAX_AGE)
  );
}

export async function setStoredRefreshToken(
  tokenValue: string
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE_KEYS.REFRESH_TOKEN,
    tokenValue,
    buildCookieOptions(REFRESH_TOKEN_MAX_AGE)
  );
}

export async function clearStoredAuthTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_KEYS.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIE_KEYS.REFRESH_TOKEN);
}

export interface ExtractedAuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Normalizes token extraction across backend response shapes, checking both
 * the top-level envelope and a nested `data` object.
 */
export function extractAuthTokens(data: unknown): ExtractedAuthTokens {
  const topLevel = (data ?? {}) as Record<string, unknown>;
  const nested =
    topLevel.data && typeof topLevel.data === 'object'
      ? (topLevel.data as Record<string, unknown>)
      : undefined;

  const pickString = (...keys: string[]): string | undefined => {
    for (const source of [nested, topLevel]) {
      if (!source) continue;
      for (const key of keys) {
        const value = source[key];
        if (typeof value === 'string' && value.length > 0) return value;
      }
    }
    return undefined;
  };

  return {
    accessToken: pickString('token', 'accessToken'),
    refreshToken: pickString('refreshToken'),
  };
}
