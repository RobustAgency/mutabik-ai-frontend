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

// Types for Incident Alerts
export interface IncidentAlert {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  source_type: "kri" | "monitoring_rule" | "human_report" | "vendor_notice" | "security_tool" | "other";
  source_ref?: string | null;
  rule_version?: string | null;
  context?: string | null;
  first_seen_at: string;
  last_seen_at?: string | null;
  evidence_link?: string | null;
  created_at: string;
}

export interface IncidentAlertFilters {
  ai_incident_id?: number;
  source_type?: IncidentAlert["source_type"];
  page?: number;
  per_page?: number;
}

export interface CreateIncidentAlertData {
  ai_incident_id: number;
  source_type: IncidentAlert["source_type"];
  source_ref?: string | null;
  rule_version?: string | null;
  context?: string | null;
  first_seen_at: string;
  last_seen_at?: string | null;
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

export const incidentAlertsApi = createApi({
  reducerPath: "incidentAlertsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["IncidentAlert"],
  endpoints: (builder) => ({
    getIncidentAlerts: builder.query<
      { data: IncidentAlert[]; pagination: PaginationMeta },
      IncidentAlertFilters | void
    >({
      query: (filters) => ({
        url: "/incident-alerts",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "IncidentAlert" as const,
                id: String(id),
              })),
              { type: "IncidentAlert", id: "LIST" },
            ]
          : [{ type: "IncidentAlert", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: IncidentAlert[];
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

    getIncidentAlert: builder.query<IncidentAlert, number>({
      query: (id) => ({
        url: `/incident-alerts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "IncidentAlert", id: String(id) }],
      transformResponse: (response: {
        data: IncidentAlert;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as IncidentAlert;
      },
    }),

    createIncidentAlert: builder.mutation<IncidentAlert, CreateIncidentAlertData>({
      query: (data) => ({
        url: "/incident-alerts",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "IncidentAlert", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident alert created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create incident alert";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateIncidentAlert: builder.mutation<
      IncidentAlert,
      { id: number; data: Partial<CreateIncidentAlertData> }
    >({
      query: ({ id, data }) => ({
        url: `/incident-alerts/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "IncidentAlert", id: String(id) },
        { type: "IncidentAlert", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident alert updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update incident alert";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteIncidentAlert: builder.mutation<void, number>({
      query: (id) => ({
        url: `/incident-alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "IncidentAlert", id: String(id) },
        { type: "IncidentAlert", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident alert deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete incident alert";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetIncidentAlertsQuery,
  useGetIncidentAlertQuery,
  useCreateIncidentAlertMutation,
  useUpdateIncidentAlertMutation,
  useDeleteIncidentAlertMutation,
} = incidentAlertsApi;

