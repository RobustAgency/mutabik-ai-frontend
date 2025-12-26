import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Types for stakeholders
export type StakeholderType =
  | "person"
  | "team"
  | "vendor_org"
  | "regulator"
  | "customer_group"
  | "committee_secretariat";

export type StakeholderStatus =
  | "active"
  | "in_active"
  | "on_leave"
  | "off_boarded";

export type StakeholderClassification = "internal" | "external";

export interface Stakeholder {
  id: number;
  organization_id: number;
  type: StakeholderType;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  org_unit: string;
  email: string;
  secondary_email: string | null;
  phone: string;
  mobile: string | null;
  role_tags: string[];
  timezone: string;
  classification: StakeholderClassification;
  country: string;
  external_ref: string | null;
  employee_id: string | null;
  cost_center: string | null;
  manager: string | null;
  delegate: string | null;
  status: StakeholderStatus;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  display_id?: string;
}

export interface StakeholderFilters {
  type?: string | null;
  name?: string | null; // max:255
  per_page?: number | null; // min:1, max:100
  page?: number;
  // Legacy support
  search?: string;
  limit?: number;
}

export interface CreateStakeholderData {
  type: StakeholderType;
  display_name: string;
  first_name: string;
  last_name: string;
  org_unit: string;
  email: string;
  secondary_email?: string | null;
  phone: string;
  mobile?: string | null;
  role_tags: string[];
  timezone: string;
  classification: StakeholderClassification;
  country: string;
  external_ref?: string | null;
  employee_id?: string | null;
  cost_center?: string | null;
  manager?: string | null;
  delegate?: string | null;
  status: StakeholderStatus;
  notes?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export const stakeholdersApi = createApi({
  reducerPath: "stakeholdersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Stakeholder"],
  endpoints: (builder) => ({
    getStakeholders: builder.query<
      { data: Stakeholder[]; pagination: PaginationMeta },
      StakeholderFilters | void
    >({
      query: (filters) => ({
        url: "/stakeholders",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Stakeholder", id: "LIST" }];
        }
        // Handle both transformed and raw response formats
        const stakeholders = Array.isArray(result) 
          ? result 
          : (result.data && Array.isArray(result.data) ? result.data : []);
        return [
          ...stakeholders.map(({ id }) => ({ type: "Stakeholder" as const, id: String(id) })),
          { type: "Stakeholder", id: "LIST" },
        ];
      },
      transformResponse: (response: {
        data: {
          data: Stakeholder[];
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
            per_page: 10,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          },
        };
      },
    }),

    getStakeholdersByType: builder.query<
      Stakeholder[],
      "person" | "vendor_org"
    >({
      query: (type) => ({
        url: `/stakeholders?type=${type}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Stakeholder" as const, id })),
              { type: "Stakeholder", id: "LIST" },
            ]
          : [{ type: "Stakeholder", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Stakeholder[];
          current_page: number;
          total: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getStakeholder: builder.query<Stakeholder, string | number>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Stakeholder", id: String(id) }],
      transformResponse: (response: {
        data: Stakeholder;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as Stakeholder;
      },
    }),

    createStakeholder: builder.mutation<Stakeholder, CreateStakeholderData>({
      query: (data) => ({
        url: "/stakeholders",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [
        { type: "Stakeholder", id: "LIST" },
        { type: "Stakeholder", id: "STATISTICS" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Stakeholder created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create stakeholder";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateStakeholder: builder.mutation<
      Stakeholder,
      { id: string | number; data: Partial<CreateStakeholderData> }
    >({
      query: ({ id, data }) => ({
        url: `/stakeholders/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stakeholder", id: String(id) },
        { type: "Stakeholder", id: "LIST" },
        { type: "Stakeholder", id: "STATISTICS" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Stakeholder updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update stakeholder";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteStakeholder: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stakeholder", id: String(id) },
        { type: "Stakeholder", id: "LIST" },
        { type: "Stakeholder", id: "STATISTICS" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Stakeholder deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete stakeholder";
          toast.error(errorMessage);
        }
      },
    }),

    getStakeholderStatistics: builder.query<
      {
        total_count: number;
        internal_count: number;
        external_count: number;
      },
      void
    >({
      query: () => ({
        url: "/stakeholders/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Stakeholder", id: "STATISTICS" }],
      transformResponse: (response: {
        data: {
          total_count: number;
          internal_count: number;
          external_count: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetStakeholdersQuery,
  useGetStakeholdersByTypeQuery,
  useGetStakeholderQuery,
  useCreateStakeholderMutation,
  useUpdateStakeholderMutation,
  useDeleteStakeholderMutation,
  useGetStakeholderStatisticsQuery,
} = stakeholdersApi;
