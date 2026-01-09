import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  Control,
  ControlFilters,
  ControlListMeta,
  CreateControlRequest,
  UpdateControlRequest,
} from "@/interfaces/Control";
import {
  transformListResponseWithMeta,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
} from "@/lib/api/rtkQueryHelpers";

export const controlsApi = createApi({
  reducerPath: "controlsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Control"],
  endpoints: (builder) => ({
    getControls: builder.query<
      { data: Control[]; meta: ControlListMeta },
      ControlFilters | void
    >({
      query: (filters) => ({
        url: "/admin/controls",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithMeta<Control>,
      providesTags: (result) => createListTags(result, "Control"),
    }),
    getControl: builder.query<Control, string | number>({
      query: (id) => ({
        url: `/admin/controls/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<Control>,
      providesTags: createItemTags("Control"),
    }),
    createControl: builder.mutation<unknown, CreateControlRequest>({
      query: (data) => ({
        url: "/admin/controls",
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateListTags("Control"),
    }),
    updateControl: builder.mutation<
      unknown,
      { id: string | number; data: UpdateControlRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/controls/${id}`,
        method: "POST",
        data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("Control"),
    }),
  }),
});

export const {
  useGetControlsQuery,
  useGetControlQuery,
  useCreateControlMutation,
  useUpdateControlMutation,
} = controlsApi;

