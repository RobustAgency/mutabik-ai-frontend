import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  useGetRequirementsQuery,
  useGetRequirementQuery,
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
} from '@/app/lib/features/requirementsApi';
import {
  Requirement,
  RequirementFilters,
  CreateRequirementRequest,
  UpdateRequirementRequest,
} from '@/interfaces/Requirement';

export interface UseRequirementsResult {
  requirements: Requirement[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refresh: () => Promise<void>;
  loadRequirements: (filters?: RequirementFilters) => Promise<void>;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
}

export const useRequirements = (initialFilters: RequirementFilters = {}): UseRequirementsResult => {
  const [filters, setFilters] = useState<RequirementFilters>(initialFilters);

  const { data, isLoading, isError, error, refetch } = useGetRequirementsQuery(filters);

  const loadRequirements = async (nextFilters: RequirementFilters = {}) => {
    setFilters(nextFilters);
  };

  const refresh = async () => {
    await refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...(prev || {}), page }));
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...(prev || {}), search, page: 1 }));
  };

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === 'object' && 'data' in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return 'Failed to load requirements';
  }, [error, isError]);

  return {
    requirements: data?.data || [],
    loading: isLoading,
    error: errorMessage,
    pagination: {
      page: data?.meta?.current_page ?? 1,
      limit: data?.meta?.per_page ?? filters?.per_page ?? 10,
      total: data?.meta?.total ?? 0,
      totalPages: data?.meta?.last_page ?? 0,
    },
    refresh,
    loadRequirements,
    handlePageChange,
    handleSearch,
  };
};

export const useRequirement = (id?: string | number) => {
  const [requirementId, setRequirementId] = useState<string | number | undefined>(id);

  const { data, isLoading, isError, error, refetch } = useGetRequirementQuery(requirementId as string | number, {
    skip: !requirementId,
  });

  useEffect(() => {
    if (id) setRequirementId(id);
  }, [id]);

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === 'object' && 'data' in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return 'Failed to load requirement';
  }, [error, isError]);

  return {
    requirement: data ?? null,
    loading: isLoading,
    error: errorMessage,
    loadRequirement: async (reqId: string | number) => {
      setRequirementId(reqId);
      await refetch();
    },
    refetch,
  };
};

export const useRequirementMutations = () => {
  const [createRequirementMutation, { isLoading: creating }] = useCreateRequirementMutation();
  const [updateRequirementMutation, { isLoading: updating }] = useUpdateRequirementMutation();
  const router = useRouter();

  const createRequirement = async (data: CreateRequirementRequest): Promise<boolean> => {
    try {
      await createRequirementMutation(data).unwrap();
      toast.success('Requirement created successfully');
      router.push('/admin/compliance-library/requirements');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to create requirement');
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateRequirement = async (id: string | number, data: UpdateRequirementRequest): Promise<boolean> => {
    try {
      await updateRequirementMutation({ id, data }).unwrap();
      toast.success('Requirement updated successfully');
      router.push('/admin/compliance-library/requirements');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to update requirement');
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    creating,
    updating,
    createRequirement,
    updateRequirement,
  };
};
