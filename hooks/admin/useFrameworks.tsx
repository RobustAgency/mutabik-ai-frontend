import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { frameworkService } from '@/service/admin/frameworks';
import { 
  Framework, 
  FrameworkFilters, 
  CreateFrameworkRequest, 
  UpdateFrameworkRequest 
} from '@/interfaces/Framework';

export interface UseFrameworksResult {
  frameworks: Framework[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
  refresh: () => Promise<void>;
  loadFrameworks: (filters?: FrameworkFilters) => Promise<void>;
}

export function useFrameworks(initialFilters?: FrameworkFilters): UseFrameworksResult {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadFrameworks = async (filters: FrameworkFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await frameworkService.getFrameworks(filters);
      
      if (response.error) {
        throw new Error(response.message);
      }

      setFrameworks(response.data.data);
      setTotalPages(response.data.last_page);
      setCurrentPage(response.data.current_page);
      setTotal(response.data.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load frameworks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadFrameworks(initialFilters);

  useEffect(() => {
    loadFrameworks(initialFilters);
  }, []);

  return {
    frameworks,
    loading,
    error,
    totalPages,
    currentPage,
    total,
    refresh,
    loadFrameworks,
  };
}

export interface UseFrameworkResult {
  framework: Framework | null;
  loading: boolean;
  error: string | null;
  loadFramework: (id: string | number) => Promise<void>;
}

export function useFramework(id?: string | number): UseFrameworkResult {
  const [framework, setFramework] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFramework = async (frameworkId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await frameworkService.getFramework(frameworkId);
      
      if (response.error) {
        throw new Error(response.message);
      }

      setFramework(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load framework';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadFramework(id);
    }
  }, [id]);

  return {
    framework,
    loading,
    error,
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
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const createFramework = async (data: CreateFrameworkRequest): Promise<boolean> => {
    try {
      setCreating(true);
      
      const response = await frameworkService.createFramework(data);
      
      if (response.error) {
        throw new Error(response.message);
      }

      toast.success('Framework created successfully');
      router.push('/admin/compliance-library/frameworks');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create framework';
      toast.error(errorMessage);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateFramework = async (id: string | number, data: UpdateFrameworkRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      
      const response = await frameworkService.updateFramework(id, data);
      
      if (response.error) {
        throw new Error(response.message);
      }

      toast.success('Framework updated successfully');
      router.push('/admin/compliance-library/frameworks');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update framework';
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    creating,
    updating,
    createFramework,
    updateFramework,
  };
}
