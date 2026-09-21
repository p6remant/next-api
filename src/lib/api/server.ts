import 'server-only';
import { API_BASE_URL } from '@/constants/api-routes';
import { createHttpClient } from './http';
import { getStoredAccessToken } from './token';
import type { HttpRequestOptions } from '@/types/api';

/**
 * Server-only HTTP client.
 * Calls backend directly without routing through the proxy.
 */
export const serverApi = createHttpClient(
  API_BASE_URL,
  async (requestOptions: HttpRequestOptions) => {
    const accessToken =
      requestOptions.bearerToken ?? (await getStoredAccessToken());

    if (requestOptions.requiresAuthentication && !accessToken) {
      throw new Error('Unauthorized: Access token is missing');
    }

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return { headers };
  }
);

export default serverApi;
