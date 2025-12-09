import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Types for Incident Notifications
export interface IncidentNotification {
  id: number;
  organization_id: number;
  ai_incident_id: number;
  audience_type:
    | "internal_exec"
    | "internal_staff"
    | "customers"
    | "regulator"
    | "vendor"
    | "media"
    | "other";
  channel: "email" | "portal" | "status_page" | "phone" | "meeting" | "legal_letter" | "other";
  notice_summary: string;
  notice_link?: string | null;
  notified_at: string;
  approved_by?: string | null;
  approval_ref?: string | null;
  follow_up_required: boolean;
  created_at: string;
}

export interface IncidentNotificationFilters {
  ai_incident_id?: number;
  audience_type?: IncidentNotification["audience_type"];
  channel?: IncidentNotification["channel"];
  follow_up_required?: boolean;
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  page?: number;
  per_page?: number;
}

export interface CreateIncidentNotificationData {
  ai_incident_id: number;
  audience_type: IncidentNotification["audience_type"];
  channel: IncidentNotification["channel"];
  notice_summary: string;
  notice_link?: string | null;
  notified_at: string;
  approved_by?: string | null;
  approval_ref?: string | null;
  follow_up_required: boolean;
}

export const incidentNotificationsApi = createApi({
  reducerPath: "incidentNotificationsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["IncidentNotification"],
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
      providesTags: (result, error, id) => [{ type: "IncidentNotification", id: String(id) }],
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
              mutationError?.error?.data?.message || "Failed to create incident notification";
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
              mutationError?.error?.data?.message || "Failed to update incident notification";
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
            mutationError?.error?.data?.message || "Failed to delete incident notification";
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

