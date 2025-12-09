import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api";
import { AxiosRequestConfig, AxiosError } from "axios";

export interface PdpProcessingRegister {
  id: string;
  purpose: string;
  controller_role: string;
  data_subject_categories: string[];
  personal_data_categories: string[];
  lawful_basis: string;
  lawful_basis_detail: string | null;
  retention_policy_ref: string | null;
  recipients: string[] | null;
  international_transfer_ref: string | null;
  dpia_required_flag: string | null;
  security_measures_ref: string | null;
  owner_team: string;
  effective_from: string;
  effective_to: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Filter types for PDP Processing Registers
export interface PdpProcessingRegisterFilters {
  per_page?: number; // optional, default: 15
}

export interface CreatePdpProcessingRegisterData {
  purpose: string;
  controller_role: string;
  data_subject_categories: string[];
  personal_data_categories: string[];
  lawful_basis: string;
  lawful_basis_detail?: string;
  retention_policy_ref?: string;
  recipients?: string[];
  international_transfer_ref?: string;
  dpia_required_flag?: string;
  security_measures_ref?: string;
  owner_team: string;
  effective_from: string;
  effective_to?: string;
  status: string;
}

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        data?: unknown;
        message?: string;
        error?: boolean;
        errors?: Record<string, string[]>;
      }>;

      const error = {
        status: err.response?.status || 500,
        data: err.response?.data || {
          message: err.message || "An error occurred",
          error: true,
        },
      };

      return {
        error,
      };
    }
  };

interface MutationError {
  error?: {
    status: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export const pdpProcessingRegisterApi = createApi({
  reducerPath: "pdpProcessingRegisterApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["PdpProcessingRegister"],
  endpoints: (builder) => ({
    getPdpProcessingRegisters: builder.query<
      PdpProcessingRegister[],
      PdpProcessingRegisterFilters | void
    >({
      query: (filters = {}) => ({
        url: "/pdp-processing-registers",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "PdpProcessingRegister" as const,
                id,
              })),
              { type: "PdpProcessingRegister", id: "LIST" },
            ]
          : [{ type: "PdpProcessingRegister", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: PdpProcessingRegister[];
        };
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getPdpProcessingRegister: builder.query<PdpProcessingRegister, string>({
      query: (id) => ({
        url: `/pdp-processing-registers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "PdpProcessingRegister", id },
      ],
      transformResponse: (response: { data: PdpProcessingRegister }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as PdpProcessingRegister;
      },
    }),

    createPdpProcessingRegister: builder.mutation<
      PdpProcessingRegister,
      CreatePdpProcessingRegisterData
    >({
      query: (data) => ({
        url: "/pdp-processing-registers",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "PdpProcessingRegister", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("PDP processing register created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create PDP processing register";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updatePdpProcessingRegister: builder.mutation<
      PdpProcessingRegister,
      { id: string; data: Partial<CreatePdpProcessingRegisterData> }
    >({
      query: ({ id, data }) => ({
        url: `/pdp-processing-registers/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PdpProcessingRegister", id },
        { type: "PdpProcessingRegister", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("PDP processing register updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update PDP processing register";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deletePdpProcessingRegister: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pdp-processing-registers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PdpProcessingRegister", id },
        { type: "PdpProcessingRegister", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("PDP processing register deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete PDP processing register";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetPdpProcessingRegistersQuery,
  useGetPdpProcessingRegisterQuery,
  useCreatePdpProcessingRegisterMutation,
  useUpdatePdpProcessingRegisterMutation,
  useDeletePdpProcessingRegisterMutation,
} = pdpProcessingRegisterApi;
