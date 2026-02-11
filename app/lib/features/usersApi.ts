import { baseApi } from "@/lib/api/baseApi";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface UserFilters {
  role?: string;
  per_page?: number;
  page?: number;
}

export interface UsersListResponse {
  error?: boolean;
  message?: string;
  data?: {
    data?: User[];
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface UsersWithPagination {
  data: User[];
  pagination: PaginationMeta;
}

/* -------------------- Invite Types -------------------- */

export interface TeamMember {
  email: string;
  role: string;
}

export interface InviteTeamRequest {
  members: TeamMember[];
}

export interface InviteTeamResponse {
  error: boolean;
  message: string;
  data: {
    failed?: string[] | { email: string }[];
  } | null;
}

export interface AssignRoleRequest {
  userId: number;
  roleId: number;
}

export interface RevokeRoleRequest {
  userId: number;
  roleId: number;
}

export interface AssignPermissionRequest {
  userId: number;
  permissionId: number;
}

export interface RevokePermissionRequest {
  userId: number;
  permissionId: number;
}

/* -------------------- Import Users Types -------------------- */

export interface ImportUsersRequest {
  file: File;
}

export interface ImportUsersResponse {
  error: boolean;
  message: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], UserFilters | void>({
      query: (filters) => ({
        url: "/admin/users",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: (response: UsersListResponse) => {
        return response?.data?.data ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),
    getOrganizationUsers: builder.query<UsersWithPagination, UserFilters | void>({
      query: (filters) => ({
        url: "/users",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: (response: UsersListResponse) => {
        const data = response?.data?.data ?? [];
        const pagination: PaginationMeta = {
          current_page: response?.data?.current_page ?? 1,
          per_page: response?.data?.per_page ?? 10,
          total: response?.data?.total ?? 0,
          last_page: response?.data?.last_page ?? 1,
        };
        return { data, pagination };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "ORG_LIST" },
            ]
          : [{ type: "User" as const, id: "ORG_LIST" }],
    }),
    deleteUser: builder.mutation<{ success: boolean }, number>({
      query: (userId) => ({
        url: `/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "ORG_LIST" }],
    }),
    inviteTeam: builder.mutation<InviteTeamResponse, InviteTeamRequest>({
      query: (body) => ({
        url: "/invite-members",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
    }),
    assignRole: builder.mutation<{ success: boolean }, AssignRoleRequest>({
      query: ({ userId, roleId }) => ({
        url: `/users/${userId}/assign-role`,
        method: "POST",
        data: { role_id: roleId },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags([{ type: "Profile", id: "ME" }]));
        } catch { /* handled elsewhere */ }
      },
    }),
    revokeRole: builder.mutation<{ success: boolean }, RevokeRoleRequest>({
      query: ({ userId, roleId }) => ({
        url: `/users/${userId}/revoke-role/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags([{ type: "Profile", id: "ME" }]));
        } catch { /* handled elsewhere */ }
      },
    }),
    assignPermission: builder.mutation<
      { success: boolean },
      AssignPermissionRequest
    >({
      query: ({ userId, permissionId }) => ({
        url: `/users/${userId}/assign-permission`,
        method: "POST",
        data: { permission_id: permissionId },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags([{ type: "Profile", id: "ME" }]));
        } catch { /* handled elsewhere */ }
      },
    }),
    revokePermission: builder.mutation<
      { success: boolean },
      RevokePermissionRequest
    >({
      query: ({ userId, permissionId }) => ({
        url: `/users/${userId}/revoke-permission`,
        method: "POST",
        data: { permission_id: permissionId },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags([{ type: "Profile", id: "ME" }]));
        } catch { /* handled elsewhere */ }
      },
    }),
    importUsers: builder.mutation<ImportUsersResponse, ImportUsersRequest>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/users/import",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: [
        { type: "User", id: "LIST" },
        { type: "User", id: "ORG_LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetOrganizationUsersQuery,
  useDeleteUserMutation,
  useInviteTeamMutation,
  useAssignRoleMutation,
  useRevokeRoleMutation,
  useAssignPermissionMutation,
  useRevokePermissionMutation,
  useImportUsersMutation,
} = usersApi;

