import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums matching Laravel backend
export enum FileFormat {
  PARQUET = "parquet",
  JSON = "json",
  CSV = "csv",
  XML = "xml",
  AVRO = "avro",
  ORC = "orc",
  DELTA_LAKE = "delta_lake",
  APACHE_ICEBERG = "apache_iceberg",
  XLSX = "xlsx",
  OTHER = "other",
}

export enum ResidencyZone {
  AE = "AE",
  EU = "EU",
  KSA = "KSA",
  US = "US",
  UK = "UK",
  QA = "QA",
  JO = "JO",
  MA = "MA",
  BH = "BH",
  OTHER = "Other",
}

export enum StorageTier {
  HOT = "hot",
  COLD = "cold",
  WARM = "warm",
  ARCHIVE = "archive",
}

export enum Compression {
  GZIP = "gzip",
  SNAPPY = "snappy",
  LZ4 = "lz4",
  ZSTD = "zstd",
  NONE = "none",
}

export enum EncryptionStatus {
  ENCRYPTED_AT_REST = "encrypted_at_rest",
  ENCRYPTED_AT_TRANSIT = "encrypted_at_transit",
  ENCRYPTED_AT_REST_AND_TRANSIT = "encrypted_at_rest_and_transit",
  UNENCRYPTED = "unencrypted",
  NONE = "none",
}

export enum MaskingMethod {
  NONE = "none",
  TOKENIZATION = "tokenization",
  HASHING = "hashing",
  ENCRYPTION = "encryption",
  BASE64_ENCODE = "base64_encode",
  REDACTION = "redaction",
  GENERALIZATION = "generalization",
  PSEUDONYMIZATION = "pseudonymization",
  DIFFERENTIAL_PRIVACY = "differential_privacy",
  K_ANONYMIZATION = "k_anonymization",
}

export enum ApprovedBy {
  DATA_ENGINEERING_TEAM = "data_engineering_team",
  ML_PLATFORM_TEAM = "ml_platform_team",
  PRIVACY_OFFICE = "privacy_office",
  AI_GOVERNANCE_BOARD = "ai_governance_board",
}

export enum Status {
  ACTIVE = "active",
  DEPRECATED = "deprecated",
  ARCHIVED = "archived",
}

// Types for dataset snapshots
export interface DatasetSnapshot {
  id: number;
  dataset_id: number;
  version_tag: string;
  supersedes_snapshot_id?: number | null;
  description?: string | null;
  time_range_start: string;
  time_range_end: string;
  row_count: number;
  file_count?: number | null;
  total_size?: number | null;
  size_unit?: string | null;
  file_format: FileFormat;
  pii_element_count?: number | null;
  consent_coverage_at_creation?: number | null;
  residency_zone: ResidencyZone;
  storage_uri: string;
  storage_tier?: StorageTier | null;
  compression?: Compression | null;
  encryption_status: EncryptionStatus;
  masking_method_applied?: MaskingMethod | null;
  quality_checksums?: string | null;
  created_by_system?: boolean | null;
  approved_by?: ApprovedBy | null;
  expiration_date?: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  display_id?: string;
  dataset?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
}

// Filter types for Dataset Snapshots
export interface DatasetSnapshotFilters {
  per_page?: number | null; // min:1, max:100
  page?: number;
  from?: string | null; // date
  to?: string | null; // date, after_or_equal:from
  // Legacy support
  search?: string;
}

export interface CreateDatasetSnapshotData {
  dataset_id: number;
  version_tag: string;
  supersedes_snapshot_id?: number | null;
  description?: string | null;
  time_range_start: string;
  time_range_end: string;
  row_count: number;
  file_count?: number | null;
  total_size?: number | null;
  size_unit?: string | null;
  file_format: FileFormat;
  pii_element_count?: number | null;
  consent_coverage_at_creation?: number | null;
  residency_zone: ResidencyZone;
  storage_uri: string;
  storage_tier?: StorageTier | null;
  compression?: Compression | null;
  encryption_status: EncryptionStatus;
  masking_method_applied?: MaskingMethod | null;
  quality_checksums?: string | null;
  created_by_system?: boolean | null;
  approved_by?: ApprovedBy | null;
  expiration_date?: string | null;
  status: Status;
}

export interface DatasetSnapshotListResponse {
  data: {
    data: DatasetSnapshot[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  error?: boolean;
  message?: string;
}

export interface DatasetSnapshotItemResponse {
  data: DatasetSnapshot;
  error?: boolean;
  message?: string;
}

export const datasetSnapshotsApi = createApi({
  reducerPath: "datasetSnapshotsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DatasetSnapshot"],
  endpoints: (builder) => ({
    getDatasetSnapshots: builder.query<
      { data: DatasetSnapshot[]; pagination?: PaginationMeta },
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
              ...result.data.map(({ id }) => ({
                type: "DatasetSnapshot" as const,
                id: String(id),
              })),
              { type: "DatasetSnapshot", id: "LIST" },
            ]
          : [{ type: "DatasetSnapshot", id: "LIST" }],
      transformResponse: (response: DatasetSnapshotListResponse) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          const { current_page, per_page, total, last_page } = response.data;
          const from = (current_page - 1) * per_page + 1;
          const to = Math.min(current_page * per_page, total);
          return {
            data: response.data.data,
            pagination: {
              current_page,
              per_page,
              total,
              last_page,
              from,
              to,
            },
          };
        }
        return { data: [], pagination: undefined };
      },
    }),

    getDatasetSnapshot: builder.query<DatasetSnapshot, number>({
      query: (id) => ({
        url: `/dataset-snapshots/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DatasetSnapshot", id: String(id) }],
      transformResponse: (response: DatasetSnapshotItemResponse) => {
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
          if (!hasValidationErrors(mutationError)) {
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
      { id: number; data: Partial<CreateDatasetSnapshotData> }
    >({
      query: ({ id, data }) => ({
        url: `/dataset-snapshots/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DatasetSnapshot", id: String(id) },
        { type: "DatasetSnapshot", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset snapshot updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!hasValidationErrors(mutationError)) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update dataset snapshot";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDatasetSnapshot: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dataset-snapshots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DatasetSnapshot", id: String(id) },
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
