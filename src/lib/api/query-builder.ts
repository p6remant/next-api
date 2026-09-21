export type QueryParameters = Record<
  string,
  string | number | boolean | undefined | null
>;

/**
 * Builds a clean, normalized URL string by appending serialized query parameters.
 */
export function buildUrlWithQueryParams(
  baseUrl: string,
  endpointPath: string,
  queryParameters?: QueryParameters
): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedEndpointPath = endpointPath.startsWith('/')
    ? endpointPath
    : `/${endpointPath}`;

  let targetUrl = normalizedBaseUrl
    ? `${normalizedBaseUrl}${normalizedEndpointPath}`
    : normalizedEndpointPath;

  if (queryParameters) {
    const searchParams = new URLSearchParams();

    for (const [parameterKey, parameterValue] of Object.entries(
      queryParameters
    )) {
      if (parameterValue !== undefined && parameterValue !== null) {
        searchParams.append(parameterKey, String(parameterValue));
      }
    }

    const serializedQueryParams = searchParams.toString();
    if (serializedQueryParams) {
      const separator = targetUrl.includes('?') ? '&' : '?';
      targetUrl += `${separator}${serializedQueryParams}`;
    }
  }

  return targetUrl;
}
