import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  useCreateFrameworkMutation,
  useGetFrameworkQuery,
  useGetFrameworksQuery,
  useUpdateFrameworkMutation,
} from '@/app/lib/features/frameworksApi';
import {
  Framework,
  FrameworkFilters,
  CreateFrameworkRequest,
  UpdateFrameworkRequest,
} from '@/interfaces/Framework';

export interface UseFrameworksResult {
  frameworks: Framework[];
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
  loadFrameworks: (filters?: FrameworkFilters) => Promise<void>;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
}

export function useFrameworks(initialFilters?: FrameworkFilters): UseFrameworksResult {
  const [filters, setFilters] = useState<FrameworkFilters>(initialFilters || {});

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFrameworksQuery(filters);

  const loadFrameworks = async (nextFilters: FrameworkFilters = {}) => {
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
    return 'Failed to load frameworks';
  }, [error, isError]);

  return {
    frameworks: data?.data || [],
    loading: isLoading,
    error: errorMessage,
    totalPages: data?.meta?.last_page ?? 0,
    currentPage: data?.meta?.current_page ?? 1,
    total: data?.meta?.total ?? 0,
    pagination: {
      page: data?.meta?.current_page ?? 1,
      limit: data?.meta?.per_page ?? filters?.per_page ?? 10,
      total: data?.meta?.total ?? 0,
      totalPages: data?.meta?.last_page ?? 0,
    },
    refresh,
    loadFrameworks,
    handlePageChange,
    handleSearch,
  };
}

export interface UseFrameworkResult {
  framework: Framework | null;
  loading: boolean;
  error: string | null;
  loadFramework: (id: string | number) => Promise<void>;
}

export function useFramework(id?: string | number): UseFrameworkResult {
  const [frameworkId, setFrameworkId] = useState<string | number | undefined>(id);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFrameworkQuery(frameworkId as string | number, {
    skip: !frameworkId,
  });

  const loadFramework = async (frameworkIdValue: string | number) => {
    setFrameworkId(frameworkIdValue);
    await refetch();
  };

  useEffect(() => {
    if (id) {
      setFrameworkId(id);
    }
  }, [id]);

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    if (error && typeof error === 'object' && 'data' in error) {
      const maybeMessage = (error as any)?.data?.message;
      if (maybeMessage) return String(maybeMessage);
    }
    return 'Failed to load framework';
  }, [error, isError]);

  return {
    framework: data ?? null,
    loading: isLoading,
    error: errorMessage,
    loadFramework,
  };
}

export interface UseFrameworkMutationsResult {
  creating: boolean;
  updating: boolean;
  createFramework: (data: CreateFrameworkRequest) => Promise<boolean>;
  updateFramework: (id: string | number, data: UpdateFrameworkRequest) => Promise<boolean>;
}

export function useFrameworkMutations(): UseFrameworkMutationsResult {
  const [createFrameworkMutation, { isLoading: creating }] = useCreateFrameworkMutation();
  const [updateFrameworkMutation, { isLoading: updating }] = useUpdateFrameworkMutation();
  const router = useRouter();

  const createFramework = async (data: CreateFrameworkRequest): Promise<boolean> => {
    try {
      await createFrameworkMutation(data).unwrap();
      toast.success('Framework created successfully');
      router.push('/admin/compliance-library/frameworks');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create framework';
      toast.error(errorMessage);
      return false;
    }
  };

  const updateFramework = async (id: string | number, data: UpdateFrameworkRequest): Promise<boolean> => {
    try {
      await updateFrameworkMutation({ id, data }).unwrap();
      toast.success('Framework updated successfully');
      router.push('/admin/compliance-library/frameworks');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update framework';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    creating,
    updating,
    createFramework,
    updateFramework,
  };
}
