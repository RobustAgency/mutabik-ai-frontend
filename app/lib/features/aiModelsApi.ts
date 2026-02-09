import { baseApi } from "@/lib/api/baseApi";
import type { AiModel, CreateAiModelData } from "@/service/app/aiModels";
import {
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
} from "@/lib/api/rtkQueryHelpers";

// Filter types for AI Models
export interface AiModelFilters {
  status?: string; // enum: OperationalStatus
  ownership_type?: string; // enum: OwnershipType
  regulatory_risk_classification?: string; // max:255
  owner?: string; // max:255
  from?: string; // date, before_or_equal:today
  to?: string; // date, after_or_equal:from
  per_page?: number; // min:1, max:100
}

export const aiModelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModels: builder.query<AiModel[], AiModelFilters | void>({
      query: (filters = {}) => ({
        url: "/ai-models",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AiModel" as const, id })),
              { type: "AiModel", id: "LIST" },
            ]
          : [{ type: "AiModel", id: "LIST" }],
      transformResponse: (response: {
        data: { data: AiModel[] };
        error?: boolean;
        message?: string;
      }) => {
        if (response.data?.data) {
          return response.data.data;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),

    getAiModel: builder.query<AiModel, number>({
      query: (id) => ({
        url: `/ai-models/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiModel", id }],
      transformResponse: (response: {
        data: AiModel;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as AiModel;
      },
    }),

    createAiModel: builder.mutation<AiModel, CreateAiModelData>({
      query: (data) => ({
        url: "/ai-models",
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateListTags("AiModel"),
      onQueryStarted: createMutationToastHandler(
        "AI model created successfully",
        "Failed to create AI model"
      ),
    }),

    updateAiModel: builder.mutation<
      AiModel,
      { id: number; data: Partial<CreateAiModelData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-models/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("AiModel"),
      onQueryStarted: createMutationToastHandler(
        "AI model updated successfully",
        "Failed to update AI model"
      ),
    }),

    deleteAiModel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateItemAndListTags("AiModel"),
      onQueryStarted: createDeleteToastHandler(
        "AI model deleted successfully",
        "Failed to delete AI model"
      ),
    }),
  }),
});

export const {
  useGetAiModelsQuery,
  useGetAiModelQuery,
  useCreateAiModelMutation,
  useUpdateAiModelMutation,
  useDeleteAiModelMutation,
} = aiModelsApi;
