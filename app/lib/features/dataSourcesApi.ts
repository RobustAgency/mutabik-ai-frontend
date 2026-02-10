import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError, hasValidationErrors, PaginationMeta } from "@/lib/api/rtkQueryBase";

export enum SystemType {
  APPLICATION_DB = "Application DB",
  DATA_LAKE = "Data Lake",
  DATA_WAREHOUSE = "Data Warehouse",
  OPERATIONAL_API = "Operational API",
  FILES_BUCKETS = "Files/Buckets",
  THIRD_PARTY_SAAS = "3rd-Party SaaS",
  STREAMING_KAFKA = "Streaming/Kafka",
}

export enum OwnerTeam {
  DATA_ENGINEERING_TEAM = "data_engineering_team",
  ML_PLATFORM_TEAM = "ml_platform_team",
  PRIVACY_OFFICE = "privacy_office",
  AI_GOVERNANCE_BOARD = "ai_governance_board",
}

export enum DataDomain {
  CUSTOMER = "customer",
  FINANCE = "finance",
  OPERATIONS = "operations",
  HUMAN_RESOURCES = "human_resources",
  MARKETING = "marketing",
  PRODUCT = "product",
  SALES = "sales",
  LEGAL = "legal",
  IT_TECHNOLOGY = "it_technology",
  SUPPLY_CHAIN = "supply_chain",
}

export enum DataResidency {
  AE = "ae",
  EU = "eu",
  KSA = "ksa",
  US = "us",
  UK = "uk",
  QA = "qa",
  JO = "jo",
  MA = "ma",
  BH = "bh",
  OTHER = "other",
}

export enum CriticalityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum HostingModel {
  ON_PREM = "on_prem",
  CLOUD = "cloud",
  HYBRID = "hybrid",
}

export enum DataSourceStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  UNDER_REVIEW = "under_review",
  DEPRECATED = "deprecated",
  ARCHIVED = "archived",
}

// Types for data sources
export interface DataSource {
  id: number;
  name: string;
  description?: string | null;
  system_type: SystemType;
  owner_team: OwnerTeam;
  data_domains: DataDomain[];
  residency: DataResidency;
  criticality_level?: CriticalityLevel | null;
  hosting_model: HostingModel;
  technical_owner: OwnerTeam;
  business_owner: OwnerTeam;
  last_review_date?: string | null;
  next_review_date?: string | null;
  status: DataSourceStatus | null;
  created_at: string;
  updated_at: string;
  display_id?: string;
}

export interface DataSourceFilters {
  per_page?: number;
  page?: number;
  name?: string;
  system_type?: SystemType;
  owner_team?: OwnerTeam;
  data_domains?: DataDomain[];
  residency?: DataResidency;
  criticality_level?: CriticalityLevel;
  hosting_model?: HostingModel;
  status?: DataSourceStatus;
  from?: string;
  to?: string;
  search?: string;
  limit?: number;
}

export interface DataSourceListResponse {
  data: {
    current_page: number;
    data: DataSource[];
    per_page: number;
    total: number;
    last_page: number;
  };
  error: boolean;
  message: string;
}

export interface DataSourceItemResponse {
  data: DataSource;
  error: boolean;
  message: string;
}

export interface CreateDataSourceData {
  name: string;
  description?: string | null;
  system_type: SystemType;
  owner_team: OwnerTeam;
  data_domains: DataDomain[];
  residency: DataResidency;
  criticality_level?: CriticalityLevel | null;
  hosting_model: HostingModel;
  technical_owner: OwnerTeam;
  business_owner: OwnerTeam;
  last_review_date?: string | null;
  next_review_date?: string | null;
  status: DataSourceStatus;
}

export const dataSourcesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDataSources: builder.query<
      { data: DataSource[]; pagination?: PaginationMeta },
      DataSourceFilters | void
    >({
      query: (filters = {}) => ({
        url: "/data-sources",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "DataSource" as const,
                id: String(id),
              })),
              { type: "DataSource", id: "LIST" },
            ]
          : [{ type: "DataSource", id: "LIST" }],
      transformResponse: (response: DataSourceListResponse) => {
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

    getDataSource: builder.query<DataSource, string | number>({
      query: (id) => ({
        url: `/data-sources/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "DataSource", id: String(id) },
      ],
      transformResponse: (response: DataSourceItemResponse) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as DataSource;
      },
    }),

    createDataSource: builder.mutation<DataSource, CreateDataSourceData>({
      query: (data) => ({
        url: "/data-sources",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DataSource", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data source created successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create data source";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateDataSource: builder.mutation<
      DataSource,
      { id: number; data: Partial<CreateDataSourceData> }
    >({
      query: ({ id, data }) => ({
        url: `/data-sources/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DataSource", id: String(id) },
        { type: "DataSource", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data source updated successfully");
        } catch (error) {
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update data source";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteDataSource: builder.mutation<void, number>({
      query: (id) => ({
        url: `/data-sources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DataSource", id: String(id) },
        { type: "DataSource", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data source deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete data source";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetDataSourcesQuery,
  useGetDataSourceQuery,
  useCreateDataSourceMutation,
  useUpdateDataSourceMutation,
  useDeleteDataSourceMutation,
} = dataSourcesApi;

