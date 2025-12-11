import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  Control,
  ControlFilters,
  ControlListMeta,
  ControlListResponse,
  ControlSingleResponse,
  CreateControlRequest,
  UpdateControlRequest,
} from "@/interfaces/Control";

const normaliseMeta = (payload?: ControlListResponse["data"]): ControlListMeta => {
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
      transformResponse: (response: ControlListResponse) => {
        const list = response?.data?.data ?? [];
        const meta = normaliseMeta(response?.data);
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Control" as const, id })),
              { type: "Control" as const, id: "LIST" },
            ]
          : [{ type: "Control" as const, id: "LIST" }],
    }),
    getControl: builder.query<Control, string | number>({
      query: (id) => ({
        url: `/admin/controls/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ControlSingleResponse) => {
        return (response?.data as Control) ?? (response as unknown as Control);
      },
      providesTags: (result, _error, id) => [{ type: "Control", id }],
    }),
    createControl: builder.mutation<unknown, CreateControlRequest>({
      query: (data) => ({
        url: "/admin/controls",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Control", id: "LIST" }],
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
      invalidatesTags: (result, _error, { id }) => [
        { type: "Control", id },
        { type: "Control", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetControlsQuery,
  useGetControlQuery,
  useCreateControlMutation,
  useUpdateControlMutation,
} = controlsApi;

