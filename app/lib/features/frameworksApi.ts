import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  Framework,
  FrameworkFilters,
  CreateFrameworkRequest,
  UpdateFrameworkRequest,
} from "@/interfaces/Framework";

type FrameworkListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

type FrameworkListResponse = {
  error?: boolean;
  message?: string;
  data?: {
    data?: Framework[];
    meta?: FrameworkListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
};

type FrameworkSingleResponse = {
  error?: boolean;
  message?: string;
  data?: Framework;
};

type UserFrameworkListResponse = {
  error?: boolean;
  message?: string;
  data?: Framework[]; // User-side API returns data as direct array
};

const normaliseMeta = (payload?: FrameworkListResponse["data"]): FrameworkListMeta => {
  if (!payload) {
    return { current_page: 1, per_page: 0, total: 0, last_page: 1 };
  }

  if (payload.meta) {
    return {
      current_page: payload.meta.current_page ?? 1,
      per_page: payload.meta.per_page ?? 0,
      total: payload.meta.total ?? 0,
      last_page: payload.meta.last_page ?? payload.meta.current_page ?? 1,
    };
  }

  return {
    current_page: payload.current_page ?? 1,
    per_page: payload.per_page ?? 0,
    total: payload.total ?? 0,
    last_page: payload.last_page ?? payload.current_page ?? 1,
  };
};

export const frameworksApi = createApi({
  reducerPath: "frameworksApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Framework"],
  endpoints: (builder) => ({
    getFrameworks: builder.query<
      { data: Framework[]; meta: FrameworkListMeta },
      FrameworkFilters | void
    >({
      query: (filters) => ({
        url: "/admin/frameworks",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: (response: FrameworkListResponse) => {
        const list = response?.data?.data ?? [];
        const meta = normaliseMeta(response?.data);
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Framework" as const, id })),
              { type: "Framework" as const, id: "LIST" },
            ]
          : [{ type: "Framework" as const, id: "LIST" }],
    }),

    getUserFrameworks: builder.query<
      { data: Framework[]; meta: FrameworkListMeta },
      FrameworkFilters | void
    >({
      query: (filters) => ({
        url: "/frameworks",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: (response: UserFrameworkListResponse) => {
        // User-side API returns data as direct array, not paginated
        const list = Array.isArray(response?.data) ? response.data : [];
        const total = list.length;
        const perPage = 100; // Default per_page from the request
        const meta: FrameworkListMeta = {
          current_page: 1,
          per_page: perPage,
          total: total,
          last_page: 1,
        };
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Framework" as const, id })),
              { type: "Framework" as const, id: "USER_LIST" },
            ]
          : [{ type: "Framework" as const, id: "USER_LIST" }],
    }),

    getFramework: builder.query<Framework, string | number>({
      query: (id) => ({
        url: `/admin/frameworks/${id}`,
        method: "GET",
      }),
      transformResponse: (response: FrameworkSingleResponse) => {
        return (response?.data as Framework) ?? (response as unknown as Framework);
      },
      providesTags: (result, _error, id) => [{ type: "Framework", id }],
    }),

    createFramework: builder.mutation<unknown, CreateFrameworkRequest>({
      query: (data) => ({
        url: "/admin/frameworks",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Framework", id: "LIST" }],
    }),

    updateFramework: builder.mutation<
      unknown,
      { id: string | number; data: UpdateFrameworkRequest }
    >({
      query: ({ id, data }) => {
        return {
          url: `/admin/frameworks/${id}`,
          method: "POST",
          data,
        };
      },
      invalidatesTags: (result, _error, { id }) => [
        { type: "Framework", id },
        { type: "Framework", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetFrameworksQuery,
  useGetUserFrameworksQuery,
  useGetFrameworkQuery,
  useCreateFrameworkMutation,
  useUpdateFrameworkMutation,
} = frameworksApi;

