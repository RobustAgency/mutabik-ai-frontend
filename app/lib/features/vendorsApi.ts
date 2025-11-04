import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// Types for vendors
export interface Vendor {
  id: number;
  organization_id: number;
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";
  status: "active" | "inactive" | "pending" | "suspended";
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
  }>;
  metadata: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorFilters {
  search?: string;
  risk_tier?: "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";
  status?: "active" | "inactive" | "pending" | "suspended";
  page?: number;
  per_page?: number;
}

export interface CreateVendorData {
  vendor_name: string;
  legal_name: string;
  hq_country: string;
  risk_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4";
  status: "active" | "inactive" | "pending" | "suspended";
  stakeholder_id: number | null;
  primary_contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role?: string;
  }>;
  metadata?: Record<string, unknown>;
  notes?: string | null;
}

// Custom base query using existing Axios client
const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        data?: unknown;
        message?: string;
        error?: boolean;
        errors?: Record<string, string[]>;
      }>;

      const error = {
        status: err.response?.status || 500,
        data: err.response?.data || {
          message: err.message || "An error occurred",
          error: true,
        },
      };

      return {
        error,
      };
    }
  };

// Type for RTK Query mutation errors
interface MutationError {
  error?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
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
              ...result.data.map(({ id }) => ({ type: "Vendor" as const, id: String(id) })),
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
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
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
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
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
