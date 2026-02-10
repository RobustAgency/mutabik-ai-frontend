import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import type {
  PrivacyIncident,
  CreatePrivacyIncidentData,
  PrivacyIncidentFilters,
} from "@/interfaces/PrivacyIncident";
import {
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";

export interface PrivacyIncidentListResponse {
  data: {
    current_page: number;
    data: PrivacyIncident[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export interface PrivacyIncidentItemResponse {
  data: PrivacyIncident;
  error: boolean;
  message: string;
}

export const privacyIncidentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyIncidents: builder.query<
      { data: PrivacyIncident[]; pagination?: PaginationMeta },
      PrivacyIncidentFilters | void
    >({
      query: (filters = {}) => ({
        url: "/privacy-incidents",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "PrivacyIncident" as const,
                id,
              })),
              { type: "PrivacyIncident", id: "LIST" },
            ]
          : [{ type: "PrivacyIncident", id: "LIST" }],
      transformResponse: (response: PrivacyIncidentListResponse) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          const { current_page, per_page, total } = response.data;
          const from = (current_page - 1) * per_page + 1;
          const to = Math.min(current_page * per_page, total);
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
              from,
              to,
            },
          };
        }
        return { data: [] };
      },
    }),

    getPrivacyIncident: builder.query<PrivacyIncident, number>({
      query: (id) => ({
        url: `/privacy-incidents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "PrivacyIncident", id },
      ],
      transformResponse: (response: PrivacyIncidentItemResponse) => {
        return response.data;
      },
    }),

    createPrivacyIncident: builder.mutation<
      PrivacyIncident,
      CreatePrivacyIncidentData
    >({
      query: (data) => ({
        url: "/privacy-incidents",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "PrivacyIncident", id: "LIST" }],
      transformResponse: (response: PrivacyIncidentItemResponse) => {
        return response.data;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Privacy incident created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (hasValidationErrors(mutationError)) {
            // Validation errors are handled by the form
            return;
          }
          const message =
            mutationError?.error?.data?.message ||
            "Failed to create privacy incident";
          toast.error(message);
        }
      },
    }),

    updatePrivacyIncident: builder.mutation<
      PrivacyIncident,
      { id: number; data: Partial<CreatePrivacyIncidentData> }
    >({
      query: ({ id, data }) => ({
        url: `/privacy-incidents/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PrivacyIncident", id },
        { type: "PrivacyIncident", id: "LIST" },
      ],
      transformResponse: (response: PrivacyIncidentItemResponse) => {
        return response.data;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Privacy incident updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (hasValidationErrors(mutationError)) {
            // Validation errors are handled by the form
            return;
          }
          const message =
            mutationError?.error?.data?.message ||
            "Failed to update privacy incident";
          toast.error(message);
        }
      },
    }),

    deletePrivacyIncident: builder.mutation<void, number>({
      query: (id) => ({
        url: `/privacy-incidents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PrivacyIncident", id },
        { type: "PrivacyIncident", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Privacy incident deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const message =
            mutationError?.error?.data?.message ||
            "Failed to delete privacy incident";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetPrivacyIncidentsQuery,
  useGetPrivacyIncidentQuery,
  useCreatePrivacyIncidentMutation,
  useUpdatePrivacyIncidentMutation,
  useDeletePrivacyIncidentMutation,
} = privacyIncidentsApi;

