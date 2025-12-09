import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors } from "@/lib/api/rtkQueryBase";
import type {
  AiModelCard,
  CreateAiModelCardData,
} from "@/service/app/aiModelCards";

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

export const aiModelCardsApi = createApi({
  reducerPath: "aiModelCardsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModelCard"],
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
              ...result.map(({ id }) => ({ type: "AiModelCard" as const, id })),
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
      invalidatesTags: [{ type: "AiModelCard", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model card created");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Create failed";
            toast.error(errorMessage);
          }
        }
      },
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
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AiModelCard", id },
        { type: "AiModelCard", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model card updated");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Update failed";
            toast.error(errorMessage);
          }
        }
      },
    }),
  }),
});

export const {
  useGetAiModelCardsQuery,
  useGetAiModelCardQuery,
  useCreateAiModelCardMutation,
  useUpdateAiModelCardMutation,
} = aiModelCardsApi;
