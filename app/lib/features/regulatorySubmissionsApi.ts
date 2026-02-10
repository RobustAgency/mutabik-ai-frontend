import { baseApi } from "@/lib/api/baseApi";
import {
  RegulatorySubmission,
  RegulatorySubmissionFilters,
  CreateRegulatorySubmissionRequest,
  UpdateRegulatorySubmissionRequest,
  RegulatorySubmissionListMeta,
} from "@/interfaces/RegulatorySubmission";
import {
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
} from "@/lib/api/rtkQueryHelpers";

export const regulatorySubmissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRegulatorySubmissions: builder.query<
      { data: RegulatorySubmission[]; meta: RegulatorySubmissionListMeta },
      RegulatorySubmissionFilters | void
    >({
      query: (filters) => ({
        url: "/regulatory-submissions",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithMeta<RegulatorySubmission>,
      providesTags: (result) => createListTags(result, "RegulatorySubmission"),
    }),
    getRegulatorySubmission: builder.query<RegulatorySubmission, string | number>({
      query: (id) => ({
        url: `/regulatory-submissions/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<RegulatorySubmission>,
      providesTags: createItemTags("RegulatorySubmission"),
    }),
    createRegulatorySubmission: builder.mutation<unknown, CreateRegulatorySubmissionRequest>({
      query: (data) => ({
        url: "/regulatory-submissions",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("RegulatorySubmission"),
    }),
    updateRegulatorySubmission: builder.mutation<
      unknown,
      { id: string | number; data: UpdateRegulatorySubmissionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/regulatory-submissions/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("RegulatorySubmission"),
    }),
    deleteRegulatorySubmission: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/regulatory-submissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateListTags("RegulatorySubmission"),
    }),
  }),
});

export const {
  useGetRegulatorySubmissionsQuery,
  useGetRegulatorySubmissionQuery,
  useCreateRegulatorySubmissionMutation,
  useUpdateRegulatorySubmissionMutation,
  useDeleteRegulatorySubmissionMutation,
} = regulatorySubmissionsApi;

