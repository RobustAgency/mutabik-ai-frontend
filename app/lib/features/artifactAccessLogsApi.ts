import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError, hasValidationErrors } from "@/lib/api/rtkQueryBase";
import type {
  ArtifactAccessLog,
  CreateArtifactAccessLogData,
  ArtifactAccessLogFilters,
  PaginatedArtifactAccessLogsResponse,
} from "@/service/app/artifactAccessLogs";

export const artifactAccessLogsApi = baseApi.injectEndpoints({
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
          if (!hasValidationErrors(error)) {
            const mutationError = error as MutationError;
            const errorMessage =
              mutationError?.error?.data?.message || "Failed to create access log";
            toast.error(errorMessage);
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

