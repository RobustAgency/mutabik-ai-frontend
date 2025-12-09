import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import type {
  ArtifactAccessLog,
  CreateArtifactAccessLogData,
  ArtifactAccessLogFilters,
  PaginatedArtifactAccessLogsResponse,
} from "@/service/app/artifactAccessLogs";

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

export const artifactAccessLogsApi = createApi({
  reducerPath: "artifactAccessLogsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ArtifactAccessLog"],
  endpoints: (builder) => ({
    getArtifactAccessLogs: builder.query<
      PaginatedArtifactAccessLogsResponse,
      ArtifactAccessLogFilters | void
    >({
      query: (params = {}) => ({
        url: "/artifact-access-logs",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ArtifactAccessLog" as const,
                id,
              })),
              { type: "ArtifactAccessLog" as const, id: "LIST" },
            ]
          : [{ type: "ArtifactAccessLog" as const, id: "LIST" }],
      transformResponse: (response: {
        data: PaginatedArtifactAccessLogsResponse;
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

    getArtifactAccessLog: builder.query<ArtifactAccessLog, number | string>({
      query: (id) => ({ url: `/artifact-access-logs/${id}`, method: "GET" }),
      providesTags: (_result, _e, id) => [{ type: "ArtifactAccessLog", id }],
      transformResponse: (response: {
        data: ArtifactAccessLog;
        error?: boolean;
        message?: string;
      }) => response.data,
    }),

    createArtifactAccessLog: builder.mutation<
      { error: boolean; message: string; data?: ArtifactAccessLog },
      CreateArtifactAccessLogData
    >({
      query: (data) => ({
        url: "/artifact-access-logs",
        method: "POST",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "ArtifactAccessLog", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result.data.error) {
            toast.error(result.data.message || "Failed to create access log");
          } else {
            toast.success(result.data.message || "Access log created successfully");
          }
        } catch (error: any) {
          if (!error?.error?.data?.errors) {
            toast.error(
              error?.error?.data?.message || "Failed to create access log"
            );
          }
        }
      },
    }),

    deleteArtifactAccessLog: builder.mutation<
      { error: boolean; message: string },
      number | string
    >({
      query: (id) => ({
        url: `/artifact-access-logs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ArtifactAccessLog", id },
        { type: "ArtifactAccessLog", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Access log deleted successfully");
        } catch (error: any) {
          if (!error?.error?.data?.errors) {
            toast.error(
              error?.error?.data?.message || "Failed to delete access log"
            );
          }
        }
      },
    }),
  }),
});

export const {
  useGetArtifactAccessLogsQuery,
  useGetArtifactAccessLogQuery,
  useCreateArtifactAccessLogMutation,
  useDeleteArtifactAccessLogMutation,
} = artifactAccessLogsApi;

