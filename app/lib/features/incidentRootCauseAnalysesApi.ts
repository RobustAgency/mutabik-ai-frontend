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

// Types for Incident Root Cause Analyses
export interface IncidentRootCauseAnalysis {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  rca_method: "5_whys" | "fishbone" | "timeline_analysis" | "fault_tree" | "other";
  immediate_cause: string;
  latent_causes: string;
  contributing_factors?: string | null;
  impact_assessment?: string | null;
  fixes_implemented?: string | null;
  lessons_learned: string;
  recommendations: string;
  approved_by: string;
  approved_at: string;
  report_link?: string | null;
  created_at: string;
}

export interface IncidentRootCauseAnalysisFilters {
  ai_incident_id?: number;
  rca_method?: IncidentRootCauseAnalysis["rca_method"];
  page?: number;
  per_page?: number;
}

export interface CreateIncidentRootCauseAnalysisData {
  ai_incident_id: number;
  rca_method: IncidentRootCauseAnalysis["rca_method"];
  immediate_cause: string;
  latent_causes: string;
  contributing_factors?: string | null;
  impact_assessment?: string | null;
  fixes_implemented?: string | null;
  lessons_learned: string;
  recommendations: string;
  approved_by: string;
  approved_at: string;
  report_link?: string | null;
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

export const incidentRootCauseAnalysesApi = createApi({
  reducerPath: "incidentRootCauseAnalysesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["IncidentRootCauseAnalysis"],
  endpoints: (builder) => ({
    getIncidentRootCauseAnalyses: builder.query<
      { data: IncidentRootCauseAnalysis[]; pagination: PaginationMeta },
      IncidentRootCauseAnalysisFilters | void
    >({
      query: (filters) => ({
        url: "/incident-root-cause-analyses",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "IncidentRootCauseAnalysis" as const,
                id: String(id),
              })),
              { type: "IncidentRootCauseAnalysis", id: "LIST" },
            ]
          : [{ type: "IncidentRootCauseAnalysis", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: IncidentRootCauseAnalysis[];
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

    getIncidentRootCauseAnalysis: builder.query<IncidentRootCauseAnalysis, number>({
      query: (id) => ({
        url: `/incident-root-cause-analyses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "IncidentRootCauseAnalysis", id: String(id) }],
      transformResponse: (response: {
        data: IncidentRootCauseAnalysis;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as IncidentRootCauseAnalysis;
      },
    }),

    createIncidentRootCauseAnalysis: builder.mutation<
      IncidentRootCauseAnalysis,
      CreateIncidentRootCauseAnalysisData
    >({
      query: (data) => ({
        url: "/incident-root-cause-analyses",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "IncidentRootCauseAnalysis", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Root cause analysis created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create root cause analysis";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateIncidentRootCauseAnalysis: builder.mutation<
      IncidentRootCauseAnalysis,
      { id: number; data: Partial<CreateIncidentRootCauseAnalysisData> }
    >({
      query: ({ id, data }) => ({
        url: `/incident-root-cause-analyses/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "IncidentRootCauseAnalysis", id: String(id) },
        { type: "IncidentRootCauseAnalysis", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Root cause analysis updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update root cause analysis";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteIncidentRootCauseAnalysis: builder.mutation<void, number>({
      query: (id) => ({
        url: `/incident-root-cause-analyses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "IncidentRootCauseAnalysis", id: String(id) },
        { type: "IncidentRootCauseAnalysis", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Root cause analysis deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete root cause analysis";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetIncidentRootCauseAnalysesQuery,
  useGetIncidentRootCauseAnalysisQuery,
  useCreateIncidentRootCauseAnalysisMutation,
  useUpdateIncidentRootCauseAnalysisMutation,
  useDeleteIncidentRootCauseAnalysisMutation,
} = incidentRootCauseAnalysesApi;

