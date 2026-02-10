import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

export enum DataType {
  STRING = "string",
  VARCHAR = "varchar",
  INTEGER = "integer",
  BIGINT = "bigint",
  DECIMAL = "decimal",
  FLOAT = "float",
  BOOLEAN = "boolean",
  DATE = "date",
  DATETIME = "datetime",
  TIMESTAMP = "timestamp",
  UUID = "uuid",
  JSON = "json",
  ARRAY = "array",
  BINARY = "binary",
  BLOB = "blob",
  VECTOR = "vector",
  ENUM = "enum",
}

export enum Sensitivity {
  PUBLIC = "Public",
  INTERNAL = "Internal",
  CONFIDENTIAL = "Confidential",
  RESTRICTED = "Restricted",
}

export enum DataSteward {
  DATA_ENGINEERING_TEAM = "data_engineering_team",
  ML_PLATFORM_TEAM = "ml_platform_team",
  PRIVACY_OFFICE = "privacy_office",
  AI_GOVERNANCE_BOARD = "ai_governance_board",
}

export enum Status {
  ACTIVE = "active",
  DEPRECATED = "deprecated",
  RETIRED = "retired",
}

export enum PersonalDataCategory {
  DIRECT_IDENTIFIER = "direct_identifier",
  CONTACT_INFORMATION = "contact_information",
  FINANCIAL_DATA = "financial_data",
  DEMOGRAPHIC = "demographic",
  BEHAVIORAL = "behavioral",
  LOCATION = "location",
  BIOMETRIC = "biometric",
  HEALTH = "health",
  GENETIC = "genetic",
  POLITICAL = "political",
  RELIGIOUS = "religious",
  RACIAL = "racial",
  SEXUAL = "sexual",
  CRIMINAL = "criminal",
  CHILDREN = "children",
}

export enum DefaultMaskingMethod {
  NONE = "none",
  TOKENIZATION = "tokenization",
  HASHING = "hashing",
  ENCRYPTION = "encryption",
  REDACTION = "redaction",
  GENERALIZATION = "generalization",
  K_ANONYMITY = "k_anonymity",
  DIFFERENTIAL_PRIVACY = "differential_privacy",
  PSEUDONYMIZATION = "pseudonymization",
}

// Types for data elements
export interface DataElement {
  id: number;
  display_id?: string;
  name: string;
  data_type: DataType;
  format: string | null;
  business_definition: string;
  data_steward: DataSteward;
  status: Status;
  data_source_id: number;
  database_name: string;
  schema_name: string | null;
  table_name: string;
  column_name: string;
  used_in_datasets: string[] | null;
  is_nullable: boolean | null;
  is_unique: boolean | null;
  default_value: string | null;
  validation_rule: string | null;
  sample_values: string | null;
  sensitivity: Sensitivity;
  contains_personal_data: 0 | 1;
  personal_data_type: PersonalDataCategory | null;
  contains_sensitive_data: 0 | 1 | null;
  default_masking_method: DefaultMaskingMethod | null;
  cde_flag: boolean | null;
  cde_categories: string[];
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
  data_type: DataType;
  format?: string | null;
  business_definition: string;
  data_steward: DataSteward;
  status: Status;
  data_source_id: number;
  database_name: string;
  schema_name?: string | null;
  table_name: string;
  column_name: string;
  used_in_datasets?: string[] | null;
  is_nullable?: boolean | null;
  is_unique?: boolean | null;
  default_value?: string | null;
  validation_rule?: string | null;
  sample_values?: string | null;
  sensitivity: Sensitivity;
  contains_personal_data: 0 | 1;
  personal_data_type?: PersonalDataCategory | null;
  contains_sensitive_data?: 0 | 1 | null;
  default_masking_method?: DefaultMaskingMethod | null;
  cde_flag?: boolean | null;
  cde_categories: string[];
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

export const dataElementsApi = baseApi.injectEndpoints({
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
          // Transform cde_flag from string "1"/"0" to boolean
          const transformedData = response.data.data.map((element) => ({
            ...element,
            cde_flag: typeof element.cde_flag === "string" 
              ? (element.cde_flag === "1" || element.cde_flag === "true")
              : element.cde_flag,
          }));
          return {
            data: transformedData,
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
          // Transform cde_flag from string "1"/"0" to boolean
          return {
            ...response.data,
            cde_flag: typeof response.data.cde_flag === "string" 
              ? (response.data.cde_flag === "1" || response.data.cde_flag === "true")
              : response.data.cde_flag,
          };
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
