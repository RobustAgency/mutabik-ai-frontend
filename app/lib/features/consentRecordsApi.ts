import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type {
  ConsentRecord,
  CreateConsentRecordData,
  ConsentRecordFilters,
} from "@/interfaces/ConsentRecord";
import {
  axiosBaseQuery,
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface ConsentRecordListResponse {
  data: {
    current_page: number;
    data: ConsentRecord[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export interface ConsentRecordItemResponse {
  data: ConsentRecord;
  error: boolean;
  message: string;
}

export const consentRecordsApi = createApi({
  reducerPath: "consentRecordsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ConsentRecord"],
  endpoints: (builder) => ({
    getConsentRecords: builder.query<
      { data: ConsentRecord[]; pagination?: PaginationMeta },
      ConsentRecordFilters | void
    >({
      query: (filters = {}) => ({
        url: "/consent-records",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ConsentRecord" as const,
                id,
              })),
              { type: "ConsentRecord", id: "LIST" },
            ]
          : [{ type: "ConsentRecord", id: "LIST" }],
      transformResponse: (response: ConsentRecordListResponse) => {
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

    getConsentRecord: builder.query<ConsentRecord, number>({
      query: (id) => ({
        url: `/consent-records/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "ConsentRecord", id },
      ],
      transformResponse: (response: ConsentRecordItemResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createConsentRecord: builder.mutation<
      ConsentRecord,
      CreateConsentRecordData
    >({
      query: (data) => ({
        url: "/consent-records",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "ConsentRecord", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent record created successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create consent record";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateConsentRecord: builder.mutation<
      ConsentRecord,
      { id: number; data: Partial<CreateConsentRecordData> }
    >({
      query: ({ id, data }) => ({
        url: `/consent-records/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ConsentRecord", id },
        { type: "ConsentRecord", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent record updated successfully");
        } catch (error: any) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update consent record";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteConsentRecord: builder.mutation<void, number>({
      query: (id) => ({
        url: `/consent-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ConsentRecord", id },
        { type: "ConsentRecord", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent record deleted successfully");
        } catch (error: any) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete consent record";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetConsentRecordsQuery,
  useGetConsentRecordQuery,
  useCreateConsentRecordMutation,
  useUpdateConsentRecordMutation,
  useDeleteConsentRecordMutation,
} = consentRecordsApi;


