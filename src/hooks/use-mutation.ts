'use client';

import { useState, useCallback } from 'react';

export interface MutationLifecycleOptions<TResponse> {
  onSuccess?: (responseData: TResponse) => void;
  onError?: (mutationError: Error) => void;
  onSettled?: (
    responseData: TResponse | null,
    mutationError: Error | null
  ) => void;
}

export interface UseMutationResult<TResponse, TPayload> {
  mutate: (
    payload: TPayload,
    options?: MutationLifecycleOptions<TResponse>
  ) => void;
  mutateAsync: (
    payload: TPayload,
    options?: MutationLifecycleOptions<TResponse>
  ) => Promise<TResponse>;
  isLoading: boolean;
  error: Error | null;
  data: TResponse | null;
  reset: () => void;
}

export function useMutation<TResponse, TPayload>(
  mutationExecutor: (payload: TPayload) => Promise<TResponse>
): UseMutationResult<TResponse, TPayload> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  const mutateAsync = useCallback(
    async (
      payload: TPayload,
      options?: MutationLifecycleOptions<TResponse>
    ): Promise<TResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const responseData = await mutationExecutor(payload);
        setData(responseData);
        options?.onSuccess?.(responseData);
        options?.onSettled?.(responseData, null);
        return responseData;
      } catch (caughtError: unknown) {
        const normalizedError =
          caughtError instanceof Error
            ? caughtError
            : new Error('Mutation execution failed');
        setError(normalizedError);
        options?.onError?.(normalizedError);
        options?.onSettled?.(null, normalizedError);
        throw normalizedError;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationExecutor]
  );

  const mutate = useCallback(
    (
      payload: TPayload,
      options?: MutationLifecycleOptions<TResponse>
    ): void => {
      mutateAsync(payload, options).catch(() => {});
    },
    [mutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    isLoading,
    error,
    data,
    reset,
  };
}
