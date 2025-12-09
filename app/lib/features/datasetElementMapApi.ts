import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface CreateDatasetElementMapData {
  dataset_id: number;
  data_element_id: number;
  column_name: string;
  nullable: "Yes" | "No";
  sensitivity_override?: "Public" | "Internal" | "Confidential" | "Restricted" | null;
  pii_override?: "Inherit" | "Yes" | "No";
  transform_applied?: string | null;
  quality_rules_applied?: string | null;
  cde_in_dataset: "Yes" | "No";
  cde_category_in_dataset?:
    | "Strategic"
    | "Compliance"
    | "External Reporting"
    | "Operational"
    | "Financial"
    | "Risk"
    | "Customer Experience";
  lineage_source_column?: string | null;
  deprecated?: "Yes" | "No";
  // organization_id is validated on backend; usually derived from auth
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
      const result = await apiClient({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        data?: unknown;
        message?: string;
        error?: boolean;
        errors?: Record<string, string[]>;
      }>;
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || { message: err.message || "An error occurred", error: true },
        },
      };
    }
  };

interface MutationError {
  error?: {
    status: number;
    data?: { message?: string; errors?: Record<string, string[]> };
  };
}

export const datasetElementMapApi = createApi({
  reducerPath: "datasetElementMapApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DatasetElementMap"],
  endpoints: (builder) => ({
    createDatasetElementMap: builder.mutation<any, CreateDatasetElementMapData>({
      query: (data) => ({
        url: "/associate-data-element-with-dataset",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DatasetElementMap", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data element associated with dataset");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const msg = mutationError?.error?.data?.message || "Failed to associate data element";
            toast.error(msg);
          }
        }
      },
    }),
  }),
});

export const { useCreateDatasetElementMapMutation } = datasetElementMapApi;


