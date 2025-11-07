import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface ModelDatasetLink {
  id: string;
  ai_model_id: string;
  ai_model_version_id: number;
  dataset_id: string | null;
  dataset_snapshot_id: string;
  role: string;
  access_path: string | null;
  transform_pack_link: string | null;
  license_check_ref: string | null;
  privacy_check_ref: string | null;
  eligibility_status: string | null;
  notes: string | null;
  created_by: string;
  source_created_at: string;
  created_at: string;
}

export interface CreateModelDatasetLinkData {
  ai_model_id: string;
  ai_model_version_id: number;
  dataset_id?: string;
  dataset_snapshot_id: string;
  role: string;
  access_path?: string;
  transform_pack_link?: string;
  license_check_ref?: string;
  privacy_check_ref?: string;
  eligibility_status?: string;
  notes?: string;
  created_by: string;
  source_created_at: string;
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

export const modelDatasetLinksApi = createApi({
  reducerPath: "modelDatasetLinksApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ModelDatasetLink"],
  endpoints: (builder) => ({
    getModelDatasetLinks: builder.query<ModelDatasetLink[], void>({
      query: () => ({
        url: "/ai-model-datasets",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ModelDatasetLink" as const,
                id,
              })),
              { type: "ModelDatasetLink", id: "LIST" },
            ]
          : [{ type: "ModelDatasetLink", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: ModelDatasetLink[];
        };
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getModelDatasetLink: builder.query<ModelDatasetLink, string>({
      query: (id) => ({
        url: `/ai-model-datasets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ModelDatasetLink", id }],
      transformResponse: (response: { data: ModelDatasetLink }) => {
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
          if (!mutationError?.error?.data?.errors) {
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
      { id: string; data: Partial<CreateModelDatasetLinkData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-model-datasets/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ModelDatasetLink", id },
        { type: "ModelDatasetLink", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model-dataset link updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update model-dataset link";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteModelDatasetLink: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ai-model-datasets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ModelDatasetLink", id },
        { type: "ModelDatasetLink", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Model-dataset link deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete model-dataset link";
          toast.error(errorMessage);
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
  useDeleteModelDatasetLinkMutation,
} = modelDatasetLinksApi;
