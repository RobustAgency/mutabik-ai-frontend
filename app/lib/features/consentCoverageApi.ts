import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError } from "@/lib/api/rtkQueryBase";

export interface ConsentCoverage {
  id: string;
  dataset_id: string;
  snapshot_id: string | null;
  purpose: string[];
  jurisdiction: string;
  source_created_at: string;
  as_of: string;
  subjects_total: number;
  subjects_with_valid_consent: number;
  coverage_pct: number;
  evidence_ref: string;
  created_at: string;
  // Optional denormalized fields from backend responses for convenience in UI
  updated_at?: string;
  dataset_name?: string;
  snapshot_version_tag?: string;
  dataset?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
  snapshot?: {
    id: number;
    version_tag: string;
    [key: string]: unknown;
  };
}

// Filter types for Consent Coverages
export interface ConsentCoverageFilters {
  per_page?: number | null; // min:1, max:100
}

export interface CreateConsentCoverageData {
  dataset_id: string;
  snapshot_id?: string;
  purpose: string[];
  jurisdiction: string;
  source_created_at: string;
  as_of: string;
  subjects_total: number;
  subjects_with_valid_consent: number;
  coverage_pct: number;
  evidence_ref: string;
}

export const consentCoverageApi = createApi({
  reducerPath: "consentCoverageApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ConsentCoverage"],
  endpoints: (builder) => ({
    getConsentCoverages: builder.query<
      ConsentCoverage[],
      ConsentCoverageFilters | void
    >({
      query: (filters = {}) => ({
        url: "/consent-coverages",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ConsentCoverage" as const,
                id,
              })),
              { type: "ConsentCoverage", id: "LIST" },
            ]
          : [{ type: "ConsentCoverage", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: ConsentCoverage[];
        };
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getConsentCoverage: builder.query<ConsentCoverage, string>({
      query: (id) => ({
        url: `/consent-coverages/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ConsentCoverage", id }],
      transformResponse: (response: { data: ConsentCoverage }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as ConsentCoverage;
      },
    }),

    createConsentCoverage: builder.mutation<
      ConsentCoverage,
      CreateConsentCoverageData
    >({
      query: (data) => ({
        url: "/consent-coverages",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "ConsentCoverage", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent coverage created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create consent coverage";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateConsentCoverage: builder.mutation<
      ConsentCoverage,
      { id: string; data: Partial<CreateConsentCoverageData> }
    >({
      query: ({ id, data }) => ({
        url: `/consent-coverages/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ConsentCoverage", id },
        { type: "ConsentCoverage", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent coverage updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update consent coverage";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteConsentCoverage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/consent-coverages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ConsentCoverage", id },
        { type: "ConsentCoverage", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Consent coverage deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete consent coverage";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetConsentCoveragesQuery,
  useGetConsentCoverageQuery,
  useCreateConsentCoverageMutation,
  useUpdateConsentCoverageMutation,
  useDeleteConsentCoverageMutation,
} = consentCoverageApi;
