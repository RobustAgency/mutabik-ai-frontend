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

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
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
    getOrganizationUsers: builder.query<User[], UserFilters | void>({
      query: (filters) => ({
        url: "/members",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: (response: UsersListResponse | { data: User[] }) => {
        // Handle both response formats
        if (Array.isArray(response?.data)) {
          return response.data;
        }
        return response?.data?.data ?? [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
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
  }),
});

export const { useGetUsersQuery, useGetOrganizationUsersQuery, useDeleteUserMutation } = usersApi;

