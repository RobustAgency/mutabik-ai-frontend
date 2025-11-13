import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Types for data sources
export interface DataSource {
  id: string;
  name: string;
  system_type: string;
  owner_team: string;
  data_domains: string[];
  access_method: string;
  residency: string;
  classification: string;
  hosting_model: string;
  service_model: string;
  cloud_provider: string;
  primary_region: string | null;
  secondary_region: string | null;
  network_ref: string | null;
  retention_policy_ref: string | null;
  catalog_uri: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataSourceFilters {
  per_page?: number; // min:1, max:100
  from?: string; // date
  to?: string; // date
  name?: string; // max:255
  system_type?: string; // max:255
  access_method?: string; // max:255
  classification?: string; // max:255
  // Legacy support
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDataSourceData {
  name: string;
  system_type: string;
  owner_team: string;
  data_domains: string[];
  access_method: string;
  residency: string;
  classification: string;
  hosting_model: string;
  service_model: string;
  cloud_provider: string;
  primary_region?: string;
  secondary_region?: string;
  network_ref?: string;
  retention_policy_ref?: string;
  catalog_uri?: string;
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

export const dataSourcesApi = createApi({
  reducerPath: "dataSourcesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DataSource"],
  endpoints: (builder) => ({
    getDataSources: builder.query<DataSource[], DataSourceFilters | void>({
      query: (filters) => ({
        url: "/data-sources",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "DataSource" as const, id })),
              { type: "DataSource", id: "LIST" },
            ]
          : [{ type: "DataSource", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: DataSource[];
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

    getDataSource: builder.query<DataSource, string>({
      query: (id) => ({
        url: `/data-sources/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DataSource", id }],
      transformResponse: (response: {
        data: DataSource;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as DataSource;
      },
    }),

    createDataSource: builder.mutation<DataSource, CreateDataSourceData>({
      query: (data) => ({
        url: "/data-sources",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "DataSource", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data source created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create data source";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataSource: builder.mutation<
      DataSource,
      { id: string; data: Partial<CreateDataSourceData> }
    >({
      query: ({ id, data }) => ({
        url: `/data-sources/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DataSource", id },
        { type: "DataSource", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data source updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update data source";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataSource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/data-sources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DataSource", id },
        { type: "DataSource", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data source deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete data source";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDataSourcesQuery,
  useGetDataSourceQuery,
  useCreateDataSourceMutation,
  useUpdateDataSourceMutation,
  useDeleteDataSourceMutation,
} = dataSourcesApi;

