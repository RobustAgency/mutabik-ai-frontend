import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  useGetComplianceEvidencesQuery,
  useGetComplianceEvidenceQuery,
  useCreateComplianceEvidenceMutation,
  useUpdateComplianceEvidenceMutation,
  useDeleteComplianceEvidenceMutation,
} from '@/app/lib/features/complianceEvidenceApi';
import {
  ComplianceEvidence,
  ComplianceEvidenceFilters,
  CreateComplianceEvidenceRequest,
  UpdateComplianceEvidenceRequest,
} from '@/interfaces/ComplianceEvidence';

export interface UseComplianceEvidencesResult {
  complianceEvidences: ComplianceEvidence[];
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

export const useComplianceEvidences = (initialFilters: ComplianceEvidenceFilters = {}): UseComplianceEvidencesResult => {
  const [filters, setFilters] = useState<ComplianceEvidenceFilters>(initialFilters);
  const { data, isLoading, isError, error, refetch } = useGetComplianceEvidencesQuery(filters);

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
    return 'Failed to load compliance evidence';
  }, [error, isError]);

  return {
    complianceEvidences: data?.data || [],
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

export const useComplianceEvidence = (id?: string | number) => {
  const [complianceEvidenceId, setComplianceEvidenceId] = useState<string | number | undefined>(id);

  const { data, isLoading, isError, error, refetch } = useGetComplianceEvidenceQuery(complianceEvidenceId as string | number, {
    skip: !complianceEvidenceId,
  });

  useEffect(() => {
    if (id) setComplianceEvidenceId(id);
  }, [id]);

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === 'object' && 'data' in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return 'Failed to load compliance evidence';
  }, [error, isError]);

  return {
    complianceEvidence: data ?? null,
    loading: isLoading,
    error: errorMessage,
    loadComplianceEvidence: async (ceId: string | number) => {
      setComplianceEvidenceId(ceId);
      await refetch();
    },
    refetch,
  };
};

export const useComplianceEvidenceMutations = () => {
  const [createMutation, { isLoading: creating }] = useCreateComplianceEvidenceMutation();
  const [updateMutation, { isLoading: updating }] = useUpdateComplianceEvidenceMutation();
  const [deleteMutation, { isLoading: deleting }] = useDeleteComplianceEvidenceMutation();
  const router = useRouter();

  const createComplianceEvidence = async (data: CreateComplianceEvidenceRequest): Promise<boolean> => {
    try {
      await createMutation(data).unwrap();
      toast.success('Compliance evidence created successfully');
      router.push('/admin/compliance-library/compliance-evidences');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to create compliance evidence');
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateComplianceEvidence = async (id: string | number, data: UpdateComplianceEvidenceRequest): Promise<boolean> => {
    try {
      await updateMutation({ id, data }).unwrap();
      toast.success('Compliance evidence updated successfully');
      router.push('/admin/compliance-library/compliance-evidences');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to update compliance evidence');
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteComplianceEvidence = async (id: string | number): Promise<boolean> => {
    try {
      await deleteMutation(id).unwrap();
      toast.success('Compliance evidence deleted successfully');
      router.push('/admin/compliance-library/compliance-evidences');
      return true;
    } catch (err: any) {
      const errorMessage = err?.data?.message || (err instanceof Error ? err.message : 'Failed to delete compliance evidence');
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    creating,
    updating,
    deleting,
    createComplianceEvidence,
    updateComplianceEvidence,
    deleteComplianceEvidence,
  };
};

