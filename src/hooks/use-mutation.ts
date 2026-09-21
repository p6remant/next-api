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
  isExecuting: boolean;
  executionError: Error | null;
  executionData: TResponse | null;
  resetMutationState: () => void;
}

export function useMutation<TResponse, TPayload>(
  mutationExecutor: (payload: TPayload) => Promise<TResponse>
): UseMutationResult<TResponse, TPayload> {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<Error | null>(null);
  const [executionData, setExecutionData] = useState<TResponse | null>(null);

  const resetMutationState = useCallback(() => {
    setIsExecuting(false);
    setExecutionError(null);
    setExecutionData(null);
  }, []);

  const mutateAsync = useCallback(
    async (
      payload: TPayload,
      options?: MutationLifecycleOptions<TResponse>
    ): Promise<TResponse> => {
      setIsExecuting(true);
      setExecutionError(null);

      try {
        const responseData = await mutationExecutor(payload);
        setExecutionData(responseData);
        options?.onSuccess?.(responseData);
        options?.onSettled?.(responseData, null);
        return responseData;
      } catch (error: unknown) {
        const normalizedError =
          error instanceof Error
            ? error
            : new Error('Mutation execution failed');
        setExecutionError(normalizedError);
        options?.onError?.(normalizedError);
        options?.onSettled?.(null, normalizedError);
        throw normalizedError;
      } finally {
        setIsExecuting(false);
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
    isExecuting,
    executionError,
    executionData,
    resetMutationState,
  };
}
