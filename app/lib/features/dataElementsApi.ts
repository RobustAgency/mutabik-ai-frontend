import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

// Types for data elements
export interface DataElement {
  id: string;
  name: string;
  business_definition: string;
  data_type: string;
  format: string | null;
  sensitivity: string;
  pii_flag: string;
  personal_data_category: string | null;
  special_category_flag: string;
  cde_flag: string;
  cde_category: string | null;
  owner_team: string;
  quality_rules_ref: string | null;
  catalog_column_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataElementFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDataElementData {
  name: string;
  business_definition: string;
  data_type: string;
  format?: string;
  sensitivity: string;
  pii_flag: string;
  personal_data_category?: string;
  special_category_flag: string;
  cde_flag: string;
  cde_category?: string;
  owner_team: string;
  quality_rules_ref?: string;
  catalog_column_id?: string;
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

export const dataElementsApi = createApi({
  reducerPath: "dataElementsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DataElement"],
  endpoints: (builder) => ({
    getDataElements: builder.query<DataElement[], DataElementFilters | void>({
      query: (filters) => ({
        url: "/data-elements",
        method: "GET",
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "DataElement" as const, id })),
              { type: "DataElement", id: "LIST" },
            ]
          : [{ type: "DataElement", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: DataElement[];
          current_page: number;
          total: number;
        };
        error?: boolean;
        message?: string;
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getDataElement: builder.query<DataElement, string>({
      query: (id) => ({
        url: `/data-elements/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DataElement", id }],
      transformResponse: (response: {
        data: DataElement;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as DataElement;
      },
    }),

    createDataElement: builder.mutation<DataElement, CreateDataElementData>({
      query: (data) => ({
        url: "/data-elements",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "DataElement", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data element created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create data element";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataElement: builder.mutation<
      DataElement,
      { id: string; data: Partial<CreateDataElementData> }
    >({
      query: ({ id, data }) => ({
        url: `/data-elements/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DataElement", id },
        { type: "DataElement", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data element updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update data element";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataElement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/data-elements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DataElement", id },
        { type: "DataElement", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data element deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete data element";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDataElementsQuery,
  useGetDataElementQuery,
  useCreateDataElementMutation,
  useUpdateDataElementMutation,
  useDeleteDataElementMutation,
} = dataElementsApi;

