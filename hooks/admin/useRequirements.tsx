import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { requirementService } from '@/service/admin/requirements';
import { 
  Requirement, 
  RequirementFilters, 
  CreateRequirementRequest, 
  UpdateRequirementRequest 
} from '@/interfaces/Requirement';
import { PaginatedResponse } from '@/interfaces/Pagination';

export const useRequirements = (filters: RequirementFilters = {}) => {
  const [requirements, setRequirements] = useState<PaginatedResponse<Requirement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequirements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await requirementService.getRequirements(filters);
      setRequirements(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch requirements';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return {
    requirements,
    loading,
    error,
    refetch: fetchRequirements,
  };
};

export const useRequirement = (id: string | number) => {
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequirement = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await requirementService.getRequirement(id);
      setRequirement(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch requirement';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRequirement();
    }
  }, [fetchRequirement, id]);

  return {
    requirement,
    loading,
    error,
    refetch: fetchRequirement,
  };
};

export const useRequirementMutations = () => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const createRequirement = async (data: CreateRequirementRequest): Promise<boolean> => {
    try {
      setCreating(true);
      await requirementService.createRequirement(data);
      toast.success('Requirement created successfully');
      router.push('/admin/compliance-library/requirements');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create requirement';
      toast.error(errorMessage);
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateRequirement = async (id: string | number, data: UpdateRequirementRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      await requirementService.updateRequirement(id, data);
      toast.success('Requirement updated successfully');
      router.push('/admin/compliance-library/requirements');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update requirement';
      toast.error(errorMessage);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    creating,
    updating,
    createRequirement,
    updateRequirement,
  };
};
