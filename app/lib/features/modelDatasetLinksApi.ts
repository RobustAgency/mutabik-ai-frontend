import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError } from "@/lib/api/rtkQueryBase";

export interface ModelDatasetLink {
  id: string;
  ai_model_id: string;
  ai_model_version_id: number;
  dataset_id: string | null;
  dataset_snapshot_id: string | null;
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
  role?: string; // enum: AiModelDataset\Role
  from?: string; // date, before_or_equal:today
  to?: string; // date, before_or_equal:today, after_or_equal:from
  per_page?: number; // min:1, max:100
}

export interface CreateModelDatasetLinkData {
  ai_model_id: string;
  ai_model_version_id: number | null;
  dataset_id?: string;
  dataset_snapshot_id: string | null;
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

export const modelDatasetLinksApi = createApi({
  reducerPath: "modelDatasetLinksApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ModelDatasetLink"],
  endpoints: (builder) => ({
    getModelDatasetLinks: builder.query<
      ModelDatasetLink[],
      ModelDatasetLinkFilters | void
    >({
      query: (filters = {}) => ({
        url: "/ai-model-datasets",
        method: "GET",
        params: filters,
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
