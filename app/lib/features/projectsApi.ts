import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";
import { GovernancePillar } from "@/utils/governancePillar";

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

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Project"],
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
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Project" as const,
                id: String(id),
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
      transformResponse: (response: {
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
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
              from: response.data.from,
              to: response.data.to,
            },
          };
        }
        return {
          data: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          },
        };
      },
    }),

    getProject: builder.query<Project, number>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project", id: String(id) }],
      transformResponse: (response: {
        data: Project;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as Project;
      },
    }),

    createProject: builder.mutation<Project, CreateProjectData>({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Project created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create project";
            toast.error(errorMessage);
          }
        }
      },
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
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id: String(id) },
        { type: "Project", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Project updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update project";
            toast.error(errorMessage);
          }
        }
      },
    }),

    addMember: builder.mutation<void, { projectId: number; data: AddMemberData }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/add-member`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: String(projectId) },
        { type: "Project", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Member added successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to add member";
            toast.error(errorMessage);
          }
        }
      },
    }),

    addFrameworks: builder.mutation<void, { projectId: number; data: AddFrameworksData }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/add-framework`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: String(projectId) },
        { type: "Project", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Frameworks added successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to add frameworks";
            toast.error(errorMessage);
          }
        }
      },
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

