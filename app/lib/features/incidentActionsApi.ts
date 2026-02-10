import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums for Incident Actions
export enum ActionType {
  KILL_SWITCH = "kill_switch",
  MODEL_ROLLBACK = "model_rollback",
  DATA_ISOLATION = "data_isolation",
  ACCESS_REVOCATION = "access_revocation",
  SYSTEM_PATCH = "system_patch",
  CONFIGURATION_CHANGE = "configuration_change",
  COMMUNICATION_NOTIFICATION = "communication_notification",
  INVESTIGATION = "investigation",
  CONTAINMENT = "containment",
  ERADICATION = "eradication",
  RECOVERY = "recovery",
  DOCUMENTATION = "documentation",
  OTHER = "other",
}

export enum ExecutionStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
  ROLLED_BACK = "rolled_back",
}

export enum ApprovalRequired {
  NO_APPROVAL_NEEDED = "no_approval_needed",
  MANAGER_APPROVAL = "manager_approval",
  EXECUTIVE_APPROVAL = "executive_approval",
  LEGAL_APPROVAL = "legal_approval",
}

export enum ValidationResult {
  PENDING = "pending",
  PARTIALLY_EFFECTIVE = "partially_effective",
  EFFECTIVE = "effective",
  INEFFECTIVE = "ineffective",
}

// Types for Incident Actions
export interface IncidentAction {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  action_type: ActionType;
  execution_status: ExecutionStatus;
  description: string;
  performed_by: number;
  individual_name?: string | null;
  depends_on?: string | null;
  approval_required?: ApprovalRequired | null;
  estimated_duration?: string | null;
  actual_duration?: string | null;
  started_at: string;
  completed_at?: string | null;
  validation_result: ValidationResult;
  validation_notes?: string | null;
  linked_release_id?: string | null;
  evidence_link?: string | null;
  created_at: string;
  updated_at?: string;
  display_id?: string | null;
  ai_incident?: {
    id: number;
    title: string;
    display_id?: string;
    [key: string]: unknown;
  } | null;
}

export interface IncidentActionFilters {
  ai_incident_id?: number;
  action_type?: ActionType;
  execution_status?: ExecutionStatus;
  validation_result?: ValidationResult;
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  page?: number;
  per_page?: number;
}

export interface CreateIncidentActionData {
  ai_incident_id: number;
  action_type: ActionType;
  execution_status: ExecutionStatus;
  description: string;
  performed_by: number;
  individual_name?: string | null;
  depends_on?: string | null;
  approval_required?: ApprovalRequired | null;
  estimated_duration?: string | null;
  actual_duration?: string | null;
  started_at: string;
  completed_at?: string | null;
  validation_result: ValidationResult;
  validation_notes?: string | null;
  linked_release_id?: string | null;
  evidence_link?: string | null;
}

export const incidentActionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentActions: builder.query<
      { data: IncidentAction[]; pagination: PaginationMeta },
      IncidentActionFilters | void
    >({
      query: (filters) => ({
        url: "/incident-actions",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "IncidentAction" as const,
                id: String(id),
              })),
              { type: "IncidentAction", id: "LIST" },
            ]
          : [{ type: "IncidentAction", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: IncidentAction[];
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

    getIncidentAction: builder.query<IncidentAction, number>({
      query: (id) => ({
        url: `/incident-actions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "IncidentAction", id: String(id) }],
      transformResponse: (response: {
        data: IncidentAction;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as IncidentAction;
      },
    }),

    createIncidentAction: builder.mutation<IncidentAction, CreateIncidentActionData>({
      query: (data) => ({
        url: "/incident-actions",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "IncidentAction", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident action created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create incident action";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateIncidentAction: builder.mutation<
      IncidentAction,
      { id: number; data: Partial<CreateIncidentActionData> }
    >({
      query: ({ id, data }) => ({
        url: `/incident-actions/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "IncidentAction", id: String(id) },
        { type: "IncidentAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident action updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update incident action";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteIncidentAction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/incident-actions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "IncidentAction", id: String(id) },
        { type: "IncidentAction", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident action deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete incident action";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetIncidentActionsQuery,
  useGetIncidentActionQuery,
  useCreateIncidentActionMutation,
  useUpdateIncidentActionMutation,
  useDeleteIncidentActionMutation,
} = incidentActionsApi;

