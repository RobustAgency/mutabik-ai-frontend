import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/rtkQueryBase";
import {
  Requirement,
  RequirementFilters,
  CreateRequirementRequest,
  UpdateRequirementRequest,
} from "@/interfaces/Requirement";

type RequirementListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
};

type RequirementListResponse = {
  error?: boolean;
  message?: string;
  data?: {
    data?: Requirement[];
    meta?: RequirementListMeta;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
};

type RequirementSingleResponse = {
  error?: boolean;
  message?: string;
  data?: Requirement;
};

const normaliseMeta = (payload?: RequirementListResponse["data"]): RequirementListMeta => {
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
      transformResponse: (response: RequirementListResponse) => {
        const list = response?.data?.data ?? [];
        const meta = normaliseMeta(response?.data);
        return { data: list, meta };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Requirement" as const, id })),
              { type: "Requirement" as const, id: "LIST" },
            ]
          : [{ type: "Requirement" as const, id: "LIST" }],
    }),

    getRequirement: builder.query<Requirement, string | number>({
      query: (id) => ({
        url: `/admin/requirements/${id}`,
        method: "GET",
      }),
      transformResponse: (response: RequirementSingleResponse) => {
        return (response?.data as Requirement) ?? (response as unknown as Requirement);
      },
      providesTags: (result, _error, id) => [{ type: "Requirement", id }],
    }),

    createRequirement: builder.mutation<unknown, CreateRequirementRequest>({
      query: (data) => ({
        url: "/admin/requirements",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Requirement", id: "LIST" }],
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
      invalidatesTags: (result, _error, { id }) => [
        { type: "Requirement", id },
        { type: "Requirement", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRequirementsQuery,
  useGetRequirementQuery,
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
} = requirementsApi;

