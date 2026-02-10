import { baseApi } from "@/lib/api/baseApi";
import {
  Organization,
  OrganizationFilters,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
} from "@/interfaces/Organization";
import {
  transformListResponseWithPagination,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
} from "@/lib/api/rtkQueryHelpers";
import { PaginationMeta } from "@/lib/api/rtkQueryBase";

export interface OrganizationListResponse {
  error?: boolean;
  message?: string;
  data?: {
    data: Organization[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface OrganizationSingleResponse {
  error?: boolean;
  message?: string;
  data?: Organization;
}

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<
      { data: Organization[]; pagination: PaginationMeta },
      OrganizationFilters | void
    >({
      query: (filters) => ({
        url: "/admin/organizations",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithPagination<Organization>,
      providesTags: (result) => createListTags(result, "Organization"),
    }),
    getOrganization: builder.query<Organization, string | number>({
      query: (id) => ({
        url: `/admin/organizations/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<Organization>,
      providesTags: createItemTags("Organization"),
    }),
    createOrganization: builder.mutation<unknown, CreateOrganizationRequest>({
      query: (data) => ({
        url: "/admin/organizations",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("Organization"),
    }),
    updateOrganization: builder.mutation<
      unknown,
      { id: string | number; data: UpdateOrganizationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/organizations/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("Organization"),
    }),
    deleteOrganization: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/admin/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateItemAndListTags("Organization"),
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationsApi;

