import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";
import type {
  AiModelVersion,
  CreateAiModelVersionData,
  AiModelVersionFilters,
} from "@/service/app/aiModelVersions";

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

export const aiModelVersionsApi = createApi({
  reducerPath: "aiModelVersionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModelVersion"],
  endpoints: (builder) => ({
    getAiModelVersions: builder.query<
      AiModelVersion[],
      AiModelVersionFilters | void
    >({
      query: (filters = {}) => ({
        url: "/ai-model-versions",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AiModelVersion" as const,
                id,
              })),
              { type: "AiModelVersion", id: "LIST" },
            ]
          : [{ type: "AiModelVersion", id: "LIST" }],
      transformResponse: (response: {
        data: { data: AiModelVersion[] };
        error?: boolean;
        message?: string;
      }) => {
        let versions: AiModelVersion[] = [];
        if (response.data?.data) {
          versions = response.data.data;
        } else if (Array.isArray(response.data)) {
          versions = response.data;
        }
        // Normalize: ensure version is always available from version_number
        return versions.map((v) => ({
          ...v,
          version: v.version || v.version_number,
        }));
      },
    }),

    getAiModelVersion: builder.query<AiModelVersion, number>({
      query: (id) => ({
        url: `/ai-model-versions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiModelVersion", id }],
      transformResponse: (response: {
        data: AiModelVersion;
        error?: boolean;
        message?: string;
      }) => {
        const version =
          response.data || (response as unknown as AiModelVersion);
        // Normalize: ensure version is always available (single API returns 'version', fallback to 'version_number')
        return {
          ...version,
          version: version.version || version.version_number,
        };
      },
    }),

    createAiModelVersion: builder.mutation<
      AiModelVersion,
      CreateAiModelVersionData
    >({
      query: (data) => ({
        url: "/ai-model-versions",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "AiModelVersion", id: "LIST" }],
      transformResponse: (response: {
        data: AiModelVersion;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as AiModelVersion;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Model Version created successfully!");
        } catch (error) {
          const err = error as MutationError;
          const message =
            err.error?.data?.message || "Failed to create AI Model Version";
          toast.error(message);
        }
      },
    }),

    updateAiModelVersion: builder.mutation<
      AiModelVersion,
      { id: number; data: Partial<CreateAiModelVersionData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-model-versions/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiModelVersion", id },
        { type: "AiModelVersion", id: "LIST" },
      ],
      transformResponse: (response: {
        data: AiModelVersion;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as AiModelVersion;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Model Version updated successfully!");
        } catch (error) {
          const err = error as MutationError;
          const message =
            err.error?.data?.message || "Failed to update AI Model Version";
          toast.error(message);
        }
      },
    }),

    deleteAiModelVersion: builder.mutation<null, number>({
      query: (id) => ({
        url: `/ai-model-versions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiModelVersion", id },
        { type: "AiModelVersion", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Model Version deleted successfully!");
        } catch (error) {
          const err = error as MutationError;
          const message =
            err.error?.data?.message || "Failed to delete AI Model Version";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetAiModelVersionsQuery,
  useGetAiModelVersionQuery,
  useCreateAiModelVersionMutation,
  useUpdateAiModelVersionMutation,
  useDeleteAiModelVersionMutation,
} = aiModelVersionsApi;
