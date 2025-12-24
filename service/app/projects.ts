import { api, ApiResponse } from "@/lib/api";
import { GovernancePillar } from "@/utils/governancePillar";

export interface Project {
  id: number;
  ai_model_id?: number;
  name: string;
  description: string | null;
  governance_pillar: GovernancePillar | string;
  progress: number;
  total_requirements?: number;
  total_controls?: number;
  created_at: string;
  updated_at: string;
  frameworks?: Framework[];
  framework?: any; // single framework with nested requirements/controls from backend
  users?: ProjectUser[];
}

export interface Framework {
  id: number;
  name: string;
  description?: string;
  type?: string;
  category?: string;
  authority_publisher?: string;
  requirements: number;
  controls: number;
}

export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  role: string;
  project_user_role: string;
  pivot: {
    role: string;
  };
}

export interface CreateProjectData {
  ai_model_id: number;
  name: string;
  description: string | null;
  governance_pillar: GovernancePillar;
}

export interface UpdateProjectData {
  ai_model_id?: number;
  name?: string;
  description?: string | null;
  governance_pillar?: GovernancePillar;
}

export interface AddMemberData {
  user_id: number;
  role: string;
}

export interface AddFrameworksData {
  framework_id: number | string;
}

export interface ProjectFilters {
  search?: string;
  governance_pillar?: GovernancePillar;
  page?: number;
  per_page?: number;
}

export class ProjectService {
  async getProjects(
    filters?: ProjectFilters
  ): Promise<ApiResponse<{ data: Project[] }>> {
    const queryString = filters
      ? new URLSearchParams(
          Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== "")
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : "";

    return api.get(`/projects${queryString ? `?${queryString}` : ""}`);
  }

  async getProject(id: number): Promise<ApiResponse<Project>> {
    return api.get(`/projects/${id}`);
  }

  async createProject(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return api.post("/projects", data);
  }

  async updateProject(
    id: number,
    data: UpdateProjectData
  ): Promise<ApiResponse<Project>> {
    return api.post(`/projects/${id}`, data);
  }

  async addMember(
    projectId: number,
    data: AddMemberData
  ): Promise<ApiResponse<null>> {
    return api.post(`/projects/${projectId}/add-member`, data);
  }

  async addFrameworks(
    projectId: number,
    data: AddFrameworksData
  ): Promise<ApiResponse<null>> {
    return api.post(`/projects/${projectId}/add-framework`, data);
  }
}

export const projectService = new ProjectService();
