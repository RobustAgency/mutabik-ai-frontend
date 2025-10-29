import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Types for stakeholders
export interface Stakeholder {
  id: string;
  name: string;
  type: 'person' | 'vendor_org';
  email?: string;
  role?: string;
  department?: string;
  organization?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStakeholderData {
  name: string;
  type: 'person' | 'vendor_org';
  email?: string;
  role?: string;
  department?: string;
  organization?: string;
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

export const stakeholdersApi = createApi({
  reducerPath: "stakeholdersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Stakeholder"],
  endpoints: (builder) => ({
    getStakeholders: builder.query<Stakeholder[], void>({
      query: () => ({
        url: "/stakeholders",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Stakeholder" as const, id })),
              { type: "Stakeholder", id: "LIST" },
            ]
          : [{ type: "Stakeholder", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Stakeholder[];
          current_page: number;
          total: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getStakeholdersByType: builder.query<Stakeholder[], 'person' | 'vendor_org'>({
      query: (type) => ({
        url: `/stakeholders?type=${type}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Stakeholder" as const, id })),
              { type: "Stakeholder", id: "LIST" },
            ]
          : [{ type: "Stakeholder", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Stakeholder[];
          current_page: number;
          total: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getStakeholder: builder.query<Stakeholder, string>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Stakeholder", id }],
      transformResponse: (response: {
        data: Stakeholder;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as Stakeholder;
      },
    }),

    createStakeholder: builder.mutation<Stakeholder, CreateStakeholderData>({
      query: (data) => ({
        url: "/stakeholders",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "Stakeholder", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Stakeholder created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create stakeholder";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateStakeholder: builder.mutation<
      Stakeholder,
      { id: string; data: Partial<CreateStakeholderData> }
    >({
      query: ({ id, data }) => ({
        url: `/stakeholders/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stakeholder", id },
        { type: "Stakeholder", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Stakeholder updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update stakeholder";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteStakeholder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stakeholder", id },
        { type: "Stakeholder", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Stakeholder deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete stakeholder";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetStakeholdersQuery,
  useGetStakeholdersByTypeQuery,
  useGetStakeholderQuery,
  useCreateStakeholderMutation,
  useUpdateStakeholderMutation,
  useDeleteStakeholderMutation,
} = stakeholdersApi;
