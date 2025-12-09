import { useCallback } from "react";
import {
  type Project,
  type CreateProjectData,
  type AddMemberData,
  type AddFrameworksData,
  type ProjectFilters,
} from "@/service/app/projects";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  fetchProjects as fetchProjectsAction,
  fetchProject as fetchProjectAction,
  createProject as createProjectAction,
  addMember as addMemberAction,
  addFrameworks as addFrameworksAction,
} from "@/app/lib/features/projectsSlice";

export const useProjects = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const projects = useAppSelector((state) => state.projects.projects);
  const currentProject = useAppSelector(
    (state) => state.projects.currentProject
  );
  const loading = useAppSelector((state) => state.projects.loading);
  const error = useAppSelector((state) => state.projects.error);

  const fetchProjects = useCallback(
    async (filters?: ProjectFilters) => {
      const result = await dispatch(fetchProjectsAction({ filters }));
      return result;
    },
    [dispatch]
  );

  const fetchProject = useCallback(
    async (id: number) => {
      const result = await dispatch(fetchProjectAction(id));
      if (fetchProjectAction.fulfilled.match(result)) {
        return result.payload as Project;
      }
      return null;
    },
    [dispatch]
  );

  const createProject = useCallback(
    async (data: CreateProjectData) => {
      const result = await dispatch(createProjectAction(data));
      if (createProjectAction.fulfilled.match(result)) {
        return result.payload as Project;
      }
      return null;
    },
    [dispatch]
  );

  const addMember = useCallback(
    async (projectId: number, data: AddMemberData) => {
      const result = await dispatch(addMemberAction({ projectId, data }));
      return addMemberAction.fulfilled.match(result);
    },
    [dispatch]
  );

  const addFrameworks = useCallback(
    async (projectId: number, data: AddFrameworksData) => {
      const result = await dispatch(addFrameworksAction({ projectId, data }));
      return addFrameworksAction.fulfilled.match(result);
    },
    [dispatch]
  );

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
