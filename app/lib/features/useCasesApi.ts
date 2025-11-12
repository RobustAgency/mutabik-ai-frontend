import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type { UseCase, CreateUseCaseData } from "@/service/app/useCases";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

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

export const useCasesApi = createApi({
  reducerPath: "useCasesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UseCase"],
  endpoints: (builder) => ({
    getUseCases: builder.query<UseCase[], void>({
      query: () => ({
        url: "/use-cases",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "UseCase" as const, id })),
              { type: "UseCase", id: "LIST" },
            ]
          : [{ type: "UseCase", id: "LIST" }],
      transformResponse: (response: {
        data: { data: { data?: UseCase[] } | UseCase[] };
        error?: boolean;
        message?: string;
      }) => {
        // Handle paginated response: { data: { data: [...] } }
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        // Handle nested paginated response: { data: { data: { data: [...] } } }
        if (
          response.data?.data &&
          typeof response.data.data === "object" &&
          "data" in response.data.data &&
          Array.isArray((response.data.data as any).data)
        ) {
          return (response.data.data as any).data;
        }
        // Handle direct array response
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),

    getUseCase: builder.query<UseCase, number>({
      query: (id) => ({
        url: `/use-cases/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "UseCase", id }],
      transformResponse: (response: {
        data?: UseCase;
        error?: boolean;
        message?: string;
      }) => {
        // Handle response structure: { data: UseCase, error: boolean, message: string }
        if (response.data) {
          return response.data;
        }
        // Fallback: if response is the UseCase directly
        return response as any;
      },
    }),

    createUseCase: builder.mutation<UseCase, CreateUseCaseData>({
      query: (data) => {
        return {
          url: "/use-cases",
          method: "POST",
          data: data,
        };
      },
      invalidatesTags: [{ type: "UseCase", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Use case created successfully");
        } catch (error: any) {
          // Don't show toast here - let component handle validation errors
          // Only show toast for unexpected errors
          if (!error?.error?.data?.errors) {
            const errorMessage =
              error?.error?.data?.message || "Failed to create use case";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateUseCase: builder.mutation<
      UseCase,
      { id: number; data: Partial<CreateUseCaseData> }
    >({
      query: ({ id, data }) => ({
        url: `/use-cases/${id}`,
        method: "POST",
        data: data, // ✅ Fixed: Changed from 'body' to 'data'
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "UseCase", id },
        { type: "UseCase", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Use case updated successfully");
        } catch (error: any) {
          if (!error?.error?.data?.errors) {
            const errorMessage =
              error?.error?.data?.message || "Failed to update use case";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteUseCase: builder.mutation<void, number>({
      query: (id) => ({
        url: `/use-cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "UseCase", id },
        { type: "UseCase", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Use case deleted successfully");
        } catch (error: any) {
          const errorMessage =
            error?.error?.data?.message || "Failed to delete use case";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetUseCasesQuery,
  useGetUseCaseQuery,
  useCreateUseCaseMutation,
  useUpdateUseCaseMutation,
  useDeleteUseCaseMutation,
} = useCasesApi;
