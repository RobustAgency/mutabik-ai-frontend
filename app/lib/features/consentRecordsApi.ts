import { baseApi } from "@/lib/api/baseApi";
import type {
  ConsentRecord,
  CreateConsentRecordData,
  ConsentRecordFilters,
} from "@/interfaces/ConsentRecord";
import { PaginationMeta } from "@/lib/api/rtkQueryBase";
import {
  transformListResponseWithCalculatedPagination,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
} from "@/lib/api/rtkQueryHelpers";

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

export const consentRecordsApi = baseApi.injectEndpoints({
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
      transformResponse: transformListResponseWithCalculatedPagination<ConsentRecord>,
      providesTags: (result) => createListTags(result, "ConsentRecord"),
    }),

    getConsentRecord: builder.query<ConsentRecord, number>({
      query: (id) => ({
        url: `/consent-records/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<ConsentRecord>,
      providesTags: createItemTags("ConsentRecord"),
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
      invalidatesTags: createInvalidateListTags("ConsentRecord"),
      onQueryStarted: createMutationToastHandler(
        "Consent record created successfully",
        "Failed to create consent record"
      ),
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
      invalidatesTags: createInvalidateItemAndListTags("ConsentRecord"),
      onQueryStarted: createMutationToastHandler(
        "Consent record updated successfully",
        "Failed to update consent record"
      ),
    }),

    deleteConsentRecord: builder.mutation<void, number>({
      query: (id) => ({
        url: `/consent-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateItemAndListTags("ConsentRecord"),
      onQueryStarted: createDeleteToastHandler(
        "Consent record deleted successfully",
        "Failed to delete consent record"
      ),
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


