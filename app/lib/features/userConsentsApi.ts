import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, MutationError } from "@/lib/api/rtkQueryBase";

export interface UserConsent {
  id: string;
  subject_key: string;
  subject_realm: string;
  jurisdiction: string;
  consent_purpose: string[];
  consent_status: string;
  legal_basis: string;
  source_system: string;
  evidence_ref: string;
  effective_from: string;
  effective_to: string | null;
  scope: string | null;
  created_at: string;
  updated_at: string;
}

// Filter types for User Consents
export interface UserConsentFilters {
  consent_status?: string | null; // max:255
  legal_basis?: string | null; // max:255
  from?: string | null; // date
  to?: string | null; // date
  per_page?: number | null; // min:1, max:100
}

export interface CreateUserConsentData {
  subject_key: string;
  subject_realm: string;
  jurisdiction: string;
  consent_purpose: string[];
  consent_status: string;
  legal_basis: string;
  source_system: string;
  evidence_ref: string;
  effective_from: string;
  effective_to?: string;
  scope?: string;
}

export const userConsentsApi = createApi({
  reducerPath: "userConsentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserConsent"],
  endpoints: (builder) => ({
    getUserConsents: builder.query<
      UserConsent[],
      UserConsentFilters | void
    >({
      query: (filters = {}) => ({
        url: "/user-consents",
        method: "GET",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "UserConsent" as const, id })),
              { type: "UserConsent", id: "LIST" },
            ]
          : [{ type: "UserConsent", id: "LIST" }],
      transformResponse: (response: {
        data: {
          data: UserConsent[];
        };
      }) => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      },
    }),

    getUserConsent: builder.query<UserConsent, string>({
      query: (id) => ({
        url: `/user-consents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "UserConsent", id }],
      transformResponse: (response: { data: UserConsent }) => {
        if (response.data) {
          return response.data;
        }
        return response as unknown as UserConsent;
      },
    }),

    createUserConsent: builder.mutation<UserConsent, CreateUserConsentData>({
      query: (data) => ({
        url: "/user-consents",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [{ type: "UserConsent", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User consent created successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to create user consent";
            toast.error(errorMessage);
          }
        }
      },
    }),

    updateUserConsent: builder.mutation<
      UserConsent,
      { id: string; data: Partial<CreateUserConsentData> }
    >({
      query: ({ id, data }) => ({
        url: `/user-consents/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "UserConsent", id },
        { type: "UserConsent", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User consent updated successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const errorMessage =
              mutationError?.error?.data?.message ||
              "Failed to update user consent";
            toast.error(errorMessage);
          }
        }
      },
    }),

    deleteUserConsent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user-consents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "UserConsent", id },
        { type: "UserConsent", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User consent deleted successfully");
        } catch (error) {
          const mutationError = error as MutationError;
          const errorMessage =
            mutationError?.error?.data?.message ||
            "Failed to delete user consent";
          toast.error(errorMessage);
        }
      },
    }),
  }),
});

export const {
  useGetUserConsentsQuery,
  useGetUserConsentQuery,
  useCreateUserConsentMutation,
  useUpdateUserConsentMutation,
  useDeleteUserConsentMutation,
} = userConsentsApi;
