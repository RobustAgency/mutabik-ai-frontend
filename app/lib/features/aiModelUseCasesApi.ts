import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError } from "@/lib/api/rtkQueryBase";

// Type for AI Model Use Case
export interface AiModelUseCase {
  id: number;
  ai_model_id: number;
  use_case_id: number;
  ai_model_version_id: number;
  relationship_type: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string | null;
  // Include related data
  ai_model?: {
    id: number;
    name: string;
    description?: string;
    primary_category?: string;
    type?: string;
  };
  use_case?: {
    id: number;
    name?: string;
    title?: string;
    description?: string;
    status: string;
    business_domain: string;
  };
  ai_model_version?: {
    id: number;
    version_number?: string;
    version?: string;
  };
}

// Filter types for AI Model Use Cases
export interface AiModelUseCaseFilters {
  ai_model_id?: number; // exists:ai_models,id
  per_page?: number; // min:1
}

// Type for creating AI Model Use Case
export interface CreateAiModelUseCaseData {
  ai_model_id: number;
  use_case_id: number;
  ai_model_version_id: number;
  relationship_type: string;
  created_by?: string;
  updated_by?: string | null;
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

export const aiModelUseCasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModelUseCases: builder.query<
      AiModelUseCase[],
      AiModelUseCaseFilters | number | void
    >({
      query: (filtersOrId) => {
        // Support both old API (number) and new API (filters object)
        const params =
          typeof filtersOrId === "number"
            ? { ai_model_id: filtersOrId }
            : filtersOrId || {};
        return {
          url: "/ai-model-use-cases",
          method: "GET",
          params,
        };
      },
      providesTags: (result, error, aiModelId) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AiModelUseCase" as const,
                id,
              })),
              {
                type: "AiModelUseCase",
                id: aiModelId ? `LIST-${aiModelId}` : "LIST",
              },
            ]
          : [
              {
                type: "AiModelUseCase",
                id: aiModelId ? `LIST-${aiModelId}` : "LIST",
              },
            ],
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
        method: "POST",
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
