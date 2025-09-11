"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { frameworkService } from '@/service/admin/frameworks';
import { requirementService } from '@/service/admin/requirements';
import { Framework } from '@/interfaces/Framework';
import { Requirement, RequirementFilters } from '@/interfaces/Requirement';

export interface FrameworkWithRequirements extends Framework {
  requirements: Requirement[];
}

export interface UseFrameworkRequirementsResult {
  framework: FrameworkWithRequirements | null;
  loading: boolean;
  error: string | null;
  loadFrameworkRequirements: (id: string | number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFrameworkRequirements(id?: string | number): UseFrameworkRequirementsResult {
  const [framework, setFramework] = useState<FrameworkWithRequirements | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFrameworkRequirements = async (frameworkId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load framework and requirements in parallel
      const [frameworkResponse, requirementsResponse] = await Promise.all([
        frameworkService.getFramework(frameworkId),
        requirementService.getRequirements({ 
          framework_id: frameworkId,
          per_page: 1000 // Get all requirements for this framework
        } as RequirementFilters)
      ]);
      
      if (frameworkResponse.error) {
        throw new Error(frameworkResponse.message);
      }

      if (requirementsResponse.error) {
        throw new Error(requirementsResponse.message);
      }

      const frameworkWithRequirements: FrameworkWithRequirements = {
        ...frameworkResponse.data,
        requirements: requirementsResponse.data.data || []
      };

      setFramework(frameworkWithRequirements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load framework with requirements';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (id) {
      return loadFrameworkRequirements(id);
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (id) {
      loadFrameworkRequirements(id);
    }
  }, [id]);

  return {
    framework,
    loading,
    error,
    loadFrameworkRequirements,
    refresh,
  };
}
