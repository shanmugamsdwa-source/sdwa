'use client';

import { useState, useCallback } from 'react';

// ─── Firestore Mutation Hook ────────────────────────────────────────────────
// Replaces useApiMutation — calls Firestore directly instead of going through
// API routes. Provides the same loading/error/success state pattern.

interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface MutationOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for performing Firestore mutations with loading/error state.
 * 
 * Usage:
 * ```ts
 * const { mutate, loading, error } = useFirestoreMutation(
 *   async (data: CommitteeMember) => {
 *     return await createDocument('committeeMembers', data);
 *   },
 *   { onSuccess: () => toast.success('Created!') }
 * );
 * ```
 */
export function useFirestoreMutation<TInput = unknown, TOutput = unknown>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  options?: MutationOptions
) {
  const [state, setState] = useState<MutationState<TOutput>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (input: TInput) => {
      try {
        setState({ data: null, loading: true, error: null });
        const data = await mutationFn(input);
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (err: unknown) {
        let message = 'Operation failed';
        const errObj = err as { code?: string; message?: string } | undefined;

        if (errObj?.code === 'permission-denied') {
          message = 'Permission denied. You may not have admin access.';
        } else if (errObj?.code === 'not-found') {
          message = 'The requested item was not found.';
        } else if (errObj?.code === 'unavailable') {
          message = 'Service temporarily unavailable. Please try again.';
        } else if (errObj?.code === 'unauthenticated') {
          message = 'Authentication required. Please log in again.';
        } else if (err instanceof Error) {
          message = err.message;
        }

        setState({ data: null, loading: false, error: message });
        options?.onError?.(message);
        throw err;
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}
