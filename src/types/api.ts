import type { QueryParameters } from '@/lib/api/http';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponseEnvelope<TData = unknown> {
  success: boolean;
  message?: string;
  data: TData;
  statusCode?: number;
}

export type ApiResponse<TData = unknown> = ApiResponseEnvelope<TData>;

export interface HttpRequestOptions<TPayload = unknown> {
  queryParams?: QueryParameters;
  payload?: TPayload;
  headers?: HeadersInit;
  cachePolicy?: RequestCache;
  nextRevalidation?: NextFetchRequestConfig;
  bearerToken?: string | null;
  requiresAuthentication?: boolean;
}
