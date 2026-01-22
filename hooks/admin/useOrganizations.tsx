import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  useCreateOrganizationMutation,
  useGetOrganizationQuery,
  useGetOrganizationsQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '@/app/lib/features/organizationsApi';
import {
  Organization,
  OrganizationFilters,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
} from '@/interfaces/Organization';

export interface UseOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refresh: () => Promise<void>;
  loadOrganizations: (filters?: OrganizationFilters) => Promise<void>;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
}

export function useOrganizations(initialFilters?: OrganizationFilters): UseOrganizationsResult {
  const [filters, setFilters] = useState<OrganizationFilters>(initialFilters || {});

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrganizationsQuery(filters);

  const loadOrganizations = async (nextFilters: OrganizationFilters = {}) => {
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
    return 'Failed to load organizations';
  }, [error, isError]);

  return {
    organizations: data?.data || [],
    loading: isLoading,
    error: errorMessage,
    totalPages: data?.pagination?.last_page ?? 0,
    currentPage: data?.pagination?.current_page ?? 1,
    total: data?.pagination?.total ?? 0,
    pagination: {
      page: data?.pagination?.current_page ?? 1,
      limit: data?.pagination?.per_page ?? filters?.per_page ?? 10,
      total: data?.pagination?.total ?? 0,
      totalPages: data?.pagination?.last_page ?? 0,
    },
    refresh,
    loadOrganizations,
    handlePageChange,
    handleSearch,
  };
}

export interface UseOrganizationResult {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  loadOrganization: (id: string | number) => Promise<void>;
}

export function useOrganization(id?: string | number): UseOrganizationResult {
  const [organizationId, setOrganizationId] = useState<string | number | undefined>(id);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrganizationQuery(organizationId as string | number, {
    skip: !organizationId,
  });

  const loadOrganization = async (organizationIdValue: string | number) => {
    setOrganizationId(organizationIdValue);
    await refetch();
  };

  useEffect(() => {
    if (id) {
      setOrganizationId(id);
    }
  }, [id]);

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === 'object' && 'data' in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return 'Failed to load organization';
  }, [error, isError]);

  return {
    organization: data ?? null,
    loading: isLoading,
    error: errorMessage,
    loadOrganization,
  };
}

export interface UseOrganizationMutationsResult {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  createOrganization: (data: CreateOrganizationRequest) => Promise<boolean>;
  updateOrganization: (id: string | number, data: UpdateOrganizationRequest) => Promise<boolean>;
  deleteOrganization: (id: string | number) => Promise<boolean>;
}

export function useOrganizationMutations(): UseOrganizationMutationsResult {
  const [createOrganizationMutation, { isLoading: creating }] = useCreateOrganizationMutation();
  const [updateOrganizationMutation, { isLoading: updating }] = useUpdateOrganizationMutation();
  const [deleteOrganizationMutation, { isLoading: deleting }] = useDeleteOrganizationMutation();
  const router = useRouter();

  const createOrganization = async (data: CreateOrganizationRequest): Promise<boolean> => {
    try {
      await createOrganizationMutation(data).unwrap();
      toast.success('Organization created successfully');
      router.push('/admin/organizations');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organization';
      toast.error(errorMessage);
      return false;
    }
  };

  const updateOrganization = async (id: string | number, data: UpdateOrganizationRequest): Promise<boolean> => {
    try {
      await updateOrganizationMutation({ id, data }).unwrap();
      toast.success('Organization updated successfully');
      router.push('/admin/organizations');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update organization';
      toast.error(errorMessage);
      return false;
    }
  };

  const deleteOrganization = async (id: string | number): Promise<boolean> => {
    try {
      await deleteOrganizationMutation(id).unwrap();
      toast.success('Organization deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete organization';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    creating,
    updating,
    deleting,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
