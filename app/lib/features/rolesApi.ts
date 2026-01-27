import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import type { UserRole, UserRoleFilters } from "@/interfaces/UserRole";
import type { Permission } from "@/interfaces/Permission";
import {
  type ListResponseWithMeta,
  type SingleItemResponse,
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
} from "@/lib/api/rtkQueryHelpers";

export interface RolesListResponse extends ListResponseWithMeta<UserRole> {}

export type PermissionsTree = Record<string, Record<string, Permission[]>>;

export interface PermissionsListResponse {
  error?: boolean;
  message?: string;
  data?: PermissionsTree;
}

export interface RolesWithMeta {
  data: UserRole[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page?: number;
  };
}

export interface CreateRoleRequest {
  name: string;
  permissions?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: number[];
}

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Role", "Permission"] as const,
  endpoints: (builder) => ({
    getRoles: builder.query<RolesWithMeta, UserRoleFilters | void>({
      query: (filters) => ({
        url: "/roles",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: (response: RolesListResponse) =>
        transformListResponseWithMeta<UserRole>(response),
      providesTags: (result) => createListTags(result, "Role"),
    }),
    getRole: builder.query<UserRole, number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "GET",
      }),
      transformResponse: (response: SingleItemResponse<UserRole>) =>
        transformSingleItemResponse<UserRole>(response),
      providesTags: createItemTags("Role"),
    }),
    createRole: builder.mutation<UserRole, CreateRoleRequest>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        data: body,
      }),
      invalidatesTags: createInvalidateListTags("Role"),
    }),
    updateRole: builder.mutation<
      UserRole,
      { id: number; data: UpdateRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("Role"),
    }),
    getPermissions: builder.query<PermissionsTree, void>({
      query: () => ({
        url: "/permissions",
        method: "GET",
      }),
      transformResponse: (response: PermissionsListResponse) => {
        return (response.data ?? {}) as PermissionsTree;
      },
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetPermissionsQuery,
} = rolesApi;


