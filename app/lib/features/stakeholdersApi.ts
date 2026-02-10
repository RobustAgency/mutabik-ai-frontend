import { baseApi } from "@/lib/api/baseApi";
import { PaginationMeta } from "@/lib/api/rtkQueryBase";
import {
  transformListResponseWithCalculatedPagination,
  transformSingleItemResponse,
  createListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
} from "@/lib/api/rtkQueryHelpers";

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

interface StakeholderListResponse {
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
}

interface StakeholderItemResponse {
  data: Stakeholder;
  error?: boolean;
  message?: string;
}

export const stakeholdersApi = baseApi.injectEndpoints({
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
      providesTags: (result) => createListTags(result, "Stakeholder"),
      transformResponse: (response: StakeholderListResponse) =>
        transformListResponseWithCalculatedPagination(response) as {
          data: Stakeholder[];
          pagination: PaginationMeta;
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
              ...result.map(({ id }) => ({
                type: "Stakeholder" as const,
                id,
              })),
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
      providesTags: (result, error, id) => [{ type: "Stakeholder", id }],
      transformResponse: (response: StakeholderItemResponse) =>
        transformSingleItemResponse(response),
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
      onQueryStarted: createMutationToastHandler(
        "Stakeholder created successfully",
        "Failed to create stakeholder"
      ),
    }),

    updateStakeholder: builder.mutation<
      Stakeholder,
      { id: string | number; data: Partial<CreateStakeholderData> }
    >({
      query: ({ id, data }) => ({
        url: `/stakeholders/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stakeholder", id },
        { type: "Stakeholder", id: "LIST" },
        { type: "Stakeholder", id: "STATISTICS" },
      ],
      onQueryStarted: createMutationToastHandler(
        "Stakeholder updated successfully",
        "Failed to update stakeholder"
      ),
    }),

    deleteStakeholder: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stakeholder", id },
        { type: "Stakeholder", id: "LIST" },
        { type: "Stakeholder", id: "STATISTICS" },
      ],
      onQueryStarted: createDeleteToastHandler(
        "Stakeholder deleted successfully",
        "Failed to delete stakeholder"
      ),
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
