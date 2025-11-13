import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface ConsentScope {
  id: string;
  dataset_id: string;
  purpose: string[];
  subject_realm: string;
  jurisdiction: string;
  source_created_at: string;
  effective_from: string;
  effective_to: string | null;
  created_at: string;
}

// Filter types for Consent Scopes
export interface ConsentScopeFilters {
  per_page?: number | null; // min:1, max:100
}

export interface CreateConsentScopeData {
  dataset_id: string;
  purpose: string[];
  subject_realm: string;
  jurisdiction: string;
  source_created_at: string;
  effective_from: string;
  effective_to?: string;
}

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

interface MutationError {
  error?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export const consentScopesApi = createApi({
  reducerPath: "consentScopesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ConsentScope"],
  endpoints: (builder) => ({
    getConsentScopes: builder.query<
      ConsentScope[],
      ConsentScopeFilters | void
    >({
      query: (filters = {}) => ({
        url: "/consent-scopes",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ConsentScope" as const,
                id,
              })),
              { type: "ConsentScope", id: "LIST" },
            ]
          : [{ type: "ConsentScope", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: ConsentScope[];
        };
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getConsentScope: builder.query<ConsentScope, string>({
      query: (id) => ({
        url: `/consent-scopes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ConsentScope", id }],
      transformResponse: (response: { data: ConsentScope }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as ConsentScope;
      },
    }),

    createConsentScope: builder.mutation<ConsentScope, CreateConsentScopeData>({
      query: (data) => ({
        url: "/consent-scopes",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "ConsentScope", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent scope created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create consent scope";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateConsentScope: builder.mutation<
      ConsentScope,
      { id: string; data: Partial<CreateConsentScopeData> }
    >({
      query: ({ id, data }) => ({
        url: `/consent-scopes/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ConsentScope", id },
        { type: "ConsentScope", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent scope updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update consent scope";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteConsentScope: builder.mutation<void, string>({
      query: (id) => ({
        url: `/consent-scopes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ConsentScope", id },
        { type: "ConsentScope", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent scope deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete consent scope";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetConsentScopesQuery,
  useGetConsentScopeQuery,
  useCreateConsentScopeMutation,
  useUpdateConsentScopeMutation,
  useDeleteConsentScopeMutation,
} = consentScopesApi;
