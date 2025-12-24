import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  CommitteeMembership,
  CreateCommitteeMembershipData,
  CommitteeMembershipFilters,
  UpdateCommitteeMembershipData,
} from "@/interfaces/CommitteeMembership";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface CommitteeMembershipResponse {
  data: CommitteeMembership;
  error: boolean;
  message: string;
}

export interface CommitteeMembershipListResponse {
  data: {
    current_page: number;
    data: CommitteeMembership[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export const committeeMembershipsApi = createApi({
  reducerPath: "committeeMembershipsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["CommitteeMembership"],
  endpoints: (builder) => ({
    getCommitteeMemberships: builder.query<
      { data: CommitteeMembership[]; pagination?: PaginationMeta },
      CommitteeMembershipFilters | void
    >({
      query: (filters = {}) => ({
        url: "/committee-memberships",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "CommitteeMembership" as const,
                id,
              })),
              { type: "CommitteeMembership", id: "LIST" },
            ]
          : [{ type: "CommitteeMembership", id: "LIST" }],
      transformResponse: (response: CommitteeMembershipListResponse) => {
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

    getCommitteeMembership: builder.query<CommitteeMembership, number>({
      query: (id) => ({
        url: `/committee-memberships/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CommitteeMembership", id }],
      transformResponse: (response: CommitteeMembershipResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createCommitteeMembership: builder.mutation<
      CommitteeMembership,
      CreateCommitteeMembershipData
    >({
      query: (data) => ({
        url: "/committee-memberships",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "CommitteeMembership", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee membership created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create committee membership";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateCommitteeMembership: builder.mutation<
      CommitteeMembership,
      { id: number; data: UpdateCommitteeMembershipData }
    >({
      query: ({ id, data }) => ({
        url: `/committee-memberships/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CommitteeMembership", id },
        { type: "CommitteeMembership", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee membership updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update committee membership";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteCommitteeMembership: builder.mutation<void, number>({
      query: (id) => ({
        url: `/committee-memberships/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CommitteeMembership", id },
        { type: "CommitteeMembership", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee membership deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete committee membership";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetCommitteeMembershipsQuery,
  useGetCommitteeMembershipQuery,
  useCreateCommitteeMembershipMutation,
  useUpdateCommitteeMembershipMutation,
  useDeleteCommitteeMembershipMutation,
} = committeeMembershipsApi;

