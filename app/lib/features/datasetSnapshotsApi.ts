import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError } from "@/lib/api/rtkQueryBase";

export interface DatasetSnapshot {
  id: string;
  dataset_id: string;
  version_tag: string;
  source_created_at: string;
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
  dataset?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
}

// Filter types for Dataset Snapshots
export interface DatasetSnapshotFilters {
  per_page?: number | null; // min:1, max:100
  from?: string | null; // date
  to?: string | null; // date, after_or_equal:from
}

export interface CreateDatasetSnapshotData {
  dataset_id: number;
  version_tag: string;
  source_created_at: string;
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

export const datasetSnapshotsApi = createApi({
  reducerPath: "datasetSnapshotsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DatasetSnapshot"],
  endpoints: (builder) => ({
    getDatasetSnapshots: builder.query<
      DatasetSnapshot[],
      DatasetSnapshotFilters | void
    >({
      query: (filters = {}) => ({
        url: "/dataset-snapshots",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "DatasetSnapshot" as const,
                id,
              })),
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
      transformResponse: (response: { data: DatasetSnapshot }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as DatasetSnapshot;
      },
    }),

    createDatasetSnapshot: builder.mutation<
      DatasetSnapshot,
      CreateDatasetSnapshotData
    >({
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

    updateDatasetSnapshot: builder.mutation<
      DatasetSnapshot,
      { id: string; data: Partial<CreateDatasetSnapshotData> }
    >({
      query: ({ id, data }) => ({
        url: `/dataset-snapshots/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DatasetSnapshot", id },
        { type: "DatasetSnapshot", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset snapshot updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update dataset snapshot";
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
  useUpdateDatasetSnapshotMutation,
  useDeleteDatasetSnapshotMutation,
} = datasetSnapshotsApi;
