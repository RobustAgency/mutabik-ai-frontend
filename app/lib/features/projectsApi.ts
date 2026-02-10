import { baseApi } from "@/lib/api/baseApi";
import { PaginationMeta } from "@/lib/api/rtkQueryBase";
import { GovernancePillar } from "@/utils/governancePillar";
import {
  transformListResponseWithCalculatedPagination,
  transformSingleItemResponse,
  createListTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
} from "@/lib/api/rtkQueryHelpers";

// Types for projects
export interface Project {
  id: number;
  ai_model_id?: number | null;
  name: string;
  description: string | null;
  governance_pillar: GovernancePillar | string;
  progress: number;
  total_requirements?: number;
  total_controls?: number;
  created_at: string;
  updated_at: string;
  framework_id?: number | null;
  organization_id?: number | null;
  frameworks?: Framework[];
  framework?: Framework | null;
  users?: ProjectUser[];
}

export interface FrameworkControl {
  id: number;
  name?: string;
  reference?: string;
  objective?: string;
  testing_method?: string;
  testing_frequency?: string;
  evidence_expectations?: string;
  applicability_criteria?: string;
  status?: string;
  last_test_date?: string;
  next_test_due?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FrameworkRequirement {
  id: number;
  framework_id?: number;
  reference?: string;
  requirement_text?: string;
  category?: string;
  applicability?: string;
  effective_from?: string;
  effective_to?: string;
  supersedes_req_id?: number;
  superseded_by_req_id?: number;
  priority?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  controls?: FrameworkControl[];
}

export interface Framework {
  id: number;
  user_id?: number;
  name: string;
  description?: string;
  version?: string;
  jurisdictions?: string[];
  scope?: string;
  status?: string;
  effective_date?: string;
  source_url?: string;
  type?: string;
  category?: string;
  authority_publisher?: string;
  requirements?: number | FrameworkRequirement[];
  controls?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectUser {
  id: number;
  supabase_id?: string;
  name: string;
  email: string;
  role: string;
  project_user_role?: string;
  email_verified_at?: string | null;
  stripe_id?: string | null;
  pm_type?: string | null;
  pm_last_four?: string | null;
  trial_ends_at?: string | null;
  plan_id?: number | null;
  organization_id?: number;
  created_at?: string;
  updated_at?: string;
  pivot: {
    project_id: number;
    user_id: number;
    role: string;
  };
}

export interface ProjectFilters {
  search?: string;
  governance_pillar?: GovernancePillar | string;
  page?: number;
  per_page?: number;
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

interface ProjectListResponse {
  data: {
    data: Project[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  error?: boolean;
  message?: string;
}

interface ProjectItemResponse {
  data: Project;
  error?: boolean;
  message?: string;
}

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<
      { data: Project[]; pagination: PaginationMeta },
      ProjectFilters | void
    >({
      query: (filters) => ({
        url: "/projects",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) => createListTags(result, "Project"),
      transformResponse: (response: ProjectListResponse) =>
        transformListResponseWithCalculatedPagination(response) as {
          data: Project[];
          pagination: PaginationMeta;
        },
    }),

    getProject: builder.query<Project, number>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id }],
      transformResponse: (response: ProjectItemResponse) =>
        transformSingleItemResponse(response),
    }),

    createProject: builder.mutation<Project, CreateProjectData>({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateListTags("Project"),
      onQueryStarted: createMutationToastHandler(
        "Project created successfully",
        "Failed to create project"
      ),
    }),

    updateProject: builder.mutation<
      Project,
      { id: number; data: UpdateProjectData }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("Project"),
      onQueryStarted: createMutationToastHandler(
        "Project updated successfully",
        "Failed to update project"
      ),
    }),

    addMember: builder.mutation<
      void,
      { projectId: number; data: AddMemberData }
    >({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/add-member`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
      onQueryStarted: createMutationToastHandler(
        "Member added successfully",
        "Failed to add member"
      ),
    }),

    addFrameworks: builder.mutation<
      void,
      { projectId: number; data: AddFrameworksData }
    >({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/add-framework`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
      onQueryStarted: createMutationToastHandler(
        "Frameworks added successfully",
        "Failed to add frameworks"
      ),
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useAddMemberMutation,
  useAddFrameworksMutation,
} = projectsApi;
