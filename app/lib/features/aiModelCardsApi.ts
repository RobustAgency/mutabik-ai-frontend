import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import type { AiModelCard, CreateAiModelCardData } from "@/service/app/aiModelCards";

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
      const result = await apiClient({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ message?: string; errors?: Record<string, string[]> }>; 
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || { message: err.message || "Request failed" },
        },
      };
    }
  };

export const aiModelCardsApi = createApi({
  reducerPath: "aiModelCardsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModelCard"],
  endpoints: (builder) => ({
    getAiModelCards: builder.query<AiModelCard[], void>({
      query: () => ({ url: "/ai-model-cards", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AiModelCard" as const, id })),
              { type: "AiModelCard" as const, id: "LIST" },
            ]
          : [{ type: "AiModelCard" as const, id: "LIST" }],
      transformResponse: (response: { data: { data: AiModelCard[] } | AiModelCard[] }) => {
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
          if (!error?.error?.data?.errors) toast.error(error?.error?.data?.message || "Create failed");
        }
      },
    }),

    updateAiModelCard: builder.mutation<AiModelCard, { id: number | string; data: Partial<CreateAiModelCardData> }>({
      query: ({ id, data }) => ({ url: `/ai-model-cards/${id}`, method: "PUT", data }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AiModelCard", id },
        { type: "AiModelCard", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model card updated");
        } catch (error: any) {
          if (!error?.error?.data?.errors) toast.error(error?.error?.data?.message || "Update failed");
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


