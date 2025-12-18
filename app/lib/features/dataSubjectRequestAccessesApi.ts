import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  DataSubjectRequestAccess,
  CreateDSARData,
  DSARFilters,
} from "@/interfaces/DataSubjectRequestAccess";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface DSARListResponse {
  data: {
    current_page: number;
    data: DataSubjectRequestAccess[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export interface DSARItemResponse {
  data: DataSubjectRequestAccess;
  error: boolean;
  message: string;
}

export const dataSubjectRequestAccessesApi = createApi({
  reducerPath: "dataSubjectRequestAccessesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DataSubjectRequestAccess"],
  endpoints: (builder) => ({
    getDataSubjectRequestAccesses: builder.query<
      { data: DataSubjectRequestAccess[]; pagination?: PaginationMeta },
      DSARFilters | void
    >({
      query: (filters = {}) => ({
        url: "/data-subject-request-accesses",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "DataSubjectRequestAccess" as const,
                id,
              })),
              { type: "DataSubjectRequestAccess", id: "LIST" },
            ]
          : [{ type: "DataSubjectRequestAccess", id: "LIST" }],
      transformResponse: (response: DSARListResponse) => {
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

    getDataSubjectRequestAccess: builder.query<
      DataSubjectRequestAccess,
      number
    >({
      query: (id) => ({
        url: `/data-subject-request-accesses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "DataSubjectRequestAccess", id },
      ],
      transformResponse: (response: DSARItemResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createDataSubjectRequestAccess: builder.mutation<
      DataSubjectRequestAccess,
      CreateDSARData
    >({
      query: (data) => ({
        url: "/data-subject-request-accesses",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DataSubjectRequestAccess", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("DSAR request created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create DSAR request";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataSubjectRequestAccess: builder.mutation<
      DataSubjectRequestAccess,
      { id: number; data: Partial<CreateDSARData> }
    >({
      query: ({ id, data }) => ({
        url: `/data-subject-request-accesses/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DataSubjectRequestAccess", id },
        { type: "DataSubjectRequestAccess", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("DSAR request updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update DSAR request";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataSubjectRequestAccess: builder.mutation<void, number>({
      query: (id) => ({
        url: `/data-subject-request-accesses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DataSubjectRequestAccess", id },
        { type: "DataSubjectRequestAccess", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("DSAR request deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete DSAR request";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDataSubjectRequestAccessesQuery,
  useGetDataSubjectRequestAccessQuery,
  useCreateDataSubjectRequestAccessMutation,
  useUpdateDataSubjectRequestAccessMutation,
  useDeleteDataSubjectRequestAccessMutation,
} = dataSubjectRequestAccessesApi;


