import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums matching Laravel backend
export enum Role {
  PRETRAIN = "pretrain",
  TRAIN = "train",
  FINE_TUNE = "fine_tune",
  ALIGN_RLHF = "align_rlhf",
  VALIDATION = "validation",
  TEST = "test",
  EVAL_BENCHMARK = "eval_benchmark",
  RAG_CORPUS = "rag_corpus",
  DRIFT_BASELINE = "drift_baseline",
  ONLINE_FEEDBACK = "online_feedback",
}

export enum ConsentCheckStatus {
  PASSED = "passed",
  WARNING = "warning",
  FAILED = "failed",
  NOT_APPLICABLE = "not_applicable",
}

export enum CrossBorderCheck {
  PASSED = "passed",
  FAILED = "failed",
  NOT_APPLICABLE = "not_applicable",
}

export enum SpecialCategoryCheck {
  PASSED = "passed",
  FAILED = "failed",
  NOT_APPLICABLE = "not_applicable",
}

export enum CreatedBy {
  DATA_ENGINEERING_TEAM = "data_engineering_team",
  ML_PLATFORM_TEAM = "ml_platform_team",
  PRIVACY_OFFICE = "privacy_office",
  AI_GOVERNANCE_BOARD = "ai_governance_board",
}

export enum LinkageStatus {
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  ACTIVE = "active",
  DEPRECATED = "deprecated",
  ARCHIVED = "archived",
}

export interface ModelDatasetLink {
  id: number;
  ai_model_id: number;
  ai_model_version_id: number;
  dataset_id: number;
  dataset_snapshot_id?: number | null;
  role: Role;
  rows_used?: number | null;
  training_start_date?: string | null;
  training_end_date?: string | null;
  training_duration?: string | null;
  compute_resources?: string | null;
  cost?: number | null;
  consent_check_status?: ConsentCheckStatus | null;
  cross_border_check: CrossBorderCheck;
  special_category_check: SpecialCategoryCheck;
  bias_mitigation_applied?: boolean | null;
  created_by_system: CreatedBy;
  linkage_status: LinkageStatus;
  business_justification?: string | null;
  created_at: string;
  updated_at: string;
  display_id?: string;
  ai_model?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
  ai_model_version?: {
    id: number;
    version_number: string;
    [key: string]: unknown;
  };
  dataset?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
  dataset_snapshot?: {
    id: number;
    version_tag: string;
    [key: string]: unknown;
  };
}

// Filter types for AI Model Datasets (Model Dataset Links)
export interface ModelDatasetLinkFilters {
  per_page?: number | null; // min:1, max:100
  page?: number | null;
  role?: Role | null;
  from?: string | null; // date
  to?: string | null; // date, after_or_equal:from
  search?: string | null;
}

export interface CreateModelDatasetLinkData {
  ai_model_id: number;
  ai_model_version_id: number;
  dataset_id: number;
  dataset_snapshot_id?: number | null;
  role: Role;
  rows_used?: number | null;
  training_start_date?: string | null;
  training_end_date?: string | null;
  training_duration?: string | null;
  compute_resources?: string | null;
  cost?: number | null;
  consent_check_status?: ConsentCheckStatus | null;
  cross_border_check: CrossBorderCheck;
  special_category_check: SpecialCategoryCheck;
  bias_mitigation_applied?: boolean | null;
  created_by_system: CreatedBy;
  linkage_status: LinkageStatus;
  business_justification?: string | null;
}

export interface ModelDatasetLinkListResponse {
  data: {
    data: ModelDatasetLink[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
  };
  error?: boolean;
  message?: string;
}

export interface ModelDatasetLinkItemResponse {
  data: ModelDatasetLink;
  error?: boolean;
  message?: string;
}

export const modelDatasetLinksApi = createApi({
  reducerPath: "modelDatasetLinksApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ModelDatasetLink"],
  endpoints: (builder) => ({
    getModelDatasetLinks: builder.query<
      { data: ModelDatasetLink[]; pagination?: PaginationMeta },
      ModelDatasetLinkFilters | void
    >({
      query: (filters = {}) => ({
        url: "/ai-model-datasets",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "ModelDatasetLink" as const,
                id: String(id),
              })),
              { type: "ModelDatasetLink", id: "LIST" },
            ]
          : [{ type: "ModelDatasetLink", id: "LIST" }],
      transformResponse: (response: ModelDatasetLinkListResponse) => {
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

    getModelDatasetLink: builder.query<ModelDatasetLink, number>({
      query: (id) => ({
        url: `/ai-model-datasets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ModelDatasetLink", id: String(id) }],
      transformResponse: (response: ModelDatasetLinkItemResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as ModelDatasetLink;
      },
    }),

    createModelDatasetLink: builder.mutation<
      ModelDatasetLink,
      CreateModelDatasetLinkData
    >({
      query: (data) => ({
        url: "/ai-model-datasets",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "ModelDatasetLink", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model-dataset link created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!hasValidationErrors(mutationError)) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create model-dataset link";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateModelDatasetLink: builder.mutation<
      ModelDatasetLink,
      { id: number; data: Partial<CreateModelDatasetLinkData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-model-datasets/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ModelDatasetLink", id: String(id) },
        { type: "ModelDatasetLink", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model-dataset link updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!hasValidationErrors(mutationError)) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update model-dataset link";
            toast.error(errorMessage);
          }
        }
      },
    }),
  }),
});

export const {
  useGetModelDatasetLinksQuery,
  useGetModelDatasetLinkQuery,
  useCreateModelDatasetLinkMutation,
  useUpdateModelDatasetLinkMutation,
} = modelDatasetLinksApi;
