import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums for Incident Root Cause Analyses
export enum RcaMethod {
  FIVE_WHYS = "five_whys",
  FISHBONE = "fishbone",
  FAULT_TREE = "fault_tree",
  EVENT_CAUSAL = "event_causal",
  CHANGE = "change",
  TIMELINE = "timeline",
  BARRIER = "barrier",
  COMBINED = "combined",
}

// Types for Incident Root Cause Analyses
export interface IncidentRootCauseAnalysis {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  rca_method: RcaMethod;
  analysis_date?: string | null;
  immediate_cause: string;
  root_causes: string;
  contributing_factors?: string | null;
  control_failures?: string | null;
  recommendations: string;
  lead_analyst: string;
  review_committee?: string | null;
  approved_at?: string | null;
  report_link?: string | null;
  created_at: string;
  updated_at?: string;
  display_id?: string | null;
  ai_incident?: {
    id: number;
    title: string;
    display_id?: string;
    [key: string]: unknown;
  } | null;
}

export interface IncidentRootCauseAnalysisFilters {
  ai_incident_id?: number;
  rca_method?: RcaMethod;
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  page?: number;
  per_page?: number;
}

export interface CreateIncidentRootCauseAnalysisData {
  ai_incident_id: number;
  rca_method: RcaMethod;
  analysis_date?: string | null;
  immediate_cause: string;
  root_causes: string;
  contributing_factors?: string | null;
  control_failures?: string | null;
  recommendations: string;
  lead_analyst: string;
  review_committee?: string | null;
  approved_at?: string | null;
  report_link?: string | null;
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

