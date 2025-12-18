import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  RecordOfProcessingActivity,
  CreateROPAData,
  ROPAFilters,
} from "@/interfaces/RecordOfProcessingActivity";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface ROPAResponse {
  data: RecordOfProcessingActivity;
  error: boolean;
  message: string;
}

export interface ROPAListResponse {
  data: {
    current_page: number;
    data: RecordOfProcessingActivity[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export const recordOfProcessingActivitiesApi = createApi({
  reducerPath: "recordOfProcessingActivitiesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["RecordOfProcessingActivity"],
  endpoints: (builder) => ({
    getRecordOfProcessingActivities: builder.query<
      { data: RecordOfProcessingActivity[]; pagination?: PaginationMeta },
      ROPAFilters | void
    >({
      query: (filters = {}) => ({
        url: "/record-of-processing-activities",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "RecordOfProcessingActivity" as const,
                id,
              })),
              { type: "RecordOfProcessingActivity", id: "LIST" },
            ]
          : [{ type: "RecordOfProcessingActivity", id: "LIST" }],
      transformResponse: (response: ROPAListResponse) => {
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

    getRecordOfProcessingActivity: builder.query<
      RecordOfProcessingActivity,
      number
    >({
      query: (id) => ({
        url: `/record-of-processing-activities/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "RecordOfProcessingActivity", id },
      ],
      transformResponse: (response: ROPAResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createRecordOfProcessingActivity: builder.mutation<
      RecordOfProcessingActivity,
      CreateROPAData
    >({
      query: (data) => ({
        url: "/record-of-processing-activities",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "RecordOfProcessingActivity", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Processing activity created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create processing activity";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateRecordOfProcessingActivity: builder.mutation<
      RecordOfProcessingActivity,
      { id: number; data: Partial<CreateROPAData> }
    >({
      query: ({ id, data }) => ({
        url: `/record-of-processing-activities/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RecordOfProcessingActivity", id },
        { type: "RecordOfProcessingActivity", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Processing activity updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update processing activity";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteRecordOfProcessingActivity: builder.mutation<void, number>({
      query: (id) => ({
        url: `/record-of-processing-activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RecordOfProcessingActivity", id },
        { type: "RecordOfProcessingActivity", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Processing activity deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete processing activity";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetRecordOfProcessingActivitiesQuery,
  useGetRecordOfProcessingActivityQuery,
  useCreateRecordOfProcessingActivityMutation,
  useUpdateRecordOfProcessingActivityMutation,
  useDeleteRecordOfProcessingActivityMutation,
} = recordOfProcessingActivitiesApi;

