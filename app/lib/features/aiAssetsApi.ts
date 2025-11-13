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

// Types for AI Assets
export interface AiAsset {
  id: number;
  organization_id: number;
  vendor_id?: number | null;
  vendor_effective_from?: string | null;
  vendor_effective_to?: string | null;
  vendor_agreement_id?: number | null;
  vendor_assessment_id?: number | null;
  created_at?: string;
  updated_at?: string;
  vendor?: {
    id: number;
    vendor_name: string;
    legal_name?: string;
    [key: string]: unknown;
  };
  vendor_agreement?: {
    id: number;
    [key: string]: unknown;
  } | null;
}

export interface AiAssetFilters {
  page?: number;
  per_page?: number;
}

export interface CreateAiAssetData {
  vendor_id?: number | null;
  vendor_effective_from?: string | null;
  vendor_effective_to?: string | null;
  vendor_agreement_id?: number | null;
  vendor_assessment_id?: number | null;
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

export const aiAssetsApi = createApi({
  reducerPath: "aiAssetsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiAsset"],
  endpoints: (builder) => ({
    getAiAssets: builder.query<
      { data: AiAsset[]; pagination: PaginationMeta },
      AiAssetFilters | void
    >({
      query: (filters) => ({
        url: "/ai-assets",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "AiAsset" as const,
                id: String(id),
              })),
              { type: "AiAsset", id: "LIST" },
            ]
          : [{ type: "AiAsset", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: AiAsset[];
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

    getAiAsset: builder.query<AiAsset, number>({
      query: (id) => ({
        url: `/ai-assets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiAsset", id: String(id) }],
      transformResponse: (response: {
        data: AiAsset;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as AiAsset;
      },
    }),

    createAiAsset: builder.mutation<AiAsset, CreateAiAssetData>({
      query: (data) => ({
        url: "/ai-assets",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "AiAsset", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Asset created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create AI asset";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiAsset: builder.mutation<
      AiAsset,
      { id: number; data: Partial<CreateAiAssetData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-assets/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiAsset", id: String(id) },
        { type: "AiAsset", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Asset updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update AI asset";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiAsset: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-assets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiAsset", id: String(id) },
        { type: "AiAsset", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Asset deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete AI asset";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiAssetsQuery,
  useGetAiAssetQuery,
  useCreateAiAssetMutation,
  useUpdateAiAssetMutation,
  useDeleteAiAssetMutation,
} = aiAssetsApi;


