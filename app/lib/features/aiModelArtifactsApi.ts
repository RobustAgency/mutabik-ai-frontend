import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import type {
  AiModelArtifact,
  CreateAiModelArtifactData,
  PaginatedArtifactsResponse,
} from "@/service/app/aiModelArtifacts";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await apiClient({ url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || {
            message: err.message || "Request failed",
          },
        },
      };
    }
  };

export const aiModelArtifactsApi = createApi({
  reducerPath: "aiModelArtifactsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiModelArtifact"],
  endpoints: (builder) => ({
    getAiModelArtifacts: builder.query<
      PaginatedArtifactsResponse,
      { per_page?: number; page?: number } | void
    >({
      query: (params = {}) => ({
        url: "/ai-model-artifacts",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "AiModelArtifact" as const,
                id,
              })),
              { type: "AiModelArtifact" as const, id: "LIST" },
            ]
          : [{ type: "AiModelArtifact" as const, id: "LIST" }],
      transformResponse: (response: {
        data: PaginatedArtifactsResponse;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return response.data;
        }
        return {
          current_page: 1,
          data: [],
          per_page: 15,
          total: 0,
          last_page: 1,
          from: 0,
          to: 0,
        };
      },
    }),

    getAiModelArtifact: builder.query<AiModelArtifact, number | string>({
      query: (id) => ({ url: `/ai-model-artifacts/${id}`, method: "GET" }),
      providesTags: (_result, _e, id) => [{ type: "AiModelArtifact", id }],
      transformResponse: (response: {
        data: AiModelArtifact;
        error?: boolean;
        message?: string;
      }) => response.data,
    }),

    createAiModelArtifact: builder.mutation<
      { error: boolean; message: string; data?: any },
      CreateAiModelArtifactData
    >({
      query: ({ file, artifact_type }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("artifact_type", artifact_type);
        return {
          url: "/ai-model-artifacts",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: [{ type: "AiModelArtifact", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result.data.error) {
            toast.error(result.data.message || "Failed to create artifact");
          } else {
            toast.success(result.data.message || "Artifact created successfully");
          }
        } catch (error: any) {
          if (!error?.error?.data?.errors) {
            toast.error(
              error?.error?.data?.message || "Failed to create artifact"
            );
          }
        }
      },
    }),

    deleteAiModelArtifact: builder.mutation<
      { error: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/ai-model-artifacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiModelArtifact", id },
        { type: "AiModelArtifact", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Artifact deleted successfully");
        } catch (error: any) {
          if (!error?.error?.data?.errors) {
            toast.error(
              error?.error?.data?.message || "Failed to delete artifact"
            );
          }
        }
      },
    }),
  }),
});

export const {
  useGetAiModelArtifactsQuery,
  useGetAiModelArtifactQuery,
  useCreateAiModelArtifactMutation,
  useDeleteAiModelArtifactMutation,
} = aiModelArtifactsApi;

