import { createHttpClient } from './root-http';

/**
 * Browser-side HTTP client.
 * Calls Next.js route handlers (/api/...) directly from the client.
 * Ensures credentials (cookies) are included for all requests.
 */
export const clientApi = createHttpClient('', () => ({
  credentialsPolicy: 'include',
}));

export default clientApi;
