import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums
export enum VendorType {
  MODEL_PROVIDER = "model_provider",
  DATASET_PROVIDER = "dataset_provider",
  INFRASTRUCTURE_CLOUD = "infrastructure_cloud",
  SAAS_PLATFORM = "saas_platform",
  CONSULTING_SERVICES = "consulting_services",
  HARDWARE_PROVIDER = "hardware_provider",
  API_SERVICE = "api_service",
  ANNOTATION_LABELING = "annotation_labeling",
  OTHER = "other",
}

export enum VendorRiskTier {
  TIER_1 = "tier_1",
  TIER_2 = "tier_2",
  TIER_3 = "tier_3",
  TIER_4 = "tier_4",
}

export enum VendorStatus {
  EVALUATING = "evaluating",
  APPROVED = "approved",
  CONDITIONALLY_APPROVED = "conditionally_approved",
  RESTRICTED = "restricted",
  SUSPENDED = "suspended",
  TERMINATED = "terminated",
}

export enum DataProcessingRole {
  CONTROLLER = "controller",
  PROCESSOR = "processor",
  SUB_PROCESSOR = "sub_processor",
  NOT_APPLICABLE = "not_applicable",
}

// Types for vendors
export interface Vendor {
  id: number;
  organization_id: number;
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: VendorRiskTier;
  status: VendorStatus;
  type: VendorType[] | null;
  data_processing_role: DataProcessingRole | null;
  service_provided: string | null;
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string | null;
    role?: string | null;
    primary?: boolean | null;
  }>;
  metadata: Record<string, unknown> | null;
  duns_number?: string | null;
  lei_number?: string | null;
  tax_id?: string | null;
  stock_ticker?: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  display_id?: string;
}

export interface VendorFilters {
  risk_tier?: string | null;
  status?: string | null;
  owner?: string | null;
  from?: string | null;
  to?: string | null;
  per_page?: number | null;
  page?: number;
  search?: string;
}

export interface PrimaryContact {
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
  primary?: boolean | null;
}

export interface CreateVendorData {
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: VendorRiskTier;
  status: VendorStatus;
  type: VendorType[];
  data_processing_role: DataProcessingRole;
  service_provided?: string | null;
  primary_contacts?: PrimaryContact[];
  metadata?: Record<string, unknown> | null;
  duns_number?: string | null;
  lei_number?: string | null;
  tax_id?: string | null;
  stock_ticker?: string | null;
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
      providesTags: (result) => {
        if (!result) {
          return [{ type: "Vendor", id: "LIST" }];
        }
        // Handle transformed response format
        const vendors = result.data && Array.isArray(result.data) ? result.data : [];
        return [
          ...vendors.map(({ id }) => ({ type: "Vendor" as const, id: String(id) })),
          { type: "Vendor", id: "LIST" },
        ];
      },
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

    getVendor: builder.query<Vendor, string | number>({
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

    getVendorStatistics: builder.query<
      {
        total_count: number;
        approved_count: number;
        evaluating_count: number;
      },
      void
    >({
      query: () => ({
        url: "/vendors/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Vendor", id: "STATISTICS" }],
      transformResponse: (response: {
        data: {
          total_count: number;
          approved_count: number;
          evaluating_count: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        return response.data;
      },
    }),

    createVendor: builder.mutation<Vendor, CreateVendorData>({
      query: (data) => ({
        url: "/vendors",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [
        { type: "Vendor", id: "LIST" },
        { type: "Vendor", id: "STATISTICS" },
      ],
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
        { type: "Vendor", id: "STATISTICS" },
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
        { type: "Vendor", id: "STATISTICS" },
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
  useGetVendorStatisticsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
