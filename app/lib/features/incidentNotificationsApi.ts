import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import {
  MutationError,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

// Enums for Incident Notifications
export enum Template {
  DPA_BREACH_NOTIFICATION = "dpa_breach_notification",
  DATA_SUBJECT_NOTIFICATION = "data_subject_notification",
  UAE_PDPL_BREACH_NOTIFICATION = "uae_pdpl_breach_notification",
  EXECUTIVE_SUMMARY_TEMPLATE = "executive_summary_template",
  CUSTOMER_NOTICE_TEMPLATE = "customer_notice_template",
  PRESS_RELEASE_TEMPLATE = "press_release_template",
  INTERNAL_ALL_HANDS_TEMPLATE = "internal_all_hands_template",
  CUSTOM_OTHER = "custom_other",
}

export enum Language {
  ENGLISH = "english",
  ARABIC = "arabic",
  FRENCH = "french",
  GERMAN = "german",
  SPANISH = "spanish",
  MULTIPLE = "multiple",
}

export enum RegulatoryBasis {
  GDPR_ART_33 = "gdpr_art_33",
  GDPR_ART_34 = "gdpr_art_34",
  UAE_PDPL = "uae_pdpl",
  CONTRACTUAL = "contractual",
  INTERNAL_POLICY = "internal_policy",
  NA = "na",
}

export enum AudienceType {
  INTERNAL_EXECUTIVE = "internal_executive",
  INTERNAL_TECHNICAL = "internal_technical",
  DATA_PROTECTION_AUTHORITY = "data_protection_authority",
  AFFECTED_DATA_SUBJECTS = "affected_data_subjects",
  EXTERNAL_PARTNERS = "external_partners",
  MEDIA_PUBLIC = "media_public",
  BOARD_AUDIT_COMMITTEE = "board_audit_committee",
  LEGAL_COMPLIANCE = "legal_compliance",
}

export enum Channel {
  EMAIL = "email",
  SMS = "sms",
  PORTAL_NOTIFICATION = "portal_notification",
  SLACK_TEAMS = "slack_teams",
  FORMAL_LETTER = "formal_letter",
  PRESS_RELEASE = "press_release",
  REGULATORY_FILING = "regulatory_filing",
}

export enum DeliveryStatus {
  DRAFT = "draft",
  SENT = "sent",
  DELIVERED = "delivered",
  ACKNOWLEDGED = "acknowledged",
  FAILED = "failed",
}

// Types for Incident Notifications
export interface IncidentNotification {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  template?: Template | null;
  language?: Language | null;
  regulatory_basis?: RegulatoryBasis | null;
  notification_deadline?: string | null;
  audience_type: AudienceType;
  channel: Channel;
  notice_summary: string;
  notice_link?: string | null;
  sent_at: string;
  sent_by?: string | null;
  delivery_status: DeliveryStatus;
  response_summary?: string | null;
  follow_up_required: boolean;
  follow_up_date?: string | null;
  follow_up_notes?: string | null;
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

export interface IncidentNotificationFilters {
  ai_incident_id?: number;
  audience_type?: AudienceType;
  channel?: Channel;
  delivery_status?: DeliveryStatus;
  follow_up_required?: boolean;
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  page?: number;
  per_page?: number;
}

export interface CreateIncidentNotificationData {
  ai_incident_id: number;
  template?: Template | null;
  language?: Language | null;
  regulatory_basis?: RegulatoryBasis | null;
  notification_deadline?: string | null;
  audience_type: AudienceType;
  channel: Channel;
  notice_summary: string;
  notice_link?: string | null;
  sent_at: string;
  sent_by?: string | null;
  delivery_status: DeliveryStatus;
  response_summary?: string | null;
  follow_up_required: boolean;
  follow_up_date?: string | null;
  follow_up_notes?: string | null;
}

export const incidentNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentNotifications: builder.query<
      { data: IncidentNotification[]; pagination: PaginationMeta },
      IncidentNotificationFilters | void
    >({
      query: (filters) => ({
        url: "/incident-notifications",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "IncidentNotification" as const,
                id: String(id),
              })),
              { type: "IncidentNotification", id: "LIST" },
            ]
          : [{ type: "IncidentNotification", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: IncidentNotification[];
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

    getIncidentNotification: builder.query<IncidentNotification, number>({
      query: (id) => ({
        url: `/incident-notifications/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "IncidentNotification", id: String(id) },
      ],
      transformResponse: (response: {
        data: IncidentNotification;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as IncidentNotification;
      },
    }),

    createIncidentNotification: builder.mutation<
      IncidentNotification,
      CreateIncidentNotificationData
    >({
      query: (data) => ({
        url: "/incident-notifications",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "IncidentNotification", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident notification created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create incident notification";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateIncidentNotification: builder.mutation<
      IncidentNotification,
      { id: number; data: Partial<CreateIncidentNotificationData> }
    >({
      query: ({ id, data }) => ({
        url: `/incident-notifications/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "IncidentNotification", id: String(id) },
        { type: "IncidentNotification", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident notification updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update incident notification";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteIncidentNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/incident-notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "IncidentNotification", id: String(id) },
        { type: "IncidentNotification", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Incident notification deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete incident notification";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetIncidentNotificationsQuery,
  useGetIncidentNotificationQuery,
  useCreateIncidentNotificationMutation,
  useUpdateIncidentNotificationMutation,
  useDeleteIncidentNotificationMutation,
} = incidentNotificationsApi;
