import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums matching Laravel backend
export enum IncidentType {
  AI_MODEL_FAILURE = "ai_model_failure",
  AI_BIAS_FAIRNESS_ISSUE = "ai_bias_fairness_issue",
  AI_SAFETY_VIOLATION = "ai_safety_violation",
  AI_HALLUCINATION_MISINFORMATION = "ai_hallucination_misinformation",
  DATA_BREACH = "data_breach",
  PRIVACY_VIOLATION = "privacy_violation",
  CONSENT_VIOLATION = "consent_violation",
  DATA_QUALITY_ISSUE = "data_quality_issue",
  UNAUTHORIZED_ACCESS = "unauthorized_access",
  DATA_LOSS = "data_loss",
  CROSS_BORDER_TRANSFER_VIOLATION = "cross_border_transfer_violation",
  REGULATORY_NON_COMPLIANCE = "regulatory_non_compliance",
  SYSTEM_OUTAGE = "system_outage",
  PERFORMANCE_DEGRADATION = "performance_degradation",
  SECURITY_INCIDENT = "security_incident",
  THIRD_PARTY_VENDOR_ISSUE = "third_party_vendor_issue",
  OTHER = "other",
}

export enum Domain {
  AI_GOVERNANCE = "ai_governance",
  DATA_PRIVACY = "data_privacy",
  DATA_GOVERNANCE = "data_governance",
  INFORMATION_SECURITY = "information_security",
  MULTIPLE_DOMAINS = "multiple_domains",
}

export enum IncidentSeverity {
  SEV1_CRITICAL = "sev1_critical",
  SEV2_HIGH = "sev2_high",
  SEV3_MEDIUM = "sev3_medium",
  SEV4_LOW = "sev4_low",
}

export enum IncidentStatus {
  OPEN = "open",
  INVESTIGATING = "investigating",
  CONTAINED = "contained",
  MITIGATED = "mitigated",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REOPENED = "reopened",
}

export enum ResponseTeam {
  AI_GOVERNANCE = "ai_governance",
  DATA_PRIVACY_OFFICE = "data_privacy_office",
  DATA_GOVERNANCE = "data_governance",
  ML_ENGINEERING = "ml_engineering",
  DATA_ENGINEERING = "data_engineering",
  INFORMATION_SECURITY = "information_security",
  LEGAL = "legal",
  COMPLIANCE = "compliance",
  EXECUTIVE_LEADERSHIP = "executive_leadership",
  PRODUCT = "product",
  CUSTOMER_SUCCESS = "customer_success",
}

export enum PrimaryRegulatoryFramework {
  GDPR = "gdpr",
  UAE_PDPL = "uae_pdpl",
  EU_AI_ACT = "eu_ai_act",
  CCPA_CPRA = "ccpa_cpra",
  HIPAA = "hipaa",
  SOX = "sox",
  PCI_DSS = "pci_dss",
  ISO_27001 = "iso_27001",
  MULTIPLE = "multiple",
  OTHER = "other",
  NA = "na",
}

export enum NotificationRequirement {
  DPA_WITHIN_72_HOURS = "dpa_within_72_hours",
  DPA_WITHIN_24_HOURS = "dpa_within_24_hours",
  DATA_SUBJECTS_REQUIRED = "data_subjects_required",
  INTERNAL_ONLY = "internal_only",
  NO_NOTIFICATION_REQUIRED = "no_notification_required",
  UNDER_ASSESSMENT = "under_assessment",
}

export enum ResidencyAffected {
  AE = "ae",
  EU = "eu",
  KSA = "ksa",
  US = "us",
  UK = "uk",
  QA = "qa",
  JO = "jo",
  MA = "ma",
  BH = "bh",
  OTHER = "other",
  MULTIPLE = "multiple",
}

export enum ImpactedDataType {
  PII_DIRECT_IDENTIFIERS = "pii_direct_identifiers",
  PII_CONTACT_INFORMATION = "pii_contact_information",
  PII_FINANCIAL = "pii_financial",
  PII_DEMOGRAPHIC = "pii_demographic",
  PII_BEHAVIORAL = "pii_behavioral",
  PII_LOCATION = "pii_location",
  SPECIAL_CATEGORY_HEALTH = "special_category_health",
  SPECIAL_CATEGORY_BIOMETRIC = "special_category_biometric",
  SPECIAL_CATEGORY_GENETIC = "special_category_genetic",
  SPECIAL_CATEGORY_POLITICAL = "special_category_political",
  SPECIAL_CATEGORY_RELIGIOUS = "special_category_religious",
  SPECIAL_CATEGORY_RACIAL_ETHNIC = "special_category_racial_ethnic",
  CONFIDENTIAL_BUSINESS_DATA = "confidential_business_data",
  INTERNAL_DATA = "internal_data",
  PUBLIC_DATA = "public_data",
  NONE_UNKNOWN = "none_unknown",
}

export enum AffectedBusinessUnit {
  FINANCE = "finance",
  HUMAN_RESOURCES = "human_resources",
  MARKETING = "marketing",
  SALES = "sales",
  OPERATIONS = "operations",
  CUSTOMER_SERVICE = "customer_service",
  IT_TECHNOLOGY = "it_technology",
  LEGAL = "legal",
  RESEARCH_DEVELOPMENT = "research_development",
  SUPPLY_CHAIN = "supply_chain",
  EXECUTIVE_OFFICE = "executive_office",
  ALL = "all",
}

export enum ExternalParty {
  CLOUD_SERVICE_PROVIDER = "cloud_service_provider",
  DATA_PROCESSOR = "data_processor",
  SOFTWARE_VENDOR = "software_vendor",
  HARDWARE_VENDOR = "hardware_vendor",
  CONSULTING_PARTNER = "consulting_partner",
  CUSTOMER = "customer",
  BUSINESS_PARTNER = "business_partner",
  REGULATOR = "regulator",
  AUDITOR = "auditor",
  INSURANCE_PROVIDER = "insurance_provider",
  NONE = "none",
}

export interface AiIncident {
  id: number;
  organization_id: number;
  title: string;
  summary: string;
  incident_type: IncidentType | null;
  domain: Domain | null;
  severity: IncidentSeverity;
  status: IncidentStatus;
  incident_commander: string;
  response_team: ResponseTeam | null;
  primary_regulatory_framework: PrimaryRegulatoryFramework | null;
  notification_requirement: NotificationRequirement | null;
  data_residency_affected?: ResidencyAffected | null;
  regulatory_reference?: string | null;
  estimated_impacted_users?: number | string | null;
  estimated_impacted_records: number | string;
  data_types_impacted: ImpactedDataType[] | null;
  affected_business_units?: AffectedBusinessUnit[] | null;
  external_parties_involved?: ExternalParty[] | null;
  business_impact_description?: string | null;
  impacted_systems?: string | null;
  ai_model_id?: number | null;
  linked_dataset_id?: number | null;
  linked_risk_id?: number | null;
  linked_assessment_id?: number | null;
  evidence_link?: string | null;
  created_at: string;
  updated_at: string;
  display_id?: string;
  ai_model?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
  dataset?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
}

// Filter types for AI Incidents
export interface AiIncidentFilters {
  per_page?: number | null; // min:1, max:100
  page?: number | null;
  title?: string | null;
  status?: IncidentStatus | null;
  severity?: IncidentSeverity | null;
  incident_type?: IncidentType | null;
  domain?: Domain | null;
  from?: string | null; // date
  to?: string | null; // date, after_or_equal:from
  search?: string | null;
}

export interface CreateAiIncidentData {
  title: string;
  summary: string;
  incident_type: IncidentType;
  domain: Domain;
  severity: IncidentSeverity;
  status: IncidentStatus;
  incident_commander: string;
  response_team: ResponseTeam;
  primary_regulatory_framework: PrimaryRegulatoryFramework;
  notification_requirement: NotificationRequirement;
  data_residency_affected?: ResidencyAffected | null;
  regulatory_reference?: string | null;
  estimated_impacted_users?: number | null;
  estimated_impacted_records: number;
  data_types_impacted: ImpactedDataType[];
  affected_business_units?: AffectedBusinessUnit[] | null;
  external_parties_involved?: ExternalParty[] | null;
  business_impact_description?: string | null;
  impacted_systems?: string | null;
  ai_model_id?: number | null;
  linked_dataset_id?: number | null;
  linked_risk_id?: number | null;
  evidence_link?: string | null;
}

export interface AiIncidentListResponse {
  data: {
    data: AiIncident[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
  };
  error?: boolean;
  message?: string;
}

export interface AiIncidentItemResponse {
  data: AiIncident;
  error?: boolean;
  message?: string;
}

export const aiIncidentsApi = createApi({
  reducerPath: "aiIncidentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiIncident"],
  endpoints: (builder) => ({
    getAiIncidents: builder.query<
      { data: AiIncident[]; pagination?: PaginationMeta },
      AiIncidentFilters | void
    >({
      query: (filters = {}) => ({
        url: "/ai-incidents",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "AiIncident" as const,
                id: String(id),
              })),
              { type: "AiIncident", id: "LIST" },
            ]
          : [{ type: "AiIncident", id: "LIST" }],
      transformResponse: (response: any) => {
        if (response?.data?.data && Array.isArray(response.data.data)) {
          const { current_page, per_page, total, last_page, from, to } = response.data;
          // Transform data to handle string-to-number conversions and ensure proper typing
          const transformedData = response.data.data.map((incident: any) => ({
            ...incident,
            estimated_impacted_users: incident.estimated_impacted_users 
              ? (typeof incident.estimated_impacted_users === 'string' 
                  ? parseInt(incident.estimated_impacted_users, 10) 
                  : incident.estimated_impacted_users)
              : null,
            estimated_impacted_records: incident.estimated_impacted_records
              ? (typeof incident.estimated_impacted_records === 'string'
                  ? parseInt(incident.estimated_impacted_records, 10)
                  : incident.estimated_impacted_records)
              : 0,
          }));
          return {
            data: transformedData,
            pagination: {
              current_page,
              per_page,
              total,
              last_page,
              from: from ?? ((current_page - 1) * per_page + 1),
              to: to ?? Math.min(current_page * per_page, total),
            },
          };
        }
        // Handle non-paginated response structure
        if (response?.data && Array.isArray(response.data)) {
          return { data: response.data, pagination: undefined };
        }
        return { data: [], pagination: undefined };
      },
    }),

    getAiIncident: builder.query<AiIncident, number>({
      query: (id) => ({
        url: `/ai-incidents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiIncident", id: String(id) }],
      transformResponse: (response: AiIncidentItemResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as AiIncident;
      },
    }),

    createAiIncident: builder.mutation<AiIncident, CreateAiIncidentData>({
      query: (data) => ({
        url: "/ai-incidents",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "AiIncident", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI incident created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!hasValidationErrors(mutationError)) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create AI incident";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateAiIncident: builder.mutation<
      AiIncident,
      { id: number; data: Partial<CreateAiIncidentData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-incidents/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiIncident", id: String(id) },
        { type: "AiIncident", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI incident updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!hasValidationErrors(mutationError)) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update AI incident";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteAiIncident: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-incidents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiIncident", id: String(id) },
        { type: "AiIncident", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI incident deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete AI incident";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetAiIncidentsQuery,
  useGetAiIncidentQuery,
  useCreateAiIncidentMutation,
  useUpdateAiIncidentMutation,
  useDeleteAiIncidentMutation,
} = aiIncidentsApi;
