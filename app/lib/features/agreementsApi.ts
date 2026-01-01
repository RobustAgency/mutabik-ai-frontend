import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums
export enum AgreementType {
  MSA = "msa",
  DPA = "dpa",
  ORDER_FORM = "order_form",
  ADDENDUM = "addendum",
  SLA = "sla",
  NDA = "nda",
  SOW = "sow",
  OTHER = "other",
}

export enum AgreementStatus {
  DRAFT = "draft",
  UNDER_REVIEW = "under_review",
  PENDING_SIGNATURE = "pending_signature",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated",
  SUSPENDED = "suspended",
}

export enum RenewalType {
  AUTO_RENEWAL = "auto_renewal",
  MANUAL_RENEWAL = "manual_renewal",
  ONE_TIME_FIXED_TERM = "one_time_fixed_term",
  EVERGREEN = "evergreen",
}

export enum GoverningLaw {
  DELAWARE = "delaware",
  CALIFORNIA = "california",
  ENGLAND_WALES = "england_new_wales",
  UAE_FEDERAL = "uae_federal",
  GERMANY = "germany",
  SINGAPORE = "singapore",
}

export enum TrainingOptOut {
  PROHIBITED = "prohibited",
  ALLOWED_WITH_CONSENT = "allowed_with_consent",
  ALLOWED_WITH_PRE_TERMS = "allowed_with_pre_terms",
  NOT_APPLICABLE = "not_applicable",
  NOT_SPECIFIED = "not_specified",
}

export enum AuditRights {
  FULL_AUDIT_RIGHTS = "full_audit_rights",
  THIRD_PARTY_AUDIT_ONLY = "third_party_audit_only",
  SOC_2_ISO_REPORTS_ONLY = "soc_2_iso_reports_only",
  NONE = "none",
  LIMITED = "limited",
}

export enum TransferMechanism {
  ADEQUACY = "adequacy",
  SCCS = "sccs",
  BCRS = "bcrs",
  DPA_ADDENDUM = "dpa_addendum",
  DEROGATION = "derogation",
  NONE = "none",
}

export enum SubProcessingRights {
  PROHIBITED = "prohibited",
  ALLOWED_WITH_NOTIFICATION = "allowed_with_notification",
  ALLOWED_WITH_APPROVAL = "allowed_with_approval",
  PER_SUB_PROCESSOR_LIST = "per_sub_processor_list",
}

export enum Indemnification {
  VENDOR_INDEMNIFIES = "vendor_indemnifies",
  MUTUAL = "mutual",
  LIMITED = "limited",
  NONE = "none",
}

export enum DisputeResolution {
  MEDIATION_THEN_ARBITRATION = "mediation_then_arbitration",
  ARBITRATION = "arbitration",
  COURTS = "courts",
}

export enum ConfidentialityTerm {
  STRICT = "strict",
  MODERATE = "moderate",
  LENIENT = "lenient",
}

export enum ParentAgreement {
  MSA_OPENAI_2024 = "msa_openai_2024",
  MSA_AWS_2023 = "msa_aws_2023",
  NONE = "none",
}

export enum ReplacesAgreement {
  DPA_OPENAI_2023 = "dpa_openai_2023",
  NONE = "none",
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
  agreement_owner_id: number;
  asset_types_covered: string[];
  renewal_type: RenewalType | null;
  notice_period_days: number | null;
  termination_for_convenience: boolean | null;
  governing_law: GoverningLaw | null;
  effective_from: string;
  effective_to: string;
  training_opt_out: TrainingOptOut | null;
  audit_rights: AuditRights | null;
  transfer_mechanism: TransferMechanism | null;
  sub_processing_rights: SubProcessingRights | null;
  contract_value: number | null;
  liability_cap: number | null;
  insurance_requirements: string | null;
  indemnification: Indemnification | null;
  internal_reference_number: string | null;
  vendor_contract_id: string | null;
  dispute_resolution: DisputeResolution | null;
  confidentiality_term: ConfidentialityTerm | null;
  parent_agreement: ParentAgreement | null;
  replaces_agreement: ReplacesAgreement | null;
  notes: string | null;
  doc_ref: string;
  created_at: string;
  updated_at: string;
  vendor?: AgreementVendorSummary;
  display_id?: string;
}

export interface AgreementFilters {
  page?: number;
  per_page?: number;
  vendor_id?: number;
}

export interface AgreementStatistics {
  total_agreements: number;
  active_agreements: number;
  expiring_in_90_days: number;
  pending_signature_count: number;
}

export interface CreateAgreementData {
  vendor_id: number;
  agreement_type: AgreementType;
  status: AgreementStatus;
  agreement_owner_id: number;
  asset_types_covered: string[];
  renewal_type?: RenewalType | null;
  notice_period_days?: number | null;
  termination_for_convenience?: boolean | null;
  governing_law?: GoverningLaw | null;
  effective_from: string;
  effective_to: string;
  training_opt_out?: TrainingOptOut | null;
  audit_rights?: AuditRights | null;
  transfer_mechanism?: TransferMechanism | null;
  sub_processing_rights?: SubProcessingRights | null;
  contract_value?: number | null;
  liability_cap?: number | null;
  insurance_requirements?: string | null;
  indemnification?: Indemnification | null;
  internal_reference_number?: string | null;
  vendor_contract_id?: string | null;
  dispute_resolution?: DisputeResolution | null;
  confidentiality_term?: ConfidentialityTerm | null;
  parent_agreement?: ParentAgreement | null;
  replaces_agreement?: ReplacesAgreement | null;
  notes?: string | null;
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
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Agreement", id: "LIST" }];
        }
        const agreements = Array.isArray(result)
          ? result
          : (result.data && Array.isArray(result.data) ? result.data : []);
        return [
          ...agreements.map(({ id }) => ({ type: "Agreement" as const, id: String(id) })),
          { type: "Agreement", id: "LIST" },
        ];
      },
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

    getAgreementStatistics: builder.query<AgreementStatistics, void>({
      query: () => ({
        url: "/agreements/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Agreement", id: "STATISTICS" }],
      transformResponse: (response: {
        data: AgreementStatistics;
        error?: boolean;
        message?: string;
      }) => {
        return response.data;
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
      invalidatesTags: [{ type: "Agreement", id: "LIST" }, { type: "Agreement", id: "STATISTICS" }],
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
        { type: "Agreement", id: "STATISTICS" },
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
        { type: "Agreement", id: "STATISTICS" },
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
  useGetAgreementStatisticsQuery,
  useCreateAgreementMutation,
  useUpdateAgreementMutation,
  useDeleteAgreementMutation,
} = agreementsApi;
