import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError } from "@/lib/api/rtkQueryBase";

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

// Filter types for Dataset Subject Populations
export interface DatasetSubjectPopulationFilters {
  subject_realm?: string; // max:255
  jurisdiction?: string; // max:255
  from?: string; // date, before_or_equal:today
  to?: string; // date, before_or_equal:today, after_or_equal:from
  per_page?: number; // min:1, max:100
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

export const datasetSubjectPopulationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDatasetSubjectPopulations: builder.query<
      PaginatedDatasetSubjectPopulationResponse,
      DatasetSubjectPopulationFilters | void
    >({
      query: (filters = {}) => ({
        url: "/dataset-subject-populations",
        method: "GET",
        params: filters,
      }),
      transformResponse: (response: any) => response.data,
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
      transformResponse: (response: any) => response.data,
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
      transformResponse: (response: any) => response.data,
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
        method: "POST",
        data,
      }),
      transformResponse: (response: any) => response.data,
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
