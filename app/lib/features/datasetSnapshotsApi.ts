import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface DatasetSnapshot {
  id: string;
  dataset_id: string;
  version_tag: string;
  time_range_start: string;
  time_range_end: string;
  row_count: number | null;
  quality_checksums: string | null;
  pii_element_count: number | null;
  special_category_element_count: number | null;
  masking_anonymization_method: string | null;
  privacy_transform_evidence_ref: string | null;
  residency_zone: string;
  storage_uri: string;
  created_at: string;
}

export interface CreateDatasetSnapshotData {
  dataset_id: string;
  version_tag: string;
  time_range_start: string;
  time_range_end: string;
  row_count?: number;
  quality_checksums?: string;
  pii_element_count?: number;
  special_category_element_count?: number;
  masking_anonymization_method?: string;
  privacy_transform_evidence_ref?: string;
  residency_zone: string;
  storage_uri: string;
}

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

interface MutationError {
  error?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export const datasetSnapshotsApi = createApi({
  reducerPath: "datasetSnapshotsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DatasetSnapshot"],
  endpoints: (builder) => ({
    getDatasetSnapshots: builder.query<DatasetSnapshot[], void>({
      query: () => ({
        url: "/dataset-snapshots",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "DatasetSnapshot" as const, id })),
              { type: "DatasetSnapshot", id: "LIST" },
            ]
          : [{ type: "DatasetSnapshot", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: DatasetSnapshot[];
        };
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getDatasetSnapshot: builder.query<DatasetSnapshot, string>({
      query: (id) => ({
        url: `/dataset-snapshots/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DatasetSnapshot", id }],
      transformResponse: (response: {
        data: DatasetSnapshot;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as DatasetSnapshot;
      },
    }),

    createDatasetSnapshot: builder.mutation<DatasetSnapshot, CreateDatasetSnapshotData>({
      query: (data) => ({
        url: "/dataset-snapshots",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "DatasetSnapshot", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset snapshot created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create dataset snapshot";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDatasetSnapshot: builder.mutation<void, string>({
      query: (id) => ({
        url: `/dataset-snapshots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DatasetSnapshot", id },
        { type: "DatasetSnapshot", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset snapshot deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete dataset snapshot";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDatasetSnapshotsQuery,
  useGetDatasetSnapshotQuery,
  useCreateDatasetSnapshotMutation,
  useDeleteDatasetSnapshotMutation,
} = datasetSnapshotsApi;

