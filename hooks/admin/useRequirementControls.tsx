import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  RequirementControl,
  RequirementControlFilters,
  CreateRequirementControlRequest,
  UpdateRequirementControlRequest,
} from '@/interfaces/RequirementControl';
import {
  useGetRequirementControlsQuery,
  useGetRequirementControlQuery,
  useCreateRequirementControlMutation,
  useUpdateRequirementControlMutation,
  useDeleteRequirementControlMutation,
} from '@/app/lib/features/requirementControlsApi';

export interface UseRequirementControlsResult {
  requirementControls: RequirementControl[];
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

export const useRequirementControls = (initialFilters?: RequirementControlFilters): UseRequirementControlsResult => {
  const [filters, setFilters] = useState<RequirementControlFilters>(initialFilters || { page: 1, per_page: 10 });
  const { data, isLoading, error, refetch } = useGetRequirementControlsQuery(filters);

  const requirementControls = data?.data || [];
  const pagination = data?.meta || { current_page: 1, per_page: 10, total: 0, last_page: 1 };

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  return {
    requirementControls,
    loading: isLoading,
    error: error ? (error as any)?.data?.message || "Failed to fetch requirement controls" : null,
    pagination: {
      page: pagination.current_page,
      limit: pagination.per_page,
      total: pagination.total,
      totalPages: pagination.last_page || pagination.current_page,
    },
    refresh: async () => refetch(),
    handlePageChange,
    handleSearch,
  };
};

export const useRequirementControl = (id?: string | number) => {
  const { data: requirementControl, isLoading, error, refetch } = useGetRequirementControlQuery(id as string, {
    skip: !id,
  });

  return {
    requirementControl,
    loading: isLoading,
    error: error ? (error as any)?.data?.message || "Failed to fetch requirement control" : null,
    refetch,
  };
};

export const useRequirementControlMutations = () => {
  const [createRequirementControlMutation, { isLoading: creating }] = useCreateRequirementControlMutation();
  const [updateRequirementControlMutation, { isLoading: updating }] = useUpdateRequirementControlMutation();
  const [deleteRequirementControlMutation, { isLoading: deleting }] = useDeleteRequirementControlMutation();
  const router = useRouter();

  const createRequirementControl = async (data: CreateRequirementControlRequest): Promise<boolean> => {
    try {
      await createRequirementControlMutation(data).unwrap();
      toast.success('Requirement control created successfully');
      router.push('/admin/compliance-library/requirement-controls');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to create requirement control');
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateRequirementControl = async (id: string | number, data: UpdateRequirementControlRequest): Promise<boolean> => {
    try {
      await updateRequirementControlMutation({ id, data }).unwrap();
      toast.success('Requirement control updated successfully');
      router.push('/admin/compliance-library/requirement-controls');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to update requirement control');
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteRequirementControl = async (id: string | number): Promise<boolean> => {
    try {
      await deleteRequirementControlMutation(id).unwrap();
      toast.success('Requirement control deleted successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to delete requirement control');
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    creating,
    updating,
    deleting,
    createRequirementControl,
    updateRequirementControl,
    deleteRequirementControl,
  };
};

