import 'server-only';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_KEYS } from '@/constants/api-routes';

export async function getStoredAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN)?.value;
}

export async function setStoredAccessToken(
  tokenValue: string,
  maxAgeInSeconds = 60 * 60 * 24 * 7
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_KEYS.ACCESS_TOKEN, tokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeInSeconds,
  });
}

export async function clearStoredAuthTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_KEYS.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIE_KEYS.REFRESH_TOKEN);
}

// Backward-compatibility alias
export const getAuthToken = getStoredAccessToken;
