"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UseCase, CreateUseCaseData } from "@/service/app/useCases";
import {
  useGetUseCasesQuery,
  useCreateUseCaseMutation,
  type UseCaseFilters,
} from "@/app/lib/features/useCasesApi";

export const useUseCases = (filters?: UseCaseFilters) => {
  const router = useRouter();

  // RTK Query hooks
  const {
    data: useCases = [],
    isLoading: loading,
    error,
    refetch: refetchUseCases,
  } = useGetUseCasesQuery(filters);

  const [createUseCaseMutation, { isLoading: creating }] =
    useCreateUseCaseMutation();

  // Wrapper function to maintain backward compatibility
  const fetchUseCases = useCallback(async (): Promise<UseCase[]> => {
    const result = await refetchUseCases();
    return result.data || [];
  }, [refetchUseCases]);

  // Wrapper function to maintain backward compatibility
  const createUseCase = useCallback(
    async (data: CreateUseCaseData): Promise<UseCase | null> => {
      try {
        const result = await createUseCaseMutation(data).unwrap();
        // Navigate after successful creation
        router.push("/core-assets/ai-use-cases");
        return result;
      } catch (error) {
        // Error is already handled in RTK Query with toast notification
        return null;
      }
    },
    [createUseCaseMutation, router]
  );

  return {
    useCases,
    currentUseCase: null, // Not used in current components, can be added if needed
    loading: loading || creating,
    error: error ? (error as any)?.data?.message || "An error occurred" : null,
    fetchUseCases,
    createUseCase,
  };
};
