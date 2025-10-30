import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface DatasetSubjectPopulation {
  id: number;
  dataset_id: number;
  snapshot_id?: number;
  subject_realm: string;
  jurisdiction: string;
  subjects_total: number;
  as_of: string;
  created_at: string;
  updated_at: string;
  dataset?: {
    id: number;
    name: string;
  };
  snapshot?: {
    id: number;
    version_tag: string;
  };
}

export interface CreateDatasetSubjectPopulationData {
  dataset_id: string;
  snapshot_id?: string;
  subject_realm: string;
  jurisdiction: string;
  subjects_total: number;
  as_of: string;
}

export interface PaginatedDatasetSubjectPopulationResponse {
  current_page: number;
  data: DatasetSubjectPopulation[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
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

export const datasetSubjectPopulationApi = createApi({
  reducerPath: "datasetSubjectPopulationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DatasetSubjectPopulation"],
  endpoints: (builder) => ({
    getDatasetSubjectPopulations: builder.query<
      PaginatedDatasetSubjectPopulationResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = 15 }) => ({
        url: `/dataset-subject-populations?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "DatasetSubjectPopulation" as const,
                id,
              })),
              { type: "DatasetSubjectPopulation", id: "LIST" },
            ]
          : [{ type: "DatasetSubjectPopulation", id: "LIST" }],
    }),

    getDatasetSubjectPopulation: builder.query<
      DatasetSubjectPopulation,
      string
    >({
      query: (id) => ({
        url: `/dataset-subject-populations/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "DatasetSubjectPopulation", id },
      ],
    }),

    createDatasetSubjectPopulation: builder.mutation<
      DatasetSubjectPopulation,
      CreateDatasetSubjectPopulationData
    >({
      query: (data) => ({
        url: "/dataset-subject-populations",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DatasetSubjectPopulation", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset subject population created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create dataset subject population";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDatasetSubjectPopulation: builder.mutation<
      DatasetSubjectPopulation,
      { id: string; data: CreateDatasetSubjectPopulationData }
    >({
      query: ({ id, data }) => ({
        url: `/dataset-subject-populations/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DatasetSubjectPopulation", id },
        { type: "DatasetSubjectPopulation", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset subject population updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update dataset subject population";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDatasetSubjectPopulation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/dataset-subject-populations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DatasetSubjectPopulation", id },
        { type: "DatasetSubjectPopulation", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Dataset subject population deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete dataset subject population";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDatasetSubjectPopulationsQuery,
  useGetDatasetSubjectPopulationQuery,
  useCreateDatasetSubjectPopulationMutation,
  useUpdateDatasetSubjectPopulationMutation,
  useDeleteDatasetSubjectPopulationMutation,
} = datasetSubjectPopulationApi;
