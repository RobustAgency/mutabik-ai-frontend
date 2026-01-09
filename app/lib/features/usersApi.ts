import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";

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

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"] as const,
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
        url: "/members",
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
  }),
});

export const {
  useGetUsersQuery,
  useGetOrganizationUsersQuery,
  useDeleteUserMutation,
  useInviteTeamMutation,
} = usersApi;

