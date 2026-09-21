'use client';

import { clientApi } from '@/lib/api/client';
import { CLIENT_API_ROUTES } from '@/constants/api-routes';
import { useMutation } from '@/hooks/use-mutation';
import type {
  LoginPayload,
  LoginResponseData,
  RegisterPayload,
  RegisterResponseData,
} from '@/types/auth';
import type { ApiResponseEnvelope } from '@/types/api';

/**
 * Direct async API call methods for client-side authentication.
 * Targets Next.js Route Handlers (/api/auth/...) rather than backend directly.
 */
export async function loginUser(credentials: LoginPayload) {
  return clientApi.post<ApiResponseEnvelope<LoginResponseData>, LoginPayload>(
    CLIENT_API_ROUTES.AUTH.LOGIN,
    credentials
  );
}

export async function registerUser(payload: RegisterPayload) {
  return clientApi.post<
    ApiResponseEnvelope<RegisterResponseData>,
    RegisterPayload
  >(CLIENT_API_ROUTES.AUTH.REGISTER, payload);
}

/**
 * Mutation hooks for React components
 */
export function useLoginMutation() {
  return useMutation((loginCredentials: LoginPayload) =>
    loginUser(loginCredentials)
  );
}

export function useRegisterMutation() {
  return useMutation((registrationData: RegisterPayload) =>
    registerUser(registrationData)
  );
}
