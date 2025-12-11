import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
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
  }),
});

export const { useGetUsersQuery } = usersApi;

