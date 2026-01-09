import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  RequirementControl,
  RequirementControlFilters,
  CreateRequirementControlRequest,
  UpdateRequirementControlRequest,
  RequirementControlListMeta,
} from "@/interfaces/RequirementControl";
import {
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
} from "@/lib/api/rtkQueryHelpers";

export const requirementControlsApi = createApi({
  reducerPath: "requirementControlsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["RequirementControl"],
  endpoints: (builder) => ({
    getRequirementControls: builder.query<
      { data: RequirementControl[]; meta: RequirementControlListMeta },
      RequirementControlFilters | void
    >({
      query: (filters) => ({
        url: "/admin/requirement-controls",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithMeta<RequirementControl>,
      providesTags: (result) => createListTags(result, "RequirementControl"),
    }),
    getRequirementControl: builder.query<RequirementControl, string | number>({
      query: (id) => ({
        url: `/admin/requirement-controls/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<RequirementControl>,
      providesTags: createItemTags("RequirementControl"),
    }),
    createRequirementControl: builder.mutation<unknown, CreateRequirementControlRequest>({
      query: (data) => ({
        url: "/admin/requirement-controls",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("RequirementControl"),
    }),
    updateRequirementControl: builder.mutation<
      unknown,
      { id: string | number; data: UpdateRequirementControlRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/requirement-controls/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("RequirementControl"),
    }),
    deleteRequirementControl: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/admin/requirement-controls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateItemAndListTags("RequirementControl"),
    }),
  }),
});

export const {
  useGetRequirementControlsQuery,
  useGetRequirementControlQuery,
  useCreateRequirementControlMutation,
  useUpdateRequirementControlMutation,
  useDeleteRequirementControlMutation,
} = requirementControlsApi;

