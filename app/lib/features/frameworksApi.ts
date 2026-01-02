import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  Framework,
  FrameworkFilters,
  CreateFrameworkRequest,
  UpdateFrameworkRequest,
} from "@/interfaces/Framework";
import {
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  ListResponseWithMeta,
  SingleItemResponse,
  ListMeta,
} from "@/lib/api/rtkQueryHelpers";

type FrameworkListMeta = ListMeta;
type FrameworkListResponse = ListResponseWithMeta<Framework>;
type FrameworkSingleResponse = SingleItemResponse<Framework>;

type UserFrameworkListResponse = {
  error?: boolean;
  message?: string;
  data?: Framework[]; // User-side API returns data as direct array
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
      transformResponse: transformListResponseWithMeta<Framework>,
      providesTags: (result) => createListTags(result, "Framework"),
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
      providesTags: (result) => createListTags(result, "Framework", "USER_LIST"),
    }),

    getFramework: builder.query<Framework, string | number>({
      query: (id) => ({
        url: `/admin/frameworks/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<Framework>,
      providesTags: createItemTags("Framework"),
    }),

    createFramework: builder.mutation<unknown, CreateFrameworkRequest>({
      query: (data) => ({
        url: "/admin/frameworks",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("Framework"),
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
      invalidatesTags: createInvalidateItemAndListTags("Framework"),
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

