import { useState, useCallback } from 'react';
import {
  projectService,
  type Project,
  type CreateProjectData,
  type AddMemberData,
  type AddFrameworksData,
  type ProjectFilters
} from '@/service/app/projects';
import { toast } from 'react-toastify';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (filters?: ProjectFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjects(filters);

      if (!response.error) {
        setProjects(response.data.data);
      } else {
        setError(response.message || 'Failed to fetch projects');
        toast.error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProject(id);

      if (!response.error) {
        setCurrentProject(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch project');
        toast.error(response.message || 'Failed to fetch project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: CreateProjectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.createProject(data);
      console.log("response", response)

      if (!response.error) {
        toast.success('Project created successfully');
        // Set the current project to the newly created project
        setCurrentProject(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to create project');
        toast.error(response.message || 'Failed to create project');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (projectId: number, data: AddMemberData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.addMember(projectId, data);

      if (!response.error) {
        toast.success('Member added successfully');
        return true;
      } else {
        setError(response.message || 'Failed to add member');
        toast.error(response.message || 'Failed to add member');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const addFrameworks = useCallback(async (projectId: number, data: AddFrameworksData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.addFrameworks(projectId, data);

      if (!response.error) {
        toast.success('Frameworks added successfully');
        return true;
      } else {
        setError(response.message || 'Failed to add frameworks');
        toast.error(response.message || 'Failed to add frameworks');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add frameworks';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    addMember,
    addFrameworks,
  };
};
