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

// Types for Corrective Preventive Actions (CAPA)
export interface CorrectivePreventiveAction {
  id: number;
  organization_id: number;
  source_type: "incident" | "risk" | "feedback" | "override" | "audit" | "assessment" | "other";
  source_id: string;
  model_id?: string | null;
  title: string;
  capa_type: "corrective" | "preventive" | "both";
  priority: "low" | "medium" | "high" | "critical";
  owner_team:
    | "product_ops"
    | "engineering"
    | "data_science"
    | "security"
    | "privacy"
    | "risk"
    | "legal"
    | "vendor_mgmt";
  assignee?: string | null;
  root_cause?: string | null;
  actions?: string | null;
  due_date: string;
  status: "new" | "in_progress" | "blocked" | "pending_verification" | "closed";
  verification_result: "pending" | "passed" | "failed" | "not_applicable";
  evidence_link?: string | null;
  created_at: string;
  closed_at?: string | null;
}

export interface CorrectivePreventiveActionFilters {
  source_type?: CorrectivePreventiveAction["source_type"];
  source_id?: string;
  model_id?: string;
  capa_type?: CorrectivePreventiveAction["capa_type"];
  priority?: CorrectivePreventiveAction["priority"];
  owner_team?: CorrectivePreventiveAction["owner_team"];
  status?: CorrectivePreventiveAction["status"];
  verification_result?: CorrectivePreventiveAction["verification_result"];
  page?: number;
  per_page?: number;
}

export interface CreateCorrectivePreventiveActionData {
  source_type: CorrectivePreventiveAction["source_type"];
  source_id: string;
  model_id?: string | null;
  title: string;
  capa_type: CorrectivePreventiveAction["capa_type"];
  priority: CorrectivePreventiveAction["priority"];
  owner_team: CorrectivePreventiveAction["owner_team"];
  assignee?: string | null;
  root_cause?: string | null;
  actions?: string | null;
  due_date: string;
  status: CorrectivePreventiveAction["status"];
  verification_result: CorrectivePreventiveAction["verification_result"];
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

export const correctivePreventiveActionsApi = createApi({
  reducerPath: "correctivePreventiveActionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["CorrectivePreventiveAction"],
  endpoints: (builder) => ({
    getCorrectivePreventiveActions: builder.query<
      { data: CorrectivePreventiveAction[]; pagination: PaginationMeta },
      CorrectivePreventiveActionFilters | void
    >({
      query: (filters) => ({
        url: "/corrective-preventive-actions",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "CorrectivePreventiveAction" as const,
                id: String(id),
              })),
              { type: "CorrectivePreventiveAction", id: "LIST" },
            ]
          : [{ type: "CorrectivePreventiveAction", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: CorrectivePreventiveAction[];
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

    getCorrectivePreventiveAction: builder.query<CorrectivePreventiveAction, number>({
      query: (id) => ({
        url: `/corrective-preventive-actions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "CorrectivePreventiveAction", id: String(id) },
      ],
      transformResponse: (response: {
        data: CorrectivePreventiveAction;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as CorrectivePreventiveAction;
      },
    }),

    createCorrectivePreventiveAction: builder.mutation<
      CorrectivePreventiveAction,
      CreateCorrectivePreventiveActionData
    >({
      query: (data) => ({
        url: "/corrective-preventive-actions",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "CorrectivePreventiveAction", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("CAPA created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create CAPA";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateCorrectivePreventiveAction: builder.mutation<
      CorrectivePreventiveAction,
      { id: number; data: Partial<CreateCorrectivePreventiveActionData> }
    >({
      query: ({ id, data }) => ({
        url: `/corrective-preventive-actions/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CorrectivePreventiveAction", id: String(id) },
        { type: "CorrectivePreventiveAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("CAPA updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update CAPA";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteCorrectivePreventiveAction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/corrective-preventive-actions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CorrectivePreventiveAction", id: String(id) },
        { type: "CorrectivePreventiveAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("CAPA deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete CAPA";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetCorrectivePreventiveActionsQuery,
  useGetCorrectivePreventiveActionQuery,
  useCreateCorrectivePreventiveActionMutation,
  useUpdateCorrectivePreventiveActionMutation,
  useDeleteCorrectivePreventiveActionMutation,
} = correctivePreventiveActionsApi;

