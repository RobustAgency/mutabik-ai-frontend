"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { controlsService } from '@/service/admin/controls';
import { 
  Control, 
  ControlFilters, 
  CreateControlRequest, 
  UpdateControlRequest 
} from '@/interfaces/Control';

export interface UseControlsResult {
  controls: Control[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refresh: () => Promise<void>;
  loadControls: (filters?: ControlFilters) => Promise<void>;
  handlePageChange: (page: number) => void;
  handleSearch: (search: string) => void;
}

export function useControls(initialFilters?: ControlFilters): UseControlsResult {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const currentParamsRef = useRef<ControlFilters>(initialFilters || {});
  const loadingRef = useRef(false);

  const loadControls = useCallback(async (fetchParams?: ControlFilters) => {
    if (loadingRef.current) return;

    setLoading(true);
    loadingRef.current = true;
    try {
      const params = fetchParams || currentParamsRef.current;
      const response = await controlsService.getControls({
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search,
        framework_ids: params.framework_ids,
        requirement_ids: params.requirement_ids,
        tag_ids: params.tag_ids
      });

      if (response.error) {
        throw new Error(response.message);
      }

      setControls(response.data.data);
      setPagination({
        page: response.data.current_page,
        limit: response.data.per_page,
        total: response.data.total,
        totalPages: response.data.last_page
      });

      currentParamsRef.current = params;
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load controls';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const handlePageChange = (page: number) => {
    const newParams = { ...currentParamsRef.current, page };
    loadControls(newParams);
  };

  const handleSearch = (search: string) => {
    const newParams = { ...currentParamsRef.current, search, page: 1 };
    loadControls(newParams);
  };

  const refresh = () => loadControls(currentParamsRef.current);

  useEffect(() => {
    loadControls();
  }, [loadControls]);

  return {
    controls,
    loading,
    error,
    pagination,
    refresh,
    loadControls,
    handlePageChange,
    handleSearch,
  };
}

export interface UseControlResult {
  control: Control | null;
  loading: boolean;
  error: string | null;
  loadControl: (id: string | number) => Promise<void>;
}

export function useControl(id?: string | number): UseControlResult {
  const [control, setControl] = useState<Control | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadControl = async (controlId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await controlsService.getControl(controlId);
      
      if (response.error) {
        throw new Error(response.message);
      }

      setControl(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load control';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadControl(id);
    }
  }, [id]);

  return {
    control,
    loading,
    error,
    loadControl,
  };
}

export interface UseControlMutationsResult {
  creating: boolean;
  updating: boolean;
  createControl: (data: CreateControlRequest) => Promise<boolean>;
  updateControl: (id: string | number, data: UpdateControlRequest) => Promise<boolean>;
}

export function useControlMutations(): UseControlMutationsResult {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const createControl = async (data: CreateControlRequest): Promise<boolean> => {
    try {
      setCreating(true);
      
      const response = await controlsService.createControl(data);
      
      if (response.error) {
        throw new Error(response.message);
      }

      toast.success('Control created successfully');
      router.push('/admin/compliance-library/controls');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create control';
      toast.error(errorMessage);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateControl = async (id: string | number, data: UpdateControlRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      
      const response = await controlsService.updateControl(id, data);
      
      if (response.error) {
        throw new Error(response.message);
      }

      toast.success('Control updated successfully');
      router.push('/admin/compliance-library/controls');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update control';
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    creating,
    updating,
    createControl,
    updateControl,
  };
}
