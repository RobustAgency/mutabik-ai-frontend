import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetRegulatorySubmissionsQuery,
  useGetRegulatorySubmissionQuery,
  useCreateRegulatorySubmissionMutation,
  useUpdateRegulatorySubmissionMutation,
  useDeleteRegulatorySubmissionMutation,
} from "@/app/lib/features/regulatorySubmissionsApi";
import {
  RegulatorySubmission,
  RegulatorySubmissionFilters,
  CreateRegulatorySubmissionRequest,
  UpdateRegulatorySubmissionRequest,
} from "@/interfaces/RegulatorySubmission";

export interface UseRegulatorySubmissionsResult {
  regulatorySubmissions: RegulatorySubmission[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refresh: () => Promise<any>;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
}

export const useRegulatorySubmissions = (
  initialFilters: RegulatorySubmissionFilters = {}
): UseRegulatorySubmissionsResult => {
  const [filters, setFilters] = useState<RegulatorySubmissionFilters>(initialFilters);
  const { data, isLoading, isError, error, refetch } = useGetRegulatorySubmissionsQuery(filters);

  const refresh = async () => {
    await refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...(prev || {}), page }));
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...(prev || {}), authority: search || undefined, page: 1 }));
  };

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === "object" && "data" in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return "Failed to load regulatory submissions";
  }, [error, isError]);

  return {
    regulatorySubmissions: data?.data || [],
    loading: isLoading,
    error: errorMessage,
    pagination: {
      page: data?.meta?.current_page ?? 1,
      limit: data?.meta?.per_page ?? filters?.per_page ?? 10,
      total: data?.meta?.total ?? 0,
      totalPages: data?.meta?.last_page ?? 0,
    },
    refresh,
    handlePageChange,
    handleSearch,
  };
};

export const useRegulatorySubmission = (id?: string | number) => {
  const [submissionId, setSubmissionId] = useState<string | number | undefined>(id);

  const { data, isLoading, isError, error, refetch } = useGetRegulatorySubmissionQuery(
    submissionId as string | number,
    {
      skip: !submissionId,
    }
  );

  useEffect(() => {
    if (id) setSubmissionId(id);
  }, [id]);

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === "object" && "data" in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return "Failed to load regulatory submission";
  }, [error, isError]);

  return {
    regulatorySubmission: data ?? null,
    loading: isLoading,
    error: errorMessage,
    loadRegulatorySubmission: async (rsId: string | number) => {
      setSubmissionId(rsId);
      await refetch();
    },
    refetch,
  };
};

export const useRegulatorySubmissionMutations = () => {
  const [createMutation, { isLoading: creating }] = useCreateRegulatorySubmissionMutation();
  const [updateMutation, { isLoading: updating }] = useUpdateRegulatorySubmissionMutation();
  const [deleteMutation, { isLoading: deleting }] = useDeleteRegulatorySubmissionMutation();
  const router = useRouter();

  const createRegulatorySubmission = async (data: CreateRegulatorySubmissionRequest): Promise<boolean> => {
    try {
      await createMutation(data).unwrap();
      toast.success("Regulatory submission created successfully");
      router.push("/admin/compliance-library/regulatory-submissions");
      return true;
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || (err instanceof Error ? err.message : "Failed to create regulatory submission");
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateRegulatorySubmission = async (
    id: string | number,
    data: UpdateRegulatorySubmissionRequest
  ): Promise<boolean> => {
    try {
      await updateMutation({ id, data }).unwrap();
      toast.success("Regulatory submission updated successfully");
      router.push("/admin/compliance-library/regulatory-submissions");
      return true;
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || (err instanceof Error ? err.message : "Failed to update regulatory submission");
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteRegulatorySubmission = async (id: string | number): Promise<boolean> => {
    try {
      await deleteMutation(id).unwrap();
      toast.success("Regulatory submission deleted successfully");
      return true;
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || (err instanceof Error ? err.message : "Failed to delete regulatory submission");
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    creating,
    updating,
    deleting,
    createRegulatorySubmission,
    updateRegulatorySubmission,
    deleteRegulatorySubmission,
  };
};

