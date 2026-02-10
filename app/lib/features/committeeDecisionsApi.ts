import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import type {
  CommitteeDecision,
  CreateCommitteeDecisionData,
  CommitteeDecisionFilters,
  UpdateCommitteeDecisionData,
} from "@/interfaces/CommitteeDecision";
import {
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface CommitteeDecisionResponse {
  data: CommitteeDecision;
  error: boolean;
  message: string;
}

export interface CommitteeDecisionListResponse {
  data: {
    current_page: number;
    data: CommitteeDecision[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export const committeeDecisionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommitteeDecisions: builder.query<
      { data: CommitteeDecision[]; pagination?: PaginationMeta },
      CommitteeDecisionFilters | void
    >({
      query: (filters = {}) => ({
        url: "/committee-decisions",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "CommitteeDecision" as const,
                id,
              })),
              { type: "CommitteeDecision", id: "LIST" },
            ]
          : [{ type: "CommitteeDecision", id: "LIST" }],
      transformResponse: (response: CommitteeDecisionListResponse) => {
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

    getCommitteeDecision: builder.query<CommitteeDecision, number>({
      query: (id) => ({
        url: `/committee-decisions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CommitteeDecision", id }],
      transformResponse: (response: CommitteeDecisionResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createCommitteeDecision: builder.mutation<
      CommitteeDecision,
      CreateCommitteeDecisionData
    >({
      query: (data) => ({
        url: "/committee-decisions",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "CommitteeDecision", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee decision created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create Committee Decision";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateCommitteeDecision: builder.mutation<
      CommitteeDecision,
      { id: number; data: UpdateCommitteeDecisionData }
    >({
      query: ({ id, data }) => ({
        url: `/committee-decisions/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CommitteeDecision", id },
        { type: "CommitteeDecision", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee decision updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update Committee Decision";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteCommitteeDecision: builder.mutation<void, number>({
      query: (id) => ({
        url: `/committee-decisions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CommitteeDecision", id },
        { type: "CommitteeDecision", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee decision deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete Committee Decision";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetCommitteeDecisionsQuery,
  useGetCommitteeDecisionQuery,
  useCreateCommitteeDecisionMutation,
  useUpdateCommitteeDecisionMutation,
  useDeleteCommitteeDecisionMutation,
} = committeeDecisionsApi;

