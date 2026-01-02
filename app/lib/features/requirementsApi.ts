import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  Requirement,
  RequirementFilters,
  CreateRequirementRequest,
  UpdateRequirementRequest,
} from "@/interfaces/Requirement";
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

type RequirementListMeta = ListMeta;
type RequirementListResponse = ListResponseWithMeta<Requirement>;
type RequirementSingleResponse = SingleItemResponse<Requirement>;

export const requirementsApi = createApi({
  reducerPath: "requirementsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Requirement"],
  endpoints: (builder) => ({
    getRequirements: builder.query<
      { data: Requirement[]; meta: RequirementListMeta },
      RequirementFilters | void
    >({
      query: (filters) => ({
        url: "/admin/requirements",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithMeta<Requirement>,
      providesTags: (result) => createListTags(result, "Requirement"),
    }),

    getRequirement: builder.query<Requirement, string | number>({
      query: (id) => ({
        url: `/admin/requirements/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<Requirement>,
      providesTags: createItemTags("Requirement"),
    }),

    createRequirement: builder.mutation<unknown, CreateRequirementRequest>({
      query: (data) => ({
        url: "/admin/requirements",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("Requirement"),
    }),

    updateRequirement: builder.mutation<
      unknown,
      { id: string | number; data: UpdateRequirementRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/requirements/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("Requirement"),
    }),
  }),
});

export const {
  useGetRequirementsQuery,
  useGetRequirementQuery,
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
} = requirementsApi;

