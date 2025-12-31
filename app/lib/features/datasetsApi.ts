import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums matching Laravel backend
export enum Purpose {
  AI_ML_TRAINING = "ai_ml_training",
  AI_ML_FINE_TUNING = "ai_ml_fine_tuning",
  AI_ML_RETRIEVAL = "ai_ml_retrieval",
  AI_ML_EVALUATION = "ai_ml_evaluation",
  ANALYTIC_BUSINESS_INTELLIGENCE = "analytic_business_intelligence",
  OPERATIONAL_TRANSFORMATION = "operational_transformation",
  MASTER_DATA = "master_data",
  REFERENCE_DATA = "reference_data",
  REPORTING = "reporting",
  COMPLIANCE_AUDIT = "compliance_audit",
  ARCHIVAL_HISTORICAL = "archival_historical",
}

export enum OwnerTeam {
  DATA_ENGINEERING_TEAM = "data_engineering_team",
  ML_PLATFORM_TEAM = "ml_platform_team",
  PRIVACY_OFFICE = "privacy_office",
  AI_GOVERNANCE_BOARD = "ai_governance_board",
}

export enum DataSteward {
  DATA_ENGINEER = "data_engineer",
  DATA_SCIENTIST = "data_scientist",
  ML_ENGINEER = "ml_engineer",
  PRIVACY_OFFICER = "privacy_officer",
  COMPLIANCE_OFFICER = "compliance_officer",
}

export enum Status {
  DRAFT = "draft",
  ACTIVE = "active",
  UNDER_REVIEW = "under_review",
  DEPRECATED = "deprecated",
  ARCHIVED = "archived",
}

export enum SizeUnit {
  BYTES = "bytes",
  KILOBYTES = "kilobytes",
  MEGABYTES = "megabytes",
  GIGABYTES = "gigabytes",
  TERABYTES = "terabytes",
}

export enum PrimaryLanguage {
  ENGLISH = "english",
  SPANISH = "spanish",
  FRENCH = "french",
  GERMAN = "german",
  CHINESE_MANDARIN = "chinese_mandarin",
  JAPANESE = "japanese",
  KOREAN = "korean",
  ARABIC = "arabic",
  PORTUGUESE = "portuguese",
  HINDI = "hindi",
  RUSSIAN = "russian",
  ITALIAN = "italian",
  DUTCH = "dutch",
  MULTI_LANGUAGE = "multi_language",
  CODE_NUMERIC_ONLY = "code_numeric_only",
  OTHER = "other",
}

export enum ContainPersonalData {
  YES = "yes",
  NO = "no",
  UNKNOWN = "unknown",
}

export enum Sensitivity {
  PUBLIC = "Public",
  INTERNAL = "Internal",
  CONFIDENTIAL = "Confidential",
  RESTRICTED = "Restricted",
}

export enum CrossBorderTransfer {
  NONE = "none",
  ADEQUACY_DECISION = "adequacy_decision",
  STANDARD_CONTRACTUAL_CLAUSES = "standard_contractual_clauses",
  BINDING_CORPORATE_RULES = "binding_corporate_rules",
  EXPLICIT_CONSENT_FOR_TRANSFER = "explicit_consent_for_transfer",
  DEROGATION = "derogation",
}

export enum LicenseType {
  PROPRIETARY = "proprietary",
  OPEN_SOURCE = "open_source",
  PURCHASES = "purchased",
  COMMERCIAL_LICENSE = "commercial_license",
  RESEARCH_USE_ONLY = "research_use_only",
  NO_RESTRICTIONS = "no_restrictions",
}

// Types for datasets
export interface Dataset {
  id: number;
  name: string;
  description?: string | null;
  purpose: Purpose;
  owner_team: OwnerTeam;
  data_steward: DataSteward;
  source_ids: number[];
  status: Status;
  estimated_row_count?: number | null;
  estimated_size?: number | null;
  size_unit?: SizeUnit | null;
  retention_period?: string | null;
  primary_languages?: PrimaryLanguage[] | null;
  contains_personal_data: ContainPersonalData;
  sensitivity: Sensitivity;
  cross_border_transfer: CrossBorderTransfer;
  license_type?: LicenseType | null;
  created_at: string;
  updated_at: string;
  display_id?: string;
}

export interface DatasetFilters {
  per_page?: number;
  page?: number;
  name?: string;
  purpose?: Purpose;
  owner_team?: OwnerTeam;
  status?: Status;
  sensitivity?: Sensitivity;
  contains_personal_data?: ContainPersonalData;
  cross_border_transfer?: CrossBorderTransfer;
  search?: string;
  limit?: number;
}

export interface DatasetListResponse {
  data: Dataset[];
  pagination?: PaginationMeta;
}

export interface DatasetItemResponse {
  data: Dataset;
  error: boolean;
  message: string;
}

export interface CreateDatasetData {
  name: string;
  description?: string | null;
  purpose: Purpose;
  owner_team: OwnerTeam;
  data_steward: DataSteward;
  source_ids: number[];
  status: Status;
  estimated_row_count?: number | null;
  estimated_size?: number | null;
  size_unit?: SizeUnit | null;
  retention_period?: string | null;
  primary_languages?: PrimaryLanguage[] | null;
  contains_personal_data: ContainPersonalData;
  sensitivity: Sensitivity;
  cross_border_transfer: CrossBorderTransfer;
  license_type?: LicenseType | null;
}

export const datasetsApi = createApi({
  reducerPath: "datasetsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Dataset"],
  endpoints: (builder) => ({
    getDatasets: builder.query<DatasetListResponse, DatasetFilters>({
      query: (filters) => ({
        url: "/datasets",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Dataset" as const, id: String(id) })),
              { type: "Dataset", id: "LIST" },
            ]
          : [{ type: "Dataset", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: Dataset[];
          current_page: number;
          per_page: number;
          total: number;
          last_page: number;
          from?: number;
          to?: number;
        };
        error?: boolean;
        message?: string;
      }): DatasetListResponse => {
        if (response?.data?.data && Array.isArray(response.data.data)) {
          const { current_page, per_page, total, last_page, from, to } = response.data;
          return {
            data: response.data.data,
            pagination: {
              current_page,
              per_page,
              total,
              last_page,
              from: from ?? (current_page - 1) * per_page + 1,
              to: to ?? Math.min(current_page * per_page, total),
            },
          };
        }
        return { data: [], pagination: undefined };
      },
    }),

    getDataset: builder.query<Dataset, number>({
      query: (id) => ({
        url: `/datasets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Dataset", id: String(id) }],
      transformResponse: (response: {
        data: Dataset;
        error?: boolean;
        message?: string;
      }): Dataset => {
        return response.data;
      },
    }),

    createDataset: builder.mutation<DatasetItemResponse, CreateDatasetData>({
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
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create dataset";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataset: builder.mutation<
      DatasetItemResponse,
      { id: number; data: Partial<CreateDatasetData> }
    >({
      query: ({ id, data }) => ({
        url: `/datasets/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Dataset", id: String(id) },
        { type: "Dataset", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to update dataset";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataset: builder.mutation<void, number>({
      query: (id) => ({
        url: `/datasets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Dataset", id: String(id) },
        { type: "Dataset", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message || "Failed to delete dataset";
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
