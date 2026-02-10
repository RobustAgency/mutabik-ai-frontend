/**
 * Risk Methodology RTK Query API
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
  RiskMethodology,
  CreateRiskMethodologyData,
  UpdateRiskMethodologyData,
  RiskMethodologyFilters,
} from "@/interfaces/RiskMethodology";

type RiskMethodologyResponse =
  | {
      data: RiskMethodology[];
      message: string;
      error: boolean;
    }
  | {
      data: {
        data: RiskMethodology[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
      };
      message: string;
      error: boolean;
    };

interface SingleRiskMethodologyResponse {
  data: RiskMethodology;
  message: string;
  error: boolean;
}

export const riskMethodologyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiskMethodologies: builder.query<
      { data: RiskMethodology[]; pagination: PaginationMeta },
      RiskMethodologyFilters | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.name) params.append("name", filters.name);
        if (filters?.effective_from) params.append("effective_from", filters.effective_from);
        if (filters?.effective_to) params.append("effective_to", filters.effective_to);
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.per_page) params.append("per_page", filters.per_page.toString());

        const queryString = params.toString();
        return {
          url: queryString ? `/risk-methodologies?${queryString}` : "/risk-methodologies",
          method: "GET",
        };
      },
      transformResponse: (response: RiskMethodologyResponse) => {
        // Handle both flat array and paginated { data: { data: [...] } } shapes
        if (Array.isArray((response as any)?.data)) {
          // Non-paginated response
          return {
            data: (response as { data: RiskMethodology[] }).data,
            pagination: {
              current_page: 1,
              per_page: (response as { data: RiskMethodology[] }).data.length,
              total: (response as { data: RiskMethodology[] }).data.length,
              last_page: 1,
              from: 1,
              to: (response as { data: RiskMethodology[] }).data.length,
            },
          };
        }
        if (
          (response as any)?.data?.data &&
          Array.isArray((response as any).data.data)
        ) {
          const paginatedResponse = response as {
            data: {
              data: RiskMethodology[];
              current_page?: number;
              last_page?: number;
              per_page?: number;
              total?: number;
            };
          };
          return {
            data: paginatedResponse.data.data,
            pagination: {
              current_page: paginatedResponse.data.current_page ?? 1,
              per_page: paginatedResponse.data.per_page ?? 15,
              total: paginatedResponse.data.total ?? 0,
              last_page: paginatedResponse.data.last_page ?? 1,
              from: ((paginatedResponse.data.current_page ?? 1) - 1) * (paginatedResponse.data.per_page ?? 15) + 1,
              to: Math.min(
                (paginatedResponse.data.current_page ?? 1) * (paginatedResponse.data.per_page ?? 15),
                paginatedResponse.data.total ?? 0
              ),
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
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "RiskMethodology" as const, id })),
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

