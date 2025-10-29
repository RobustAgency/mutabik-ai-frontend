"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AiModelVersion, CreateAiModelVersionData, AiModelVersionFilters } from "@/service/app/aiModelVersions";
import {
    useGetAiModelVersionsQuery,
    useGetAiModelVersionQuery,
    useCreateAiModelVersionMutation,
    useUpdateAiModelVersionMutation,
    useDeleteAiModelVersionMutation,
} from "@/app/lib/features/aiModelVersionsApi";

export const useAiModelVersions = (filters?: AiModelVersionFilters) => {

    // RTK Query hooks
    const {
        data: aiModelVersions = [],
        isLoading: loading,
        error,
        refetch: refetchAiModelVersions,
    } = useGetAiModelVersionsQuery(filters);

    const [createAiModelVersionMutation, { isLoading: creating }] =
        useCreateAiModelVersionMutation();

    const [updateAiModelVersionMutation, { isLoading: updating }] =
        useUpdateAiModelVersionMutation();

    const [deleteAiModelVersionMutation, { isLoading: deleting }] =
        useDeleteAiModelVersionMutation();

    // Wrapper function to maintain backward compatibility
    const fetchAiModelVersions = useCallback(async (): Promise<AiModelVersion[]> => {
        const result = await refetchAiModelVersions();
        return result.data || [];
    }, [refetchAiModelVersions]);

    // Wrapper function to maintain backward compatibility
    const createAiModelVersion = useCallback(
        async (data: CreateAiModelVersionData): Promise<AiModelVersion> => {
            // Let the caller handle navigation and error display
            return await createAiModelVersionMutation(data).unwrap();
        },
        [createAiModelVersionMutation]
    );

    const updateAiModelVersion = useCallback(
        async (id: number, data: Partial<CreateAiModelVersionData>): Promise<AiModelVersion | null> => {
            try {
                const result = await updateAiModelVersionMutation({ id, data }).unwrap();
                return result;
            } catch (error) {
                // Error is already handled in RTK Query with toast notification
                return null;
            }
        },
        [updateAiModelVersionMutation]
    );

    const deleteAiModelVersion = useCallback(
        async (id: number): Promise<boolean> => {
            try {
                await deleteAiModelVersionMutation(id).unwrap();
                return true;
            } catch (error) {
                // Error is already handled in RTK Query with toast notification
                return false;
            }
        },
        [deleteAiModelVersionMutation]
    );

    return {
        aiModelVersions,
        currentAiModelVersion: null, // Not used in current components, can be added if needed
        loading: loading || creating || updating || deleting,
        error: error ? (error as any)?.data?.message || "An error occurred" : null,
        fetchAiModelVersions,
        createAiModelVersion,
        updateAiModelVersion,
        deleteAiModelVersion,
    };
};

export const useAiModelVersion = (id: number) => {
    const router = useRouter();

    // RTK Query hooks
    const {
        data: aiModelVersion,
        isLoading: loading,
        error,
        refetch: refetchAiModelVersion,
    } = useGetAiModelVersionQuery(id);

    const [updateAiModelVersionMutation, { isLoading: updating }] =
        useUpdateAiModelVersionMutation();

    const [deleteAiModelVersionMutation, { isLoading: deleting }] =
        useDeleteAiModelVersionMutation();

    // Wrapper function to maintain backward compatibility
    const fetchAiModelVersion = useCallback(async (): Promise<AiModelVersion | null> => {
        const result = await refetchAiModelVersion();
        return result.data || null;
    }, [refetchAiModelVersion]);

    const updateAiModelVersion = useCallback(
        async (data: Partial<CreateAiModelVersionData>): Promise<AiModelVersion | null> => {
            try {
                const result = await updateAiModelVersionMutation({ id, data }).unwrap();
                return result;
            } catch (error) {
                // Error is already handled in RTK Query with toast notification
                return null;
            }
        },
        [updateAiModelVersionMutation, id]
    );

    const deleteAiModelVersion = useCallback(
        async (): Promise<boolean> => {
            try {
                await deleteAiModelVersionMutation(id).unwrap();
                // Navigate after successful deletion
                router.push("/core-assets/ai-models/versions");
                return true;
            } catch (error) {
                // Error is already handled in RTK Query with toast notification
                return false;
            }
        },
        [deleteAiModelVersionMutation, router, id]
    );

    return {
        aiModelVersion,
        loading: loading || updating || deleting,
        error: error ? (error as any)?.data?.message || "An error occurred" : null,
        fetchAiModelVersion,
        updateAiModelVersion,
        deleteAiModelVersion,
    };
};
