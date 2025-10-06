"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  useCaseService,
  type UseCase,
  type CreateUseCaseData,
} from "@/service/app/useCases";
import { useRouter } from "next/navigation";

export const useUseCases = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [currentUseCase, setCurrentUseCase] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUseCases = useCallback(async (): Promise<UseCase[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await useCaseService.getUseCases();
      console.log("data", response.data);
      if (!response.error && response.data?.data) {
        setUseCases(response.data.data); // ✅ nested data
        return response.data.data;
      } else {
        const msg = response.message || "Failed to fetch use cases";
        setError(msg);
        toast.error(msg);
        return [];
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch use cases";
      setError(msg);
      toast.error(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createUseCase = useCallback(
    async (data: CreateUseCaseData): Promise<UseCase | null> => {
      try {
        setLoading(true);
        setError(null);
        const payload: CreateUseCaseData = {
          ...data,
          regulatory_scope: Array.isArray(data.regulatory_scope)
            ? data.regulatory_scope.filter((x) => x.trim() !== "")
            : [],
        };

        const response = await useCaseService.createUseCase(payload);
        console.log("response", response);

        if (!response.error) {
          setCurrentUseCase(response.data);
          toast.success("Use case created successfully");
          router.push("/projects/setup/use-cases");
          return response.data;
        } else {
          const msg = "Failed to create use case";
          // setError(msg);
          toast.error(msg);
          return null;
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to create use case";
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
