"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  RecordOfProcessingActivity,
  CreateROPAData,
  ROPAFilters,
} from "@/interfaces/RecordOfProcessingActivity";
import {
  useGetRecordOfProcessingActivitiesQuery,
  useCreateRecordOfProcessingActivityMutation,
} from "@/app/lib/features/recordOfProcessingActivitiesApi";

export const useRecordOfProcessingActivities = (filters?: ROPAFilters) => {
  const router = useRouter();

  // RTK Query hooks
  const {
    data: response,
    isLoading: loading,
    error,
    refetch: refetchROPA,
  } = useGetRecordOfProcessingActivitiesQuery(filters);

  const [createROPAMutation, { isLoading: creating }] =
    useCreateRecordOfProcessingActivityMutation();

  const activities = response?.data ?? [];
  const pagination = response?.pagination;

  // Wrapper function to maintain backward compatibility
  const fetchActivities = useCallback(async (): Promise<
    RecordOfProcessingActivity[]
  > => {
    const result = await refetchROPA();
    return result.data?.data || [];
  }, [refetchROPA]);

  // Wrapper function to maintain backward compatibility
  const createActivity = useCallback(
    async (data: CreateROPAData): Promise<RecordOfProcessingActivity | null> => {
      try {
        const result = await createROPAMutation(data).unwrap();
        // Navigate after successful creation
        router.push("/privacy/ropa");
        return result;
      } catch (error) {
        // Error is already handled in RTK Query with toast notification
        return null;
      }
    },
    [createROPAMutation, router]
  );

  return {
    activities,
    pagination,
    loading: loading || creating,
    error: error ? (error as any)?.data?.message || "An error occurred" : null,
    fetchActivities,
    createActivity,
  };
};

