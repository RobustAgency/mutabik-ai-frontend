/**
 * KRI Indicator RTK Query API
 * Following frontend rules for RTK Query implementation
 */

import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import {
  MutationError,
  hasValidationErrors,
  PaginationMeta,
} from "@/lib/api/rtkQueryBase";
import {
  KriIndicator,
  CreateKriIndicatorData,
  UpdateKriIndicatorData,
  KriIndicatorFilters,
} from "@/interfaces/KriIndicator";

interface KriIndicatorResponse {
  data: {
  data: KriIndicator[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
  message: string;
  error: boolean;
}

interface SingleKriIndicatorResponse {
  data: KriIndicator;
  message: string;
  error: boolean;
}

export const kriIndicatorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKriIndicators: builder.query<
      { data: KriIndicator[]; pagination: PaginationMeta },
      KriIndicatorFilters | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.name) params.append("name", filters.name);
        if (filters?.status) params.append("status", filters.status);
        if (filters?.frequency) params.append("frequency", filters.frequency);
        if (filters?.directionality) params.append("directionality", filters.directionality);
        if (filters?.collection_method) params.append("collection_method", filters.collection_method);
        if (filters?.action_on_breach) params.append("action_on_breach", filters.action_on_breach);
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.per_page) params.append("per_page", filters.per_page.toString());

        const queryString = params.toString();
        return {
          url: queryString ? `/kri-indicators?${queryString}` : "/kri-indicators",
          method: "GET",
        };
      },
      transformResponse: (response: KriIndicatorResponse) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return {
            data: response.data.data,
            pagination: {
              current_page: response.data.current_page,
              per_page: response.data.per_page,
              total: response.data.total,
              last_page: response.data.last_page,
              from: response.data.from ?? 0,
              to: response.data.to ?? 0,
            },
          };
        }
        return {
          data: [],
          pagination: {
            current_page: 1,
            per_page: 15,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          },
        };
      },
      providesTags: (result) =>
        result?.data && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: "KriIndicator" as const, id })),
              { type: "KriIndicator", id: "LIST" },
            ]
          : [{ type: "KriIndicator", id: "LIST" }],
    }),

    getKriIndicatorById: builder.query<KriIndicator, number>({
      query: (id) => ({
        url: `/kri-indicators/${id}`,
        method: "GET",
      }),
      transformResponse: (response: SingleKriIndicatorResponse) => {
        return response.data;
      },
      providesTags: (result, error, id) => [{ type: "KriIndicator", id }],
    }),

    createKriIndicator: builder.mutation<KriIndicator, CreateKriIndicatorData>({
      query: (data) => ({
        url: "/kri-indicators",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "KriIndicator", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("KRI Indicator created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create KRI Indicator";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateKriIndicator: builder.mutation<
      KriIndicator,
      { id: number; data: UpdateKriIndicatorData }
    >({
      query: ({ id, data }) => ({
        url: `/kri-indicators/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "KriIndicator", id },
        { type: "KriIndicator", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("KRI Indicator updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update KRI Indicator";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteKriIndicator: builder.mutation<void, number>({
      query: (id) => ({
        url: `/kri-indicators/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "KriIndicator", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("KRI Indicator deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete KRI Indicator";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetKriIndicatorsQuery,
  useGetKriIndicatorByIdQuery,
  useCreateKriIndicatorMutation,
  useUpdateKriIndicatorMutation,
  useDeleteKriIndicatorMutation,
} = kriIndicatorApi;

