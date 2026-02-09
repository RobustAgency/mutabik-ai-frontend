import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError } from "@/lib/api/rtkQueryBase";
import type {
  AiModelVersion,
  CreateAiModelVersionData,
} from "@/service/app/aiModelVersions";
import { mapToBackendFields, mapFromBackendFields } from "@/service/app/aiModelVersions";

// Filter types for AI Model Versions (matching API spec)
export interface AiModelVersionFilters {
  ai_model_id?: number; // exists:ai_models,id
  version_type?: string | null; // max:50
  from?: string | null; // date
  to?: string | null; // date, after_or_equal:from
  version_source?: string | null; // max:100
  lifecycle_stage?: string | null; // max:50
  version_role?: string | null; // max:50
  deployment_status?: string | null; // max:50
  per_page?: number | null; // min:1, max:100
  // Legacy support
  search?: string;
  page?: number;
}

export const aiModelVersionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiModelVersions: builder.query<
      AiModelVersion[],
      AiModelVersionFilters | void
    >({
      query: (filters = {}) => ({
        url: "/ai-model-versions",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AiModelVersion" as const,
                id,
              })),
              { type: "AiModelVersion", id: "LIST" },
            ]
          : [{ type: "AiModelVersion", id: "LIST" }],
      transformResponse: (response: {
        data: { data: AiModelVersion[] };
        error?: boolean;
        message?: string;
      }) => {
        let versions: AiModelVersion[] = [];
        if (response.data?.data) {
          versions = response.data.data;
        } else if (Array.isArray(response.data)) {
          versions = response.data;
        }
        // Normalize: ensure version is always available from version_number
        // Also map backend field names to frontend field names
        return versions.map((v) => {
          const mapped = mapFromBackendFields(v);
          return {
            ...mapped,
            version: mapped.version || mapped.version_number,
          };
        });
      },
    }),

    getAiModelVersion: builder.query<AiModelVersion, number>({
      query: (id) => ({
        url: `/ai-model-versions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiModelVersion", id }],
      transformResponse: (response: {
        data: AiModelVersion;
        error?: boolean;
        message?: string;
      }) => {
        const version =
          response.data || (response as unknown as AiModelVersion);
        // Map backend field names to frontend field names
        const mapped = mapFromBackendFields(version);
        // Normalize: ensure version is always available (single API returns 'version', fallback to 'version_number')
        return {
          ...mapped,
          version: mapped.version || mapped.version_number,
        };
      },
    }),

    createAiModelVersion: builder.mutation<
      AiModelVersion,
      CreateAiModelVersionData
    >({
      query: (data) => ({
        url: "/ai-model-versions",
        method: "POST",
        data: mapToBackendFields(data),
      }),
      invalidatesTags: [{ type: "AiModelVersion", id: "LIST" }],
      transformResponse: (response: {
        data: AiModelVersion;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return mapFromBackendFields(response.data);
        }
        return mapFromBackendFields(response as unknown as AiModelVersion);
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Model Version created successfully!");
        } catch (error) {
          const err = error as MutationError;
          const message =
            err.error?.data?.message || "Failed to create AI Model Version";
          toast.error(message);
        }
      },
    }),

    updateAiModelVersion: builder.mutation<
      AiModelVersion,
      { id: number; data: Partial<CreateAiModelVersionData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-model-versions/${id}`,
        method: "POST",
        data: mapToBackendFields(data),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AiModelVersion", id },
        { type: "AiModelVersion", id: "LIST" },
      ],
      transformResponse: (response: {
        data: AiModelVersion;
        error?: boolean;
        message?: string;
      }) => {
        if (response.data) {
          return mapFromBackendFields(response.data);
        }
        return mapFromBackendFields(response as unknown as AiModelVersion);
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Model Version updated successfully!");
        } catch (error) {
          const err = error as MutationError;
          const message =
            err.error?.data?.message || "Failed to update AI Model Version";
          toast.error(message);
        }
      },
    }),

    deleteAiModelVersion: builder.mutation<null, number>({
      query: (id) => ({
        url: `/ai-model-versions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AiModelVersion", id },
        { type: "AiModelVersion", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("AI Model Version deleted successfully!");
        } catch (error) {
          const err = error as MutationError;
          const message =
            err.error?.data?.message || "Failed to delete AI Model Version";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetAiModelVersionsQuery,
  useGetAiModelVersionQuery,
  useCreateAiModelVersionMutation,
  useUpdateAiModelVersionMutation,
  useDeleteAiModelVersionMutation,
} = aiModelVersionsApi;
