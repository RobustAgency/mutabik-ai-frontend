import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  CommitteeAction,
  CreateCommitteeActionData,
  CommitteeActionFilters,
  UpdateCommitteeActionData,
} from "@/interfaces/CommitteeAction";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface CommitteeActionResponse {
  data: CommitteeAction;
  error: boolean;
  message: string;
}

export interface CommitteeActionListResponse {
  data: {
    current_page: number;
    data: CommitteeAction[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export const committeeActionsApi = createApi({
  reducerPath: "committeeActionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["CommitteeAction"],
  endpoints: (builder) => ({
    getCommitteeActions: builder.query<
      { data: CommitteeAction[]; pagination?: PaginationMeta },
      CommitteeActionFilters | void
    >({
      query: (filters = {}) => ({
        url: "/committee-actions",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "CommitteeAction" as const,
                id,
              })),
              { type: "CommitteeAction", id: "LIST" },
            ]
          : [{ type: "CommitteeAction", id: "LIST" }],
      transformResponse: (response: CommitteeActionListResponse) => {
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

    getCommitteeAction: builder.query<CommitteeAction, number>({
      query: (id) => ({
        url: `/committee-actions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CommitteeAction", id }],
      transformResponse: (response: CommitteeActionResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createCommitteeAction: builder.mutation<
      CommitteeAction,
      CreateCommitteeActionData
    >({
      query: (data) => ({
        url: "/committee-actions",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "CommitteeAction", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee action created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create Committee Action";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateCommitteeAction: builder.mutation<
      CommitteeAction,
      { id: number; data: UpdateCommitteeActionData }
    >({
      query: ({ id, data }) => ({
        url: `/committee-actions/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CommitteeAction", id },
        { type: "CommitteeAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee action updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update Committee Action";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteCommitteeAction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/committee-actions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CommitteeAction", id },
        { type: "CommitteeAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Committee action deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete Committee Action";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetCommitteeActionsQuery,
  useGetCommitteeActionQuery,
  useCreateCommitteeActionMutation,
  useUpdateCommitteeActionMutation,
  useDeleteCommitteeActionMutation,
} = committeeActionsApi;

