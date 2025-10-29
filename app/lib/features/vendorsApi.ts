import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Types for vendors
export interface Vendor {
  id: string;
  name: string;
  type: 'vendor_org';
  description?: string;
  website?: string;
  contact_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorData {
  name: string;
  description?: string;
  website?: string;
  contact_email?: string;
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
    getVendors: builder.query<Vendor[], void>({
      query: () => ({
        url: "/vendors",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Vendor" as const, id })),
              { type: "Vendor", id: "LIST" },
            ]
          : [{ type: "Vendor", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Vendor[];
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

    getVendor: builder.query<Vendor, string>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Vendor", id }],
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
              mutationError?.error?.data?.message ||
              "Failed to create vendor";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateVendor: builder.mutation<
      Vendor,
      { id: string; data: Partial<CreateVendorData> }
    >({
      query: ({ id, data }) => ({
        url: `/vendors/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Vendor", id },
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
              mutationError?.error?.data?.message ||
              "Failed to update vendor";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteVendor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Vendor", id },
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
