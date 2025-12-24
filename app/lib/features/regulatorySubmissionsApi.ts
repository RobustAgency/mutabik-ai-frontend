import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  RegulatorySubmission,
  RegulatorySubmissionFilters,
  CreateRegulatorySubmissionRequest,
  UpdateRegulatorySubmissionRequest,
  RegulatorySubmissionListMeta,
  RegulatorySubmissionListResponse,
  RegulatorySubmissionSingleResponse,
} from "@/interfaces/RegulatorySubmission";

const normaliseMeta = (payload?: RegulatorySubmissionListResponse["data"]): RegulatorySubmissionListMeta => {
  if (!payload) {
    return { current_page: 1, per_page: 0, total: 0, last_page: 1 };
  }
  if (payload.meta) {
    return {
      current_page: payload.meta.current_page ?? 1,
      per_page: payload.meta.per_page ?? 0,
      total: payload.meta.total ?? 0,
      last_page: payload.meta.last_page ?? payload.meta.current_page ?? 1,
    };
  }
  return {
    current_page: payload.current_page ?? 1,
    per_page: payload.per_page ?? 0,
    total: payload.total ?? 0,
    last_page: payload.last_page ?? payload.current_page ?? 1,
  };
};

export const regulatorySubmissionsApi = createApi({
  reducerPath: "regulatorySubmissionsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["RegulatorySubmission"],
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
      transformResponse: (response: RegulatorySubmissionListResponse) => {
        const list = response?.data?.data ?? [];
        const meta = normaliseMeta(response?.data);
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "RegulatorySubmission" as const, id })),
              { type: "RegulatorySubmission" as const, id: "LIST" },
            ]
          : [{ type: "RegulatorySubmission" as const, id: "LIST" }],
    }),
    getRegulatorySubmission: builder.query<RegulatorySubmission, string | number>({
      query: (id) => ({
        url: `/regulatory-submissions/${id}`,
        method: "GET",
      }),
      transformResponse: (response: RegulatorySubmissionSingleResponse) => {
        return (response?.data as RegulatorySubmission) ?? (response as unknown as RegulatorySubmission);
      },
      providesTags: (result, _error, id) => [{ type: "RegulatorySubmission", id }],
    }),
    createRegulatorySubmission: builder.mutation<unknown, CreateRegulatorySubmissionRequest>({
      query: (data) => ({
        url: "/regulatory-submissions",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "RegulatorySubmission", id: "LIST" }],
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
      invalidatesTags: (result, _error, { id }) => [
        { type: "RegulatorySubmission", id },
        { type: "RegulatorySubmission", id: "LIST" },
      ],
    }),
    deleteRegulatorySubmission: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/regulatory-submissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RegulatorySubmission", id: "LIST" }],
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

