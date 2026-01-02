import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  ComplianceEvidence,
  ComplianceEvidenceFilters,
  CreateComplianceEvidenceRequest,
  UpdateComplianceEvidenceRequest,
  ComplianceEvidenceListMeta,
  ComplianceEvidenceListResponse,
  ComplianceEvidenceSingleResponse,
} from "@/interfaces/ComplianceEvidence";
import {
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  ListResponseWithMeta,
  SingleItemResponse,
  ListMeta,
} from "@/lib/api/rtkQueryHelpers";

export const complianceEvidenceApi = createApi({
  reducerPath: "complianceEvidenceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ComplianceEvidence"],
  endpoints: (builder) => ({
    getComplianceEvidences: builder.query<
      { data: ComplianceEvidence[]; meta: ComplianceEvidenceListMeta },
      ComplianceEvidenceFilters | void
    >({
      query: (filters) => ({
        url: "/compliance-evidences",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithMeta<ComplianceEvidence>,
      providesTags: (result) => createListTags(result, "ComplianceEvidence"),
    }),
    getComplianceEvidence: builder.query<ComplianceEvidence, string | number>({
      query: (id) => ({
        url: `/compliance-evidences/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<ComplianceEvidence>,
      providesTags: createItemTags("ComplianceEvidence"),
    }),
    createComplianceEvidence: builder.mutation<unknown, CreateComplianceEvidenceRequest>({
      query: (data) => ({
        url: "/compliance-evidences",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("ComplianceEvidence"),
    }),
    updateComplianceEvidence: builder.mutation<
      unknown,
      { id: string | number; data: UpdateComplianceEvidenceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/compliance-evidences/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("ComplianceEvidence"),
    }),
    deleteComplianceEvidence: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/compliance-evidences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateListTags("ComplianceEvidence"),
    }),
  }),
});

export const {
  useGetComplianceEvidencesQuery,
  useGetComplianceEvidenceQuery,
  useCreateComplianceEvidenceMutation,
  useUpdateComplianceEvidenceMutation,
  useDeleteComplianceEvidenceMutation,
} = complianceEvidenceApi;

