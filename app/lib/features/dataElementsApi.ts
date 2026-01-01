import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

// Enums matching Laravel backend
export enum DataType {
  STRING = "string",
  INTEGER = "integer",
  DECIMAL = "decimal",
  BOOLEAN = "boolean",
  DATE = "date",
  DATETIME = "datetime",
  TIMESTAMP = "timestamp",
  JSON = "json",
  BINARY = "binary",
  ARRAY = "array",
  OTHER = "other",
}

export enum Sensitivity {
  PUBLIC = "Public",
  INTERNAL = "Internal",
  CONFIDENTIAL = "Confidential",
  RESTRICTED = "Restricted",
}

export enum PiiFlag {
  YES = "Yes",
  NO = "No",
  MAY_CONTAIN = "May_Contain",
}

export enum PersonalDataCategory {
  IDENTIFIER = "Identifier",
  CONTACT = "Contact",
  FINANCIAL = "Financial",
  BEHAVIORAL = "Behavioral",
  LOCATION = "Location",
  BIOMETRIC = "Biometric",
  HEALTH = "Health",
  SENSITIVE_OTHER = "Sensitive-Other",
}

export enum SpecialCategoryFlag {
  YES = "Yes",
  NO = "No",
}

export enum CdeFlag {
  YES = "Yes",
  NO = "No",
}

export enum CdeCategory {
  STRATEGIC = "Strategic",
  COMPLIANCE = "Compliance",
  EXTERNAL_REPORTING = "External Reporting",
  OPERATIONAL = "Operational",
  FINANCIAL = "Financial",
  RISK = "Risk",
  CUSTOMER_EXPERIENCE = "Customer Experience",
}

// Types for data elements
export interface DataElement {
  id: number;
  display_id?: string;
  name: string;
  business_definition: string | null;
  data_type: DataType;
  format: string | null;
  sensitivity: Sensitivity;
  pii_flag: PiiFlag;
  personal_data_category: PersonalDataCategory | null;
  special_category_flag: SpecialCategoryFlag;
  cde_flag: CdeFlag;
  cde_category: CdeCategory | null;
  owner_team: string | null;
  quality_rules_ref: string | null;
  catalog_column_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataElementFilters {
  per_page?: number | null; // min:1, max:100
  from?: string | null; // date
  to?: string | null; // date
  name?: string | null; // max:255
  data_type?: string | null; // max:255
  // Legacy support
  search?: string;
  page?: number;
}

export interface CreateDataElementData {
  name: string;
  business_definition?: string | null;
  data_type: DataType;
  format?: string | null;
  sensitivity: Sensitivity;
  pii_flag: PiiFlag;
  personal_data_category?: PersonalDataCategory | null;
  special_category_flag: SpecialCategoryFlag;
  cde_flag: CdeFlag;
  cde_category?: CdeCategory | null;
  owner_team?: string | null;
  quality_rules_ref?: string | null;
  catalog_column_id?: string | null;
}

export interface DataElementListResponse {
  data: {
    data: DataElement[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  error?: boolean;
  message?: string;
}

export interface DataElementItemResponse {
  data: DataElement;
  error?: boolean;
  message?: string;
}

export const dataElementsApi = createApi({
  reducerPath: "dataElementsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DataElement"],
  endpoints: (builder) => ({
    getDataElements: builder.query<
      { data: DataElement[]; pagination?: PaginationMeta },
      DataElementFilters | void
    >({
      query: (filters = {}) => ({
        url: "/data-elements",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "DataElement" as const,
                id: String(id),
              })),
              { type: "DataElement", id: "LIST" },
            ]
          : [{ type: "DataElement", id: "LIST" }],
      transformResponse: (response: DataElementListResponse) => {
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
        return { data: [] };
      },
    }),

    getDataElement: builder.query<DataElement, string | number>({
      query: (id) => ({
        url: `/data-elements/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "DataElement", id: String(id) },
      ],
      transformResponse: (response: DataElementItemResponse) => {
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
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
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
      { id: string | number; data: Partial<CreateDataElementData> }
    >({
      query: ({ id, data }) => ({
        url: `/data-elements/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DataElement", id: String(id) },
        { type: "DataElement", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data element updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update data element";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataElement: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/data-elements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DataElement", id: String(id) },
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
