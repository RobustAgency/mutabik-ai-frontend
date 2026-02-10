/**
 * AI Risk Treatment RTK Query API
 * Following frontend rules for RTK Query implementation
 */

import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import {
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";
import {
  AiRiskTreatment,
  CreateAiRiskTreatmentData,
  UpdateAiRiskTreatmentData,
  AiRiskTreatmentFilters,
} from "@/interfaces/AiRiskTreatment";

interface AiRiskTreatmentListResponse {
  data: {
    data: AiRiskTreatment[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
  message: string;
  error: boolean;
}

interface SingleAiRiskTreatmentResponse {
  data: AiRiskTreatment;
  message: string;
  error: boolean;
}

export const aiRiskTreatmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiRiskTreatments: builder.query<
      { data: AiRiskTreatment[]; pagination: PaginationMeta },
      AiRiskTreatmentFilters | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.treatment_type) params.append("treatment_type", filters.treatment_type);
        if (filters?.status) params.append("status", filters.status);
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.per_page) params.append("per_page", filters.per_page.toString());

        const queryString = params.toString();
        return {
          url: queryString ? `/ai-risk-treatments?${queryString}` : "/ai-risk-treatments",
          method: "GET",
        };
      },
      transformResponse: (response: AiRiskTreatmentListResponse) => {
        if (response?.data?.data && Array.isArray(response.data.data)) {
          return {
            data: response.data.data,
            pagination: {
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
          pagination: {
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
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "AiRiskTreatment" as const, id })),
              { type: "AiRiskTreatment", id: "LIST" },
            ]
          : [{ type: "AiRiskTreatment", id: "LIST" }],
    }),

    getAiRiskTreatmentById: builder.query<AiRiskTreatment, number>({
      query: (id) => ({
        url: `/ai-risk-treatments/${id}`,
        method: "GET",
      }),
      transformResponse: (response: SingleAiRiskTreatmentResponse) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: "AiRiskTreatment", id }],
    }),

    createAiRiskTreatment: builder.mutation<AiRiskTreatment, CreateAiRiskTreatmentData>({
      query: (data) => ({
        url: "/ai-risk-treatments",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "AiRiskTreatment", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Risk Treatment created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create AI Risk Treatment";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiRiskTreatment: builder.mutation<
      AiRiskTreatment,
      { id: number; data: UpdateAiRiskTreatmentData }
    >({
      query: ({ id, data }) => ({
        url: `/ai-risk-treatments/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiRiskTreatment", id },
        { type: "AiRiskTreatment", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Risk Treatment updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update AI Risk Treatment";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiRiskTreatment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-risk-treatments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AiRiskTreatment", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Risk Treatment deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete AI Risk Treatment";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiRiskTreatmentsQuery,
  useGetAiRiskTreatmentByIdQuery,
  useCreateAiRiskTreatmentMutation,
  useUpdateAiRiskTreatmentMutation,
  useDeleteAiRiskTreatmentMutation,
} = aiRiskTreatmentApi;

