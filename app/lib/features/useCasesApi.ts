import { baseApi } from "@/lib/api/baseApi";
import type { UseCase, CreateUseCaseData } from "@/service/app/useCases";
import {
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
} from "@/lib/api/rtkQueryHelpers";

// Filter types for Use Cases
export interface UseCaseFilters {
  preliminary_risk_level?: string | null;
  business_domain?: string | null;
  owner?: string | null;
  roi_classification?: string | null;
  priority?: string | null;
  data_sensitivity?: string | null;
  to?: string | null; // date
  from?: string | null; // date, before_or_equal:to
  status?: string; // enum: UseCase\Status
  per_page?: number; // min:1, max:100
}

export const useCasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUseCases: builder.query<UseCase[], UseCaseFilters | void>({
      query: (filters = {}) => ({
        url: "/use-cases",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "UseCase" as const, id })),
              { type: "UseCase", id: "LIST" },
            ]
          : [{ type: "UseCase", id: "LIST" }],
      transformResponse: (response: {
        data: { data: { data?: UseCase[] } | UseCase[] };
        error?: boolean;
        message?: string;
      }) => {
        // Handle paginated response: { data: { data: [...] } }
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        // Handle nested paginated response: { data: { data: { data: [...] } } }
        if (
          response.data?.data &&
          typeof response.data.data === "object" &&
          "data" in response.data.data &&
          Array.isArray((response.data.data as any).data)
        ) {
          return (response.data.data as any).data;
        }
        // Handle direct array response
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),

    getUseCase: builder.query<UseCase, number>({
      query: (id) => ({
        url: `/use-cases/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "UseCase", id }],
      transformResponse: (response: {
        data?: UseCase;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as any;
      },
    }),

    createUseCase: builder.mutation<UseCase, CreateUseCaseData>({
      query: (data) => ({
        url: "/use-cases",
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateListTags("UseCase"),
      onQueryStarted: createMutationToastHandler(
        "Use case created successfully",
        "Failed to create use case"
      ),
    }),

    updateUseCase: builder.mutation<
      UseCase,
      { id: number; data: Partial<CreateUseCaseData> }
    >({
      query: ({ id, data }) => ({
        url: `/use-cases/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("UseCase"),
      onQueryStarted: createMutationToastHandler(
        "Use case updated successfully",
        "Failed to update use case"
      ),
    }),

    deleteUseCase: builder.mutation<void, number>({
      query: (id) => ({
        url: `/use-cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateItemAndListTags("UseCase"),
      onQueryStarted: createDeleteToastHandler(
        "Use case deleted successfully",
        "Failed to delete use case"
      ),
    }),
  }),
});

export const {
  useGetUseCasesQuery,
  useGetUseCaseQuery,
  useCreateUseCaseMutation,
  useUpdateUseCaseMutation,
  useDeleteUseCaseMutation,
} = useCasesApi;
