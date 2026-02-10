import { baseApi } from "@/lib/api/baseApi";
import type {
  AiModelCard,
  CreateAiModelCardData,
} from "@/service/app/aiModelCards";
import {
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
} from "@/lib/api/rtkQueryHelpers";

// Filter types for AI Model Cards
export interface AiModelCardFilters {
  status?: string | null;
  publication_status?: string | null;
  owner?: string | null;
  from?: string | null; // date
  to?: string | null; // date
  creator_role?: string | null;
  format?: string | null;
  per_page?: number | null; // min:1, max:100
}

export const aiModelCardsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModelCards: builder.query<AiModelCard[], AiModelCardFilters | void>({
      query: (filters = {}) => ({
        url: "/ai-model-cards",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AiModelCard" as const,
                id,
              })),
              { type: "AiModelCard" as const, id: "LIST" },
            ]
          : [{ type: "AiModelCard" as const, id: "LIST" }],
      transformResponse: (response: {
        data: { data: AiModelCard[] } | AiModelCard[];
      }) => {
        if (Array.isArray(response?.data)) return response.data;
        if ((response?.data as any)?.data) return (response.data as any).data;
        return [];
      },
    }),

    getAiModelCard: builder.query<AiModelCard, number | string>({
      query: (id) => ({ url: `/ai-model-cards/${id}`, method: "GET" }),
      providesTags: (_result, _e, id) => [{ type: "AiModelCard", id }],
      transformResponse: (response: { data: AiModelCard }) => response.data,
    }),

    createAiModelCard: builder.mutation<AiModelCard, CreateAiModelCardData>({
      query: (data) => ({ url: "/ai-model-cards", method: "POST", data }),
      invalidatesTags: createInvalidateListTags("AiModelCard"),
      onQueryStarted: createMutationToastHandler(
        "Model card created",
        "Create failed"
      ),
    }),

    updateAiModelCard: builder.mutation<
      AiModelCard,
      { id: number | string; data: Partial<CreateAiModelCardData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-model-cards/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("AiModelCard"),
      onQueryStarted: createMutationToastHandler(
        "Model card updated",
        "Update failed"
      ),
    }),
  }),
});

export const {
  useGetAiModelCardsQuery,
  useGetAiModelCardQuery,
  useCreateAiModelCardMutation,
  useUpdateAiModelCardMutation,
} = aiModelCardsApi;
