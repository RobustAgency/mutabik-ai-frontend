import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { PaginationMeta } from "@/lib/api/rtkQueryBase";
import {
  transformListResponseWithPagination,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
} from "@/lib/api/rtkQueryHelpers";

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

export const vendorsApi = baseApi.injectEndpoints({
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
      transformResponse: transformListResponseWithPagination<Vendor>,
      providesTags: (result) => createListTags(result, "Vendor"),
    }),

    getVendor: builder.query<Vendor, string | number>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<Vendor>,
      providesTags: createItemTags("Vendor"),
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
      onQueryStarted: createMutationToastHandler(
        "Vendor created successfully",
        "Failed to create vendor"
      ),
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
      onQueryStarted: createMutationToastHandler(
        "Vendor updated successfully",
        "Failed to update vendor"
      ),
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
      onQueryStarted: createDeleteToastHandler(
        "Vendor deleted successfully",
        "Failed to delete vendor"
      ),
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
