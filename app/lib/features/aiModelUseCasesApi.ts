import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Type for AI Model Use Case
export interface AiModelUseCase {
  id: number;
  ai_model_id: number;
  use_case_id: number;
  ai_model_version_id: number;
  relationship_type: string;
  created_at: string;
  updated_at: string;
  // Include related data
  use_case?: {
    id: number;
    title: string;
    description?: string;
    status: string;
    business_domain: string;
  };
  ai_model_version?: {
    id: number;
    version: string;
  };
}

// Type for creating AI Model Use Case
export interface CreateAiModelUseCaseData {
  ai_model_id: number;
  use_case_id: number;
  ai_model_version_id: number;
  relationship_type: string;
}

// Type for AI Model Use Cases response
export interface AiModelUseCasesResponse {
  data: {
    current_page: number;
    data: AiModelUseCase[];
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

export const aiModelUseCasesApi = createApi({
  reducerPath: "aiModelUseCasesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModelUseCase"],
  endpoints: (builder) => ({
    getAiModelUseCases: builder.query<AiModelUseCase[], number>({
      query: (aiModelId) => ({
        url: "/ai-model-use-cases",
        method: "GET",
        params: { ai_model_id: aiModelId },
      }),
      providesTags: (result, error, aiModelId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AiModelUseCase" as const,
                id,
              })),
              { type: "AiModelUseCase", id: `LIST-${aiModelId}` },
            ]
          : [{ type: "AiModelUseCase", id: `LIST-${aiModelId}` }],
      transformResponse: (response: AiModelUseCasesResponse) => {
        if (response.data?.data) {
          return response.data.data;
        }
        return [];
      },
    }),

    getAiModelUseCase: builder.query<AiModelUseCase, number>({
      query: (id) => ({
        url: `/ai-model-use-cases/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiModelUseCase", id }],
      transformResponse: (response: { data: AiModelUseCase }) => {
        return response.data;
      },
    }),

    createAiModelUseCase: builder.mutation<
      AiModelUseCase,
      CreateAiModelUseCaseData
    >({
      query: (data) => ({
        url: "/ai-model-use-cases",
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { ai_model_id }) => [
        { type: "AiModelUseCase", id: "LIST" },
        { type: "AiModelUseCase", id: `LIST-${ai_model_id}` },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Use case linked successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to link use case";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiModelUseCase: builder.mutation<
      AiModelUseCase,
      { id: number; data: Partial<CreateAiModelUseCaseData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-model-use-cases/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiModelUseCase", id },
        { type: "AiModelUseCase", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Use case link updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update use case link";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiModelUseCase: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-model-use-cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiModelUseCase", id },
        { type: "AiModelUseCase", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Use case link deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete use case link";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiModelUseCasesQuery,
  useGetAiModelUseCaseQuery,
  useCreateAiModelUseCaseMutation,
  useUpdateAiModelUseCaseMutation,
  useDeleteAiModelUseCaseMutation,
} = aiModelUseCasesApi;
