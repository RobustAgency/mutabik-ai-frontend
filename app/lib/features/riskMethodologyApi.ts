/**
 * Risk Methodology RTK Query API
 * Following frontend rules for RTK Query implementation
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
} from "@/lib/api/rtkQueryBase";
import {
  RiskMethodology,
  CreateRiskMethodologyData,
  UpdateRiskMethodologyData,
  RiskMethodologyFilters,
} from "@/interfaces/RiskMethodology";

interface RiskMethodologyResponse {
  data: RiskMethodology[];
  message: string;
  error: boolean;
}

interface SingleRiskMethodologyResponse {
  data: RiskMethodology;
  message: string;
  error: boolean;
}

export const riskMethodologyApi = createApi({
  reducerPath: "riskMethodologyApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["RiskMethodology"],
  endpoints: (builder) => ({
    getRiskMethodologies: builder.query<RiskMethodology[], RiskMethodologyFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.name) params.append("name", filters.name);
        if (filters?.effective_from) params.append("effective_from", filters.effective_from);
        if (filters?.effective_to) params.append("effective_to", filters.effective_to);
        if (filters?.per_page) params.append("per_page", filters.per_page.toString());

        const queryString = params.toString();
        return {
          url: queryString ? `/risk-methodologies?${queryString}` : "/risk-methodologies",
          method: "GET",
        };
      },
      transformResponse: (response: RiskMethodologyResponse) => {
        return response.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "RiskMethodology" as const, id })),
              { type: "RiskMethodology", id: "LIST" },
            ]
          : [{ type: "RiskMethodology", id: "LIST" }],
    }),

    getRiskMethodologyById: builder.query<RiskMethodology, number>({
      query: (id) => ({
        url: `/risk-methodologies/${id}`,
        method: "GET",
      }),
      transformResponse: (response: SingleRiskMethodologyResponse) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: "RiskMethodology", id }],
    }),

    createRiskMethodology: builder.mutation<RiskMethodology, CreateRiskMethodologyData>({
      query: (data) => ({
        url: "/risk-methodologies",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "RiskMethodology", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Risk Methodology created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create Risk Methodology";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateRiskMethodology: builder.mutation<
      RiskMethodology,
      { id: number; data: UpdateRiskMethodologyData }
    >({
      query: ({ id, data }) => ({
        url: `/risk-methodologies/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RiskMethodology", id },
        { type: "RiskMethodology", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Risk Methodology updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update Risk Methodology";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteRiskMethodology: builder.mutation<void, number>({
      query: (id) => ({
        url: `/risk-methodologies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RiskMethodology", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Risk Methodology deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete Risk Methodology";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetRiskMethodologiesQuery,
  useGetRiskMethodologyByIdQuery,
  useCreateRiskMethodologyMutation,
  useUpdateRiskMethodologyMutation,
  useDeleteRiskMethodologyMutation,
} = riskMethodologyApi;

