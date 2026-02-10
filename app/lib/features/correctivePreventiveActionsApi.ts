import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums for Corrective Preventive Actions (CAPA)
export enum SourceType {
  INCIDENT = "incident",
  RCA = "rca",
  AUDIT_FINDING = "audit finding",
  RISK_ASSESSMENT = "risk assessment",
  CUSTOMER_COMPLAINT = "customer complaint",
  REGULATORY_REQUIREMENT = "regulatory requirement",
}

export enum CapaType {
  CORRECTIVE = "corrective",
  PREVENTIVE = "preventive",
  BOTH = "both",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum OwnerTeam {
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

export enum Status {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  PENDING_VERIFICATION = "pending_verification",
  CLOSED = "closed",
  OVERDUE = "overdue",
}

export enum VerificationResult {
  PENDING = "pending",
  VERIFIED_EFFECTIVE = "verified_effective",
  REQUIRES_REWORK = "requires_rework",
  VERIFIED_INEFFECTIVE = "verified_ineffective",
}

// Types for Corrective Preventive Actions (CAPA)
export interface CorrectivePreventiveAction {
  id: number;
  organization_id: number;
  source_type: SourceType;
  source_reference: string;
  ai_model_id?: number | null;
  dataset_id?: number | null;
  title: string;
  capa_type: CapaType;
  priority: Priority;
  root_cause?: string | null;
  actions: string;
  owner_team: OwnerTeam;
  assignee?: string | null;
  due_date: string;
  status: Status;
  success_criteria?: string | null;
  linked_training?: string | null;
  estimated_cost?: number | null;
  verification_result?: VerificationResult | null;
  effectiveness_review_date?: string | null;
  evidence_link?: string | null;
  created_at: string;
  updated_at?: string;
  display_id?: string | null;
  closed_at?: string | null;
  ai_model?: {
    id: number;
    name: string;
    [key: string]: unknown;
  } | null;
  dataset?: {
    id: number;
    name: string;
    [key: string]: unknown;
  } | null;
}

export interface CorrectivePreventiveActionFilters {
  source_type?: SourceType;
  source_reference?: string;
  ai_model_id?: number;
  dataset_id?: number;
  capa_type?: CapaType;
  priority?: Priority;
  owner_team?: OwnerTeam;
  status?: Status;
  verification_result?: VerificationResult;
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  page?: number;
  per_page?: number;
}

export interface CreateCorrectivePreventiveActionData {
  source_type: SourceType;
  source_reference: string;
  ai_model_id?: number | null;
  dataset_id?: number | null;
  title: string;
  capa_type: CapaType;
  priority: Priority;
  root_cause?: string | null;
  actions: string;
  owner_team: OwnerTeam;
  assignee?: string | null;
  due_date: string;
  status: Status;
  success_criteria?: string | null;
  linked_training?: string | null;
  estimated_cost?: number | null;
  verification_result?: VerificationResult | null;
  effectiveness_review_date?: string | null;
  evidence_link?: string | null;
}

export const correctivePreventiveActionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCorrectivePreventiveActions: builder.query<
      { data: CorrectivePreventiveAction[]; pagination: PaginationMeta },
      CorrectivePreventiveActionFilters | void
    >({
      query: (filters) => ({
        url: "/corrective-preventive-actions",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "CorrectivePreventiveAction" as const,
                id: String(id),
              })),
              { type: "CorrectivePreventiveAction", id: "LIST" },
            ]
          : [{ type: "CorrectivePreventiveAction", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: CorrectivePreventiveAction[];
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

    getCorrectivePreventiveAction: builder.query<CorrectivePreventiveAction, number>({
      query: (id) => ({
        url: `/corrective-preventive-actions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "CorrectivePreventiveAction", id: String(id) },
      ],
      transformResponse: (response: {
        data: CorrectivePreventiveAction;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as CorrectivePreventiveAction;
      },
    }),

    createCorrectivePreventiveAction: builder.mutation<
      CorrectivePreventiveAction,
      CreateCorrectivePreventiveActionData
    >({
      query: (data) => ({
        url: "/corrective-preventive-actions",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "CorrectivePreventiveAction", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("CAPA created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create CAPA";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateCorrectivePreventiveAction: builder.mutation<
      CorrectivePreventiveAction,
      { id: number; data: Partial<CreateCorrectivePreventiveActionData> }
    >({
      query: ({ id, data }) => ({
        url: `/corrective-preventive-actions/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CorrectivePreventiveAction", id: String(id) },
        { type: "CorrectivePreventiveAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("CAPA updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update CAPA";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteCorrectivePreventiveAction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/corrective-preventive-actions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CorrectivePreventiveAction", id: String(id) },
        { type: "CorrectivePreventiveAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("CAPA deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete CAPA";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetCorrectivePreventiveActionsQuery,
  useGetCorrectivePreventiveActionQuery,
  useCreateCorrectivePreventiveActionMutation,
  useUpdateCorrectivePreventiveActionMutation,
  useDeleteCorrectivePreventiveActionMutation,
} = correctivePreventiveActionsApi;

