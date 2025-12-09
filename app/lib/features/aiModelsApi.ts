import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type { AiModel, CreateAiModelData } from "@/service/app/aiModels";
import { axiosBaseQuery, MutationError } from "@/lib/api/rtkQueryBase";

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

export const aiModelsApi = createApi({
  reducerPath: "aiModelsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModel"],
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
      invalidatesTags: [{ type: "AiModel", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI model created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          // Don't show toast here - let component handle validation errors
          // Only show toast for unexpected errors
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create AI model";
            toast.error(errorMessage);
          }
        }
      },
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
      invalidatesTags: (result, error, { id }) => [
        { type: "AiModel", id },
        { type: "AiModel", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI model updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update AI model";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiModel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiModel", id },
        { type: "AiModel", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI model deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete AI model";
          toast.error(errorMessage);
        }
      },
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
