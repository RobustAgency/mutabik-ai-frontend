"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  type UseCase,
  type CreateUseCaseData,
} from "@/service/app/useCases";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  fetchUseCases as fetchUseCasesAction,
  createUseCase as createUseCaseAction,
} from "@/app/lib/features/useCasesSlice";

export const useUseCases = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Selectors
  const useCases = useAppSelector((state) => state.useCases.useCases);
  const currentUseCase = useAppSelector(
    (state) => state.useCases.currentUseCase
  );
  const loading = useAppSelector((state) => state.useCases.loading);
  const error = useAppSelector((state) => state.useCases.error);

  const fetchUseCases = useCallback(async (): Promise<UseCase[]> => {
    const result = await dispatch(fetchUseCasesAction());
    if (fetchUseCasesAction.fulfilled.match(result)) {
      return result.payload as UseCase[];
    }
    return [];
  }, [dispatch]);

  const createUseCase = useCallback(
    async (data: CreateUseCaseData): Promise<UseCase | null> => {
      const result = await dispatch(createUseCaseAction(data));
      if (createUseCaseAction.fulfilled.match(result)) {
        // Navigate after successful creation
        router.push("/core-assets/ai-use-cases");
        return result.payload as UseCase;
      }
      return null;
    },
    [dispatch, router]
  );

  return {
    useCases,
    currentUseCase,
    loading,
    error,
    fetchUseCases,
    createUseCase,
  };
};
