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

// Types for Incident Actions
export interface IncidentAction {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  action_type:
    | "kill_switch"
    | "rollback_release"
    | "key_rotation"
    | "blocklist_update"
    | "traffic_throttle"
    | "model_disable_tool"
    | "policy_change"
    | "communication"
    | "data_purge"
    | "other";
  description: string;
  performed_by: string;
  started_at: string;
  completed_at?: string | null;
  validation_result: "passed" | "failed" | "pending" | "not_applicable";
  validation_notes?: string | null;
  linked_release_id?: string | null;
  evidence_link?: string | null;
  created_at: string;
}

export interface IncidentActionFilters {
  ai_incident_id?: number;
  action_type?: IncidentAction["action_type"];
  validation_result?: IncidentAction["validation_result"];
  page?: number;
  per_page?: number;
}

export interface CreateIncidentActionData {
  ai_incident_id: number;
  action_type: IncidentAction["action_type"];
  description: string;
  performed_by: string;
  started_at: string;
  completed_at?: string | null;
  validation_result: IncidentAction["validation_result"];
  validation_notes?: string | null;
  linked_release_id?: string | null;
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

export const incidentActionsApi = createApi({
  reducerPath: "incidentActionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["IncidentAction"],
  endpoints: (builder) => ({
    getIncidentActions: builder.query<
      { data: IncidentAction[]; pagination: PaginationMeta },
      IncidentActionFilters | void
    >({
      query: (filters) => ({
        url: "/incident-actions",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "IncidentAction" as const,
                id: String(id),
              })),
              { type: "IncidentAction", id: "LIST" },
            ]
          : [{ type: "IncidentAction", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: IncidentAction[];
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

    getIncidentAction: builder.query<IncidentAction, number>({
      query: (id) => ({
        url: `/incident-actions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "IncidentAction", id: String(id) }],
      transformResponse: (response: {
        data: IncidentAction;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as IncidentAction;
      },
    }),

    createIncidentAction: builder.mutation<IncidentAction, CreateIncidentActionData>({
      query: (data) => ({
        url: "/incident-actions",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "IncidentAction", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident action created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create incident action";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateIncidentAction: builder.mutation<
      IncidentAction,
      { id: number; data: Partial<CreateIncidentActionData> }
    >({
      query: ({ id, data }) => ({
        url: `/incident-actions/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "IncidentAction", id: String(id) },
        { type: "IncidentAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident action updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update incident action";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteIncidentAction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/incident-actions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "IncidentAction", id: String(id) },
        { type: "IncidentAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident action deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete incident action";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetIncidentActionsQuery,
  useGetIncidentActionQuery,
  useCreateIncidentActionMutation,
  useUpdateIncidentActionMutation,
  useDeleteIncidentActionMutation,
} = incidentActionsApi;

