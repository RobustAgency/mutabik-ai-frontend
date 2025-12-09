"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AiModel, CreateAiModelData } from "@/service/app/aiModels";
import {
    useGetAiModelsQuery,
    useCreateAiModelMutation,
    type AiModelFilters,
} from "@/app/lib/features/aiModelsApi";

export const useAiModels = (filters?: AiModelFilters) => {
    const router = useRouter();

    // RTK Query hooks
    const {
        data: aiModels = [],
        isLoading: loading,
        error,
        refetch: refetchAiModels,
    } = useGetAiModelsQuery(filters);

    const [createAiModelMutation, { isLoading: creating }] =
        useCreateAiModelMutation();

    // Wrapper function to maintain backward compatibility
    const fetchAiModels = useCallback(async (): Promise<AiModel[]> => {
        const result = await refetchAiModels();
        return result.data || [];
    }, [refetchAiModels]);

    // Wrapper function to maintain backward compatibility
    const createAiModel = useCallback(
        async (data: CreateAiModelData): Promise<AiModel | null> => {
            try {
                const result = await createAiModelMutation(data).unwrap();
                // Navigate after successful creation
                router.push("/core-assets/ai-models");
                return result;
            } catch (error) {
                // Error is already handled in RTK Query with toast notification
                return null;
            }
        },
        [createAiModelMutation, router]
    );

    return {
        aiModels,
        currentAiModel: null, // Not used in current components, can be added if needed
        loading: loading || creating,
        error: error ? (error as any)?.data?.message || "An error occurred" : null,
        fetchAiModels,
        createAiModel,
    };
};
