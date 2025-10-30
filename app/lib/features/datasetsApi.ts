import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Types for datasets
export interface Dataset {
  id: string;
  name: string;
  source_ids: string[];
  purpose: string;
  schema_summary: string | null;
  sensitivity: string;
  contains_pii: string;
  data_subject_categories: string[];
  controller_role: string;
  lawful_basis: string | null;
  lawful_basis_detail: string | null;
  consent_required: boolean;
  consent_coverage_pct: number | null;
  consent_source_ref: string | null;
  licensing_basis: string | null;
  license_type: string | null;
  privacy_notice_ref: string | null;
  cross_border_transfer: string;
  data_structure: string;
  storage_format: string;
  content_types: string[];
  retention_policy_ref: string | null;
  dpia_ref: string | null;
  aia_ref: string | null;
  owner_team: string;
  refresh_cadence: string | null;
  quality_SLA: string | null;
  catalog_asset_id: string | null;
  catalog_uri: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatasetFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDatasetData {
  name: string;
  source_ids: string[];
  purpose: string;
  schema_summary?: string;
  sensitivity: string;
  contains_pii: string;
  data_subject_categories: string[];
  controller_role: string;
  lawful_basis?: string;
  lawful_basis_detail?: string;
  consent_required: boolean;
  consent_coverage_pct?: number;
  consent_source_ref?: string;
  licensing_basis?: string;
  license_type?: string;
  privacy_notice_ref?: string;
  cross_border_transfer: string;
  data_structure: string;
  storage_format: string;
  content_types?: string[];
  retention_policy_ref?: string;
  dpia_ref?: string;
  aia_ref?: string;
  owner_team: string;
  refresh_cadence?: string;
  quality_SLA?: string;
  catalog_asset_id?: string;
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

export const datasetsApi = createApi({
  reducerPath: "datasetsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Dataset"],
  endpoints: (builder) => ({
    getDatasets: builder.query<Dataset[], DatasetFilters | void>({
      query: (filters) => ({
        url: "/datasets",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Dataset" as const, id })),
              { type: "Dataset", id: "LIST" },
            ]
          : [{ type: "Dataset", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Dataset[];
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

    getDataset: builder.query<Dataset, string>({
      query: (id) => ({
        url: `/datasets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Dataset", id }],
      transformResponse: (response: {
        data: Dataset;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as Dataset;
      },
    }),

    createDataset: builder.mutation<Dataset, CreateDatasetData>({
      query: (data) => ({
        url: "/datasets",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "Dataset", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create dataset";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataset: builder.mutation<
      Dataset,
      { id: string; data: Partial<CreateDatasetData> }
    >({
      query: ({ id, data }) => ({
        url: `/datasets/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Dataset", id },
        { type: "Dataset", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update dataset";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/datasets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Dataset", id },
        { type: "Dataset", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete dataset";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDatasetsQuery,
  useGetDatasetQuery,
  useCreateDatasetMutation,
  useUpdateDatasetMutation,
  useDeleteDatasetMutation,
} = datasetsApi;

