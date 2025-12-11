/**
 * AI Risk Register RTK Query API
 * Following frontend rules for RTK Query implementation
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";
import {
  AiRiskRegister,
  CreateAiRiskRegisterData,
  UpdateAiRiskRegisterData,
  AiRiskRegisterFilters,
} from "@/interfaces/AiRiskRegister";

interface AiRiskRegisterListResponse {
  error: boolean;
  message: string;
  data: {
    data: AiRiskRegister[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
}

interface AiRiskRegisterResponse {
  error: boolean;
  message: string;
  data: AiRiskRegister;
}

export const aiRiskRegisterApi = createApi({
  reducerPath: "aiRiskRegisterApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiRiskRegister"],
  endpoints: (builder) => ({
    getAiRiskRegisters: builder.query<
      { data: AiRiskRegister[]; meta: PaginationMeta },
      AiRiskRegisterFilters | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.per_page) params.append("per_page", filters.per_page.toString());

        const queryString = params.toString();
        return {
          url: queryString ? `/ai-risk-register?${queryString}` : "/ai-risk-register",
          method: "GET",
        };
      },
      transformResponse: (response: AiRiskRegisterListResponse) => {
        if (response.data) {
          return {
            data: response.data.data || [],
            meta: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
              from: response.data.from ?? 0,
              to: response.data.to ?? 0,
            },
          };
        }
        return {
          data: [],
          meta: {
            current_page: 1,
            per_page: 15,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          },
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "AiRiskRegister" as const, id })),
              { type: "AiRiskRegister", id: "LIST" },
            ]
          : [{ type: "AiRiskRegister", id: "LIST" }],
    }),

    getAiRiskRegisterById: builder.query<AiRiskRegister, number>({
      query: (id) => ({
        url: `/ai-risk-register/${id}`,
        method: "GET",
      }),
      transformResponse: (response: AiRiskRegisterResponse) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: "AiRiskRegister", id }],
    }),

    createAiRiskRegister: builder.mutation<AiRiskRegister, CreateAiRiskRegisterData>({
      query: (data) => ({
        url: "/ai-risk-register",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "AiRiskRegister", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Risk Register entry created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create AI Risk Register entry";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiRiskRegister: builder.mutation<
      AiRiskRegister,
      { id: number; data: UpdateAiRiskRegisterData }
    >({
      query: ({ id, data }) => ({
        url: `/ai-risk-register/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiRiskRegister", id },
        { type: "AiRiskRegister", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Risk Register entry updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update AI Risk Register entry";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiRiskRegister: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-risk-register/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AiRiskRegister", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Risk Register entry deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete AI Risk Register entry";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiRiskRegistersQuery,
  useGetAiRiskRegisterByIdQuery,
  useCreateAiRiskRegisterMutation,
  useUpdateAiRiskRegisterMutation,
  useDeleteAiRiskRegisterMutation,
} = aiRiskRegisterApi;

