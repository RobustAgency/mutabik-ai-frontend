import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  RequirementControl,
  RequirementControlFilters,
  CreateRequirementControlRequest,
  UpdateRequirementControlRequest,
  RequirementControlListMeta,
  RequirementControlListResponse,
  RequirementControlSingleResponse,
} from "@/interfaces/RequirementControl";

const normaliseMeta = (payload?: RequirementControlListResponse["data"]): RequirementControlListMeta => {
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
      transformResponse: (response: RequirementControlListResponse) => {
        const list = response?.data?.data ?? [];
        const meta = normaliseMeta(response?.data);
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "RequirementControl" as const, id })),
              { type: "RequirementControl" as const, id: "LIST" },
            ]
          : [{ type: "RequirementControl" as const, id: "LIST" }],
    }),
    getRequirementControl: builder.query<RequirementControl, string | number>({
      query: (id) => ({
        url: `/admin/requirement-controls/${id}`,
        method: "GET",
      }),
      transformResponse: (response: RequirementControlSingleResponse) => {
        return (response?.data as RequirementControl) ?? (response as unknown as RequirementControl);
      },
      providesTags: (result, _error, id) => [{ type: "RequirementControl", id }],
    }),
    createRequirementControl: builder.mutation<unknown, CreateRequirementControlRequest>({
      query: (data) => ({
        url: "/admin/requirement-controls",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "RequirementControl", id: "LIST" }],
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
      invalidatesTags: (result, _error, { id }) => [
        { type: "RequirementControl", id },
        { type: "RequirementControl", id: "LIST" },
      ],
    }),
    deleteRequirementControl: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/admin/requirement-controls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, _error, id) => [
        { type: "RequirementControl", id },
        { type: "RequirementControl", id: "LIST" },
      ],
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

