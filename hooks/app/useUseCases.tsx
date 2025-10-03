"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  useCaseService,
  type UseCase,
  type CreateUseCaseData,
} from "@/service/app/useCases";


export const useUseCases = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [currentUseCase, setCurrentUseCase] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch all use cases
  const fetchUseCases = useCallback(async (): Promise<UseCase[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await useCaseService.getUseCases();

      if (!response.error && response.data) {
        setUseCases(response.data);
        return response.data;
      } else {
        const msg = response.message || "Failed to fetch use cases";
        setError(msg);
        toast.error(msg);
        return [];
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch use cases";
      setError(msg);
      toast.error(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Create a new use case
  const createUseCase = useCallback(
    async (data: CreateUseCaseData): Promise<UseCase | null> => {
      try {
        setLoading(true);
        setError(null);

        // Convert FormDataType to CreateUseCaseData
        const payload: CreateUseCaseData = {
          ...data,
          regulatory_scope: Array.isArray(data.regulatory_scope)
            ? data.regulatory_scope.filter((x) => x.trim() !== "")
            : [],
        };

        const response = await useCaseService.createUseCase(payload);

        if (!response.error && response.data) {
          setCurrentUseCase(response.data);
          toast.success("Use case created successfully");
          return response.data;
        } else {
          const msg = response.message || "Failed to create use case";
          setError(msg);
          toast.error(msg);
          return null;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create use case";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
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
