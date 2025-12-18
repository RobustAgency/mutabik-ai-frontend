import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  DataProtectionImpactAssessment,
  CreateDPIAData,
  DPIAFilters,
} from "@/interfaces/DataProtectionImpactAssessment";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface DPIAListResponse {
  data: {
    current_page: number;
    data: DataProtectionImpactAssessment[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export interface DPIAItemResponse {
  data: DataProtectionImpactAssessment;
  error: boolean;
  message: string;
}

export const dataProtectionImpactAssessmentsApi = createApi({
  reducerPath: "dataProtectionImpactAssessmentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DPIA"],
  endpoints: (builder) => ({
    getDataProtectionImpactAssessments: builder.query<
      { data: DataProtectionImpactAssessment[]; pagination?: PaginationMeta },
      DPIAFilters | void
    >({
      query: (filters = {}) => ({
        url: "/data-protection-impact-assessments",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "DPIA" as const, id })),
              { type: "DPIA", id: "LIST" },
            ]
          : [{ type: "DPIA", id: "LIST" }],
      transformResponse: (response: DPIAListResponse) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
            },
          };
        }
        return { data: [] };
      },
    }),

    getDataProtectionImpactAssessment: builder.query<
      DataProtectionImpactAssessment,
      number
    >({
      query: (id) => ({
        url: `/data-protection-impact-assessments/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DPIA", id }],
      transformResponse: (response: DPIAItemResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createDataProtectionImpactAssessment: builder.mutation<
      DataProtectionImpactAssessment,
      CreateDPIAData
    >({
      query: (data) => ({
        url: "/data-protection-impact-assessments",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DPIA", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("DPIA created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create DPIA";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataProtectionImpactAssessment: builder.mutation<
      DataProtectionImpactAssessment,
      { id: number; data: Partial<CreateDPIAData> }
    >({
      query: ({ id, data }) => ({
        url: `/data-protection-impact-assessments/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DPIA", id },
        { type: "DPIA", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("DPIA updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update DPIA";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataProtectionImpactAssessment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/data-protection-impact-assessments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DPIA", id },
        { type: "DPIA", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("DPIA deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete DPIA";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDataProtectionImpactAssessmentsQuery,
  useGetDataProtectionImpactAssessmentQuery,
  useCreateDataProtectionImpactAssessmentMutation,
  useUpdateDataProtectionImpactAssessmentMutation,
  useDeleteDataProtectionImpactAssessmentMutation,
} = dataProtectionImpactAssessmentsApi;


