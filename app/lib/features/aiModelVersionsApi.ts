import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Type for AI Model Version
export interface AiModelVersion {
  id: number;
  version: string;
  ai_model_id: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Type for AI Model Versions response
export interface AiModelVersionsResponse {
  data: {
    current_page: number;
    data: AiModelVersion[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  error: boolean;
  message: string;
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

export const aiModelVersionsApi = createApi({
  reducerPath: "aiModelVersionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModelVersion"],
  endpoints: (builder) => ({
    getAiModelVersions: builder.query<AiModelVersion[], number>({
      query: (aiModelId) => ({
        url: "/ai-model-versions",
        method: "GET",
        params: { ai_model_id: aiModelId },
      }),
      providesTags: (result, error, aiModelId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AiModelVersion" as const,
                id,
              })),
              { type: "AiModelVersion", id: `LIST-${aiModelId}` },
            ]
          : [{ type: "AiModelVersion", id: `LIST-${aiModelId}` }],
      transformResponse: (response: AiModelVersionsResponse) => {
        if (response.data?.data) {
          return response.data.data;
        }
        return [];
      },
    }),
  }),
});

export const { useGetAiModelVersionsQuery } = aiModelVersionsApi;
