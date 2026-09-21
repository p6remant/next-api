import { buildUrlWithQueryParams } from './query-builder';
import type { HttpMethod, HttpRequestOptions } from '@/types/api';

export interface InterceptorConfiguration {
  headers?: HeadersInit;
  credentialsPolicy?: RequestCredentials;
}

export type RequestInterceptor = (
  options: HttpRequestOptions
) => Promise<InterceptorConfiguration> | InterceptorConfiguration;

export class HttpError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

async function parseJsonResponse<TResponse>(
  response: Response
): Promise<TResponse> {
  if (response.status === 204) {
    return {} as TResponse;
  }

  const parsedJson = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      (parsedJson as { message?: string })?.message ||
      `HTTP request failed with status code ${response.status}`;
    throw new HttpError(errorMessage, response.status, parsedJson);
  }

  return parsedJson as TResponse;
}

export function createHttpClient(
  targetBaseUrl: string,
  interceptor?: RequestInterceptor
) {
  const executeRequest = async <TResponse, TPayload = unknown>(
    endpointPath: string,
    httpMethod: HttpMethod,
    requestOptions: HttpRequestOptions<TPayload> = {}
  ): Promise<TResponse> => {
    const {
      queryParams,
      payload,
      headers: customHeaders,
      cachePolicy,
      nextRevalidation,
    } = requestOptions;

    const targetUrl = buildUrlWithQueryParams(
      targetBaseUrl,
      endpointPath,
      queryParams
    );
    const interceptorResult = interceptor
      ? await interceptor(requestOptions)
      : {};
    const finalHeaders = new Headers(interceptorResult.headers);

    if (customHeaders) {
      new Headers(customHeaders).forEach((headerValue, headerKey) => {
        finalHeaders.set(headerKey, headerValue);
      });
    }

    if (payload && !(payload instanceof FormData)) {
      finalHeaders.set('Content-Type', 'application/json');
    }
    finalHeaders.set('Accept', 'application/json');

    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers: finalHeaders,
      cache: cachePolicy,
      next: nextRevalidation,
      credentials: interceptorResult.credentialsPolicy,
      body:
        payload instanceof FormData
          ? payload
          : payload !== undefined
            ? JSON.stringify(payload)
            : undefined,
    });

    return parseJsonResponse<TResponse>(response);
  };

  return {
    get: <TResponse>(
      endpointPath: string,
      options?: Omit<HttpRequestOptions<never>, 'payload'>
    ) => executeRequest<TResponse>(endpointPath, 'GET', options),

    post: <TResponse, TPayload = unknown>(
      endpointPath: string,
      payload?: TPayload,
      options?: Omit<HttpRequestOptions<TPayload>, 'payload'>
    ) =>
      executeRequest<TResponse, TPayload>(endpointPath, 'POST', {
        ...options,
        payload,
      }),

    put: <TResponse, TPayload = unknown>(
      endpointPath: string,
      payload?: TPayload,
      options?: Omit<HttpRequestOptions<TPayload>, 'payload'>
    ) =>
      executeRequest<TResponse, TPayload>(endpointPath, 'PUT', {
        ...options,
        payload,
      }),

    patch: <TResponse, TPayload = unknown>(
      endpointPath: string,
      payload?: TPayload,
      options?: Omit<HttpRequestOptions<TPayload>, 'payload'>
    ) =>
      executeRequest<TResponse, TPayload>(endpointPath, 'PATCH', {
        ...options,
        payload,
      }),

    delete: <TResponse>(
      endpointPath: string,
      options?: Omit<HttpRequestOptions<never>, 'payload'>
    ) => executeRequest<TResponse>(endpointPath, 'DELETE', options),
  };
}
