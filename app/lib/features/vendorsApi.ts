import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Types for vendors
export interface Vendor {
  id: number;
  organization_id: number;
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "tier_1" | "tier_2" | "tier_3" | "tier_4";
  status:
    | "evaluating"
    | "approved"
    | "conditionally_approved"
    | "restricted"
    | "suspended"
    | "terminated";
  stakeholder_id: number | null;
  stakeholder?: {
    id: number;
    display_name: string;
    legal_name: string;
    email: string;
  };
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role?: string;
    primary?: boolean;
  }>;
  metadata: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorFilters {
  risk_tier?: string | null; // enum: Vendor\RiskTier
  status?: string | null; // enum: Vendor\VendorStatus
  owner?: string | null; // max:255
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, after_or_equal:from
  per_page?: number | null; // min:1, max:100
  // Legacy support
  search?: string;
  page?: number;
}

export interface CreateVendorData {
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "tier_1" | "tier_2" | "tier_3" | "tier_4";
  status:
    | "evaluating"
    | "approved"
    | "conditionally_approved"
    | "restricted"
    | "suspended"
    | "terminated";
  stakeholder_id: number | null;
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role?: string;
    primary?: boolean;
  }>;
  metadata?: Record<string, unknown>;
  notes?: string | null;
}

export const vendorsApi = createApi({
  reducerPath: "vendorsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Vendor"],
  endpoints: (builder) => ({
    getVendors: builder.query<
      { data: Vendor[]; pagination: PaginationMeta },
      VendorFilters | void
    >({
      query: (filters) => ({
        url: "/vendors",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Vendor" as const,
                id: String(id),
              })),
              { type: "Vendor", id: "LIST" },
            ]
          : [{ type: "Vendor", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Vendor[];
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

    getVendor: builder.query<Vendor, number>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Vendor", id: String(id) }],
      transformResponse: (response: {
        data: Vendor;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as Vendor;
      },
    }),

    createVendor: builder.mutation<Vendor, CreateVendorData>({
      query: (data) => ({
        url: "/vendors",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Vendor created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create vendor";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateVendor: builder.mutation<
      Vendor,
      { id: number; data: Partial<CreateVendorData> }
    >({
      query: ({ id, data }) => ({
        url: `/vendors/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Vendor", id: String(id) },
        { type: "Vendor", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Vendor updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update vendor";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteVendor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Vendor", id: String(id) },
        { type: "Vendor", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Vendor deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete vendor";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
