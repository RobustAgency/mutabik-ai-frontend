import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// Types for AI Incidents
export interface AiIncident {
  id: number;
  organization_id: number;
  title: string;
  summary: string;
  category: 
    | "safety"
    | "privacy"
    | "security"
    | "bias_fairness"
    | "reliability"
    | "availability"
    | "legal_compliance"
    | "vendor"
    | "other";
  severity: "sev1_critical" | "sev2_high" | "sev3_medium" | "sev4_low" | "near_miss";
  status: "open" | "contained" | "monitoring" | "resolved" | "closed";
  stage: "ideation" | "conception" | "dev" | "test" | "staging" | "prod" | "retirement";
  ic_owner: string;
  model_id?: string | null;
  model_version_id?: string | null;
  use_case_id?: string | null;
  first_seen_at: string;
  declared_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  impacted_users?: string | null;
  impacted_data: string[];
  impacted_systems?: string | null;
  linked_release_id?: string | null;
  linked_risk_id?: string | null;
  linked_assessment_id?: string | null;
  linked_capa_id?: string | null;
  evidence_link?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export interface AiIncidentFilters {
  search?: string;
  category?: AiIncident["category"];
  severity?: AiIncident["severity"];
  status?: AiIncident["status"];
  stage?: AiIncident["stage"];
  page?: number;
  per_page?: number;
}

export interface CreateAiIncidentData {
  title: string;
  summary: string;
  category: AiIncident["category"];
  severity: AiIncident["severity"];
  status: AiIncident["status"];
  stage: AiIncident["stage"];
  ic_owner: string;
  model_id?: string | null;
  model_version_id?: string | null;
  use_case_id?: string | null;
  first_seen_at: string;
  declared_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  impacted_users?: string | null;
  impacted_data: string[];
  impacted_systems?: string | null;
  linked_release_id?: string | null;
  linked_risk_id?: string | null;
  linked_assessment_id?: string | null;
  linked_capa_id?: string | null;
  evidence_link?: string | null;
}

// Custom base query using existing Axios client
const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        data?: unknown;
        message?: string;
        error?: boolean;
        errors?: Record<string, string[]>;
      }>;

      const error = {
        status: err.response?.status || 500,
        data: err.response?.data || {
          message: err.message || "An error occurred",
          error: true,
        },
      };

      return {
        error,
      };
    }
  };

// Type for RTK Query mutation errors
interface MutationError {
  error?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export const aiIncidentsApi = createApi({
  reducerPath: "aiIncidentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiIncident"],
  endpoints: (builder) => ({
    getAiIncidents: builder.query<
      { data: AiIncident[]; pagination: PaginationMeta },
      AiIncidentFilters | void
    >({
      query: (filters) => ({
        url: "/ai-incidents",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "AiIncident" as const,
                id: String(id),
              })),
              { type: "AiIncident", id: "LIST" },
            ]
          : [{ type: "AiIncident", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: AiIncident[];
          current_page: number;
          per_page: number;
          total: number;
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
            per_page: 15,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          },
        };
      },
    }),

    getAiIncident: builder.query<AiIncident, number>({
      query: (id) => ({
        url: `/ai-incidents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiIncident", id: String(id) }],
      transformResponse: (response: {
        data: AiIncident;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as AiIncident;
      },
    }),

    createAiIncident: builder.mutation<AiIncident, CreateAiIncidentData>({
      query: (data) => ({
        url: "/ai-incidents",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "AiIncident", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Incident created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create AI incident";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiIncident: builder.mutation<
      AiIncident,
      { id: number; data: Partial<CreateAiIncidentData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-incidents/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiIncident", id: String(id) },
        { type: "AiIncident", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Incident updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update AI incident";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiIncident: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-incidents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiIncident", id: String(id) },
        { type: "AiIncident", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Incident deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete AI incident";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiIncidentsQuery,
  useGetAiIncidentQuery,
  useCreateAiIncidentMutation,
  useUpdateAiIncidentMutation,
  useDeleteAiIncidentMutation,
} = aiIncidentsApi;

