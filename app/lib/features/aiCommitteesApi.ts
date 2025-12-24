import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  AiCommittee,
  CreateAiCommitteeData,
  AiCommitteeFilters,
  UpdateAiCommitteeData,
} from "@/interfaces/AiCommittee";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface AiCommitteeResponse {
  data: AiCommittee;
  error: boolean;
  message: string;
}

export interface AiCommitteeListResponse {
  data: {
    current_page: number;
    data: AiCommittee[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export const aiCommitteesApi = createApi({
  reducerPath: "aiCommitteesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiCommittee"],
  endpoints: (builder) => ({
    getAiCommittees: builder.query<
      { data: AiCommittee[]; pagination?: PaginationMeta },
      AiCommitteeFilters | void
    >({
      query: (filters = {}) => ({
        url: "/ai-committees",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "AiCommittee" as const,
                id,
              })),
              { type: "AiCommittee", id: "LIST" },
            ]
          : [{ type: "AiCommittee", id: "LIST" }],
      transformResponse: (response: AiCommitteeListResponse) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          const { current_page, per_page, total } = response.data;
          const from = (current_page - 1) * per_page + 1;
          const to = Math.min(current_page * per_page, total);
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
              from,
              to,
            },
          };
        }
        return { data: [] };
      },
    }),

    getAiCommittee: builder.query<AiCommittee, number>({
      query: (id) => ({
        url: `/ai-committees/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiCommittee", id }],
      transformResponse: (response: AiCommitteeResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createAiCommittee: builder.mutation<AiCommittee, CreateAiCommitteeData>({
      query: (data) => ({
        url: "/ai-committees",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "AiCommittee", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Committee created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create AI Committee";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiCommittee: builder.mutation<
      AiCommittee,
      { id: number; data: UpdateAiCommitteeData }
    >({
      query: ({ id, data }) => ({
        url: `/ai-committees/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiCommittee", id },
        { type: "AiCommittee", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Committee updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update AI Committee";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiCommittee: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-committees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiCommittee", id },
        { type: "AiCommittee", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Committee deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete AI Committee";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiCommitteesQuery,
  useGetAiCommitteeQuery,
  useCreateAiCommitteeMutation,
  useUpdateAiCommitteeMutation,
  useDeleteAiCommitteeMutation,
} = aiCommitteesApi;

