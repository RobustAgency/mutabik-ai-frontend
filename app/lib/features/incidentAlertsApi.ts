import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums for Incident Alerts
export enum AlertSourceType {
  MONITORING_RULE = "monitoring_rule",
  KRI_THRESHOLD = "kri_threshold",
  MANUAL_REPORT = "manual_report",
  AUTOMATED_SCAN = "automated_scan",
  USER_COMPLAINT = "user_complaint",
  EXTERNAL_REPORT = "external_report",
}

export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Types for Incident Alerts
export interface IncidentAlert {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  source_type: AlertSourceType;
  data_source_id?: number | null;
  alert_sensitivity: AlertSeverity;
  source_ref?: string | null;
  context: string;
  first_seen_at: string;
  last_seen_at?: string | null;
  evidence_link?: string | null;
  auto_promote_incident?: boolean | null;
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

export interface IncidentAlertFilters {
  ai_incident_id?: number;
  source_type?: AlertSourceType;
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  page?: number;
  per_page?: number;
}

export interface CreateIncidentAlertData {
  ai_incident_id: number;
  source_type: AlertSourceType;
  data_source_id?: number | null;
  alert_sensitivity: AlertSeverity;
  source_ref?: string | null;
  context: string;
  first_seen_at: string;
  last_seen_at?: string | null;
  evidence_link?: string | null;
  auto_promote_incident?: boolean;
}

export const incidentAlertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentAlerts: builder.query<
      { data: IncidentAlert[]; pagination: PaginationMeta },
      IncidentAlertFilters | void
    >({
      query: (filters) => ({
        url: "/incident-alerts",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "IncidentAlert" as const,
                id: String(id),
              })),
              { type: "IncidentAlert", id: "LIST" },
            ]
          : [{ type: "IncidentAlert", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: IncidentAlert[];
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

    getIncidentAlert: builder.query<IncidentAlert, number>({
      query: (id) => ({
        url: `/incident-alerts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "IncidentAlert", id: String(id) }],
      transformResponse: (response: {
        data: IncidentAlert;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as IncidentAlert;
      },
    }),

    createIncidentAlert: builder.mutation<IncidentAlert, CreateIncidentAlertData>({
      query: (data) => ({
        url: "/incident-alerts",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "IncidentAlert", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident alert created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create incident alert";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateIncidentAlert: builder.mutation<
      IncidentAlert,
      { id: number; data: Partial<CreateIncidentAlertData> }
    >({
      query: ({ id, data }) => ({
        url: `/incident-alerts/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "IncidentAlert", id: String(id) },
        { type: "IncidentAlert", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident alert updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update incident alert";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteIncidentAlert: builder.mutation<void, number>({
      query: (id) => ({
        url: `/incident-alerts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "IncidentAlert", id: String(id) },
        { type: "IncidentAlert", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident alert deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete incident alert";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetIncidentAlertsQuery,
  useGetIncidentAlertQuery,
  useCreateIncidentAlertMutation,
  useUpdateIncidentAlertMutation,
  useDeleteIncidentAlertMutation,
} = incidentAlertsApi;

