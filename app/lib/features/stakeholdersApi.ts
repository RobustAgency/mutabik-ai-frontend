import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors } from "@/lib/api/rtkQueryBase";

// Types for stakeholders
export interface Stakeholder {
  id: string;
  type: string;
  display_name: string;
  legal_name: string;
  org_unit: string;
  email: string;
  phone: string;
  vendor_id: string | null;
  role_tags: string[];
  timezone: string;
  classification: string;
  country: string;
  external_ref: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StakeholderFilters {
  type?: string | null;
  name?: string | null; // max:255
  per_page?: number | null; // min:1, max:100
  // Legacy support
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateStakeholderData {
  type:
    | "person"
    | "team"
    | "vendor_org"
    | "regulator"
    | "customer_group"
    | "committee_secretariat";
  display_name: string;
  legal_name: string;
  org_unit: string;
  email: string;
  phone: string;
  vendor_id: string;
  role_tags: string[];
  timezone: string;
  classification: "internal" | "external";
  country: string; // ISO alpha-2
  external_ref: string;
  active: boolean;
}

export const stakeholdersApi = createApi({
  reducerPath: "stakeholdersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Stakeholder"],
  endpoints: (builder) => ({
    getStakeholders: builder.query<Stakeholder[], StakeholderFilters | void>({
      query: (filters) => ({
        url: "/stakeholders",
        method: "GET",
        params: filters ?? undefined,
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

    getStakeholder: builder.query<Stakeholder, string>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Stakeholder", id }],
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
      invalidatesTags: [{ type: "Stakeholder", id: "LIST" }],
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
      { id: string; data: Partial<CreateStakeholderData> }
    >({
      query: ({ id, data }) => ({
        url: `/stakeholders/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stakeholder", id },
        { type: "Stakeholder", id: "LIST" },
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

    deleteStakeholder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/stakeholders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stakeholder", id },
        { type: "Stakeholder", id: "LIST" },
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
  }),
});

export const {
  useGetStakeholdersQuery,
  useGetStakeholdersByTypeQuery,
  useGetStakeholderQuery,
  useCreateStakeholderMutation,
  useUpdateStakeholderMutation,
  useDeleteStakeholderMutation,
} = stakeholdersApi;
