import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import type {
  CommitteeMeeting,
  CreateCommitteeMeetingData,
  CommitteeMeetingFilters,
  UpdateCommitteeMeetingData,
} from "@/interfaces/CommitteeMeeting";
import {
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface CommitteeMeetingResponse {
  data: CommitteeMeeting;
  error: boolean;
  message: string;
}

export interface CommitteeMeetingListResponse {
  data: {
    current_page: number;
    data: CommitteeMeeting[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export const committeeMeetingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommitteeMeetings: builder.query<
      { data: CommitteeMeeting[]; pagination?: PaginationMeta },
      CommitteeMeetingFilters | void
    >({
      query: (filters = {}) => ({
        url: "/committee-meetings",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "CommitteeMeeting" as const,
                id,
              })),
              { type: "CommitteeMeeting", id: "LIST" },
            ]
          : [{ type: "CommitteeMeeting", id: "LIST" }],
      transformResponse: (response: CommitteeMeetingListResponse) => {
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

    getCommitteeMeeting: builder.query<CommitteeMeeting, number>({
      query: (id) => ({
        url: `/committee-meetings/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CommitteeMeeting", id }],
      transformResponse: (response: CommitteeMeetingResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createCommitteeMeeting: builder.mutation<
      CommitteeMeeting,
      CreateCommitteeMeetingData
    >({
      query: (data) => ({
        url: "/committee-meetings",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "CommitteeMeeting", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee meeting created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create Committee Meeting";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateCommitteeMeeting: builder.mutation<
      CommitteeMeeting,
      { id: number; data: UpdateCommitteeMeetingData }
    >({
      query: ({ id, data }) => ({
        url: `/committee-meetings/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CommitteeMeeting", id },
        { type: "CommitteeMeeting", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee meeting updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update Committee Meeting";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteCommitteeMeeting: builder.mutation<void, number>({
      query: (id) => ({
        url: `/committee-meetings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CommitteeMeeting", id },
        { type: "CommitteeMeeting", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee meeting deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete Committee Meeting";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetCommitteeMeetingsQuery,
  useGetCommitteeMeetingQuery,
  useCreateCommitteeMeetingMutation,
  useUpdateCommitteeMeetingMutation,
  useDeleteCommitteeMeetingMutation,
} = committeeMeetingsApi;

