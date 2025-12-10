import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

export type AgreementType =
  | "msa"
  | "dpa"
  | "order_form"
  | "addendum"
  | "sla"
  | "other";

export type AgreementStatus = "draft" | "active" | "lapsed" | "terminated";

export type TrainingOptOut = "yes" | "no" | "not_applicable";
export type AuditRights = "yes" | "no" | "limited";
export type TransferMechanism =
  | "adequacy"
  | "sccs"
  | "bcrs"
  | "dpa_addendum"
  | "derogation"
  | "none";

export interface SlaTerms {
  availability_target_pct?: number;
  latency_p95_ms?: number;
  support_tier?: "standard" | "premium" | "enterprise" | string;
  breach_definition?: string;
  credit_schedule_ref?: string;
  monitoring_ref?: string;
}

export interface AgreementVendorSummary {
  id: number;
  vendor_name: string;
  legal_name: string;
}

export interface Agreement {
  id: number;
  organization_id: number;
  vendor_id: number;
  agreement_type: AgreementType;
  status: AgreementStatus;
  effective_from: string; // ISO8601
  effective_to: string; // ISO8601
  training_opt_out?: TrainingOptOut | null;
  audit_rights?: AuditRights | null;
  transfer_mechanism?: TransferMechanism | null;
  sla_terms?: SlaTerms | null;
  doc_ref: string;
  created_at: string;
  updated_at: string;
  vendor?: AgreementVendorSummary;
}

export interface AgreementFilters {
  page?: number;
  per_page?: number;
  vendor_id?: number;
}

export interface CreateAgreementData {
  vendor_id: number;
  agreement_type: AgreementType;
  status: AgreementStatus;
  effective_from: string; // ISO8601
  effective_to: string; // ISO8601
  training_opt_out?: TrainingOptOut | null;
  audit_rights?: AuditRights | null;
  transfer_mechanism?: TransferMechanism | null;
  sla_terms?: SlaTerms | null;
  doc_ref: string;
}

export const agreementsApi = createApi({
  reducerPath: "agreementsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Agreement"],
  endpoints: (builder) => ({
    getAgreements: builder.query<
      { data: Agreement[]; pagination: PaginationMeta },
      AgreementFilters | void
    >({
      query: (filters) => ({
        url: "/agreements",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Agreement" as const,
                id: String(id),
              })),
              { type: "Agreement", id: "LIST" },
            ]
          : [{ type: "Agreement", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Agreement[];
          current_page: number;
          per_page: number;
          total: number;
          last_page: number;
          from: number;
          to: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
              from: response.data.from,
              to: response.data.to,
            },
          };
        }
        return {
          data: [],
          pagination: {
            current_page: 1,
            per_page: 15,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          },
        };
      },
    }),

    getAgreement: builder.query<Agreement, number>({
      query: (id) => ({
        url: `/agreements/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Agreement", id: String(id) }],
      transformResponse: (response: {
        data: Agreement;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as Agreement;
      },
    }),

    createAgreement: builder.mutation<Agreement, CreateAgreementData>({
      query: (data) => ({
        url: "/agreements",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "Agreement", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Agreement created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create agreement";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAgreement: builder.mutation<
      Agreement,
      { id: number; data: Partial<CreateAgreementData> }
    >({
      query: ({ id, data }) => ({
        url: `/agreements/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Agreement", id: String(id) },
        { type: "Agreement", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Agreement updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update agreement";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAgreement: builder.mutation<void, number>({
      query: (id) => ({
        url: `/agreements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Agreement", id: String(id) },
        { type: "Agreement", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Agreement deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete agreement";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAgreementsQuery,
  useGetAgreementQuery,
  useCreateAgreementMutation,
  useUpdateAgreementMutation,
  useDeleteAgreementMutation,
} = agreementsApi;


