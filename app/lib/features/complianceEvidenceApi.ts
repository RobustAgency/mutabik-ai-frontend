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

const normaliseMeta = (payload?: ComplianceEvidenceListResponse["data"]): ComplianceEvidenceListMeta => {
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
      transformResponse: (response: ComplianceEvidenceListResponse) => {
        const list = response?.data?.data ?? [];
        const meta = normaliseMeta(response?.data);
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "ComplianceEvidence" as const, id })),
              { type: "ComplianceEvidence" as const, id: "LIST" },
            ]
          : [{ type: "ComplianceEvidence" as const, id: "LIST" }],
    }),
    getComplianceEvidence: builder.query<ComplianceEvidence, string | number>({
      query: (id) => ({
        url: `/compliance-evidences/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ComplianceEvidenceSingleResponse) => {
        return (response?.data as ComplianceEvidence) ?? (response as unknown as ComplianceEvidence);
      },
      providesTags: (result, _error, id) => [{ type: "ComplianceEvidence", id }],
    }),
    createComplianceEvidence: builder.mutation<unknown, CreateComplianceEvidenceRequest>({
      query: (data) => ({
        url: "/compliance-evidences",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "ComplianceEvidence", id: "LIST" }],
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
      invalidatesTags: (result, _error, { id }) => [
        { type: "ComplianceEvidence", id },
        { type: "ComplianceEvidence", id: "LIST" },
      ],
    }),
    deleteComplianceEvidence: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/compliance-evidences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ComplianceEvidence", id: "LIST" }],
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

