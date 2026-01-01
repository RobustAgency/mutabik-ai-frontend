import { createApi } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { axiosBaseQuery, PaginationMeta } from "@/lib/api/rtkQueryBase";
import {
  transformListResponseWithPagination,
  transformSingleItemResponse,
  createListTags,
  createItemTags,
  createInvalidateListTags,
  createInvalidateItemAndListTags,
  createMutationToastHandler,
  createDeleteToastHandler,
  ListResponseWithPagination,
  SingleItemResponse,
} from "@/lib/api/rtkQueryHelpers";

// Types for AI Incidents
export interface AiIncident {
  id: number;
  organization_id: number;
  title: string;
  summary: string;
  category: 
    | "safety"
    | "privacy"
    | "security"
    | "bias_fairness"
    | "reliability"
    | "availability"
    | "legal_compliance"
    | "vendor"
    | "other";
  severity: "sev1_critical" | "sev2_high" | "sev3_medium" | "sev4_low" | "near_miss";
  status: "open" | "contained" | "monitoring" | "resolved" | "closed";
  stage: "ideation" | "conception" | "dev" | "test" | "staging" | "prod" | "retirement";
  ic_owner: string;
  model_id?: string | null;
  model_version_id?: string | null;
  use_case_id?: string | null;
  first_seen_at: string;
  declared_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  impacted_users?: string | null;
  impacted_data: string[];
  impacted_systems?: string | null;
  linked_release_id?: string | null;
  linked_risk_id?: string | null;
  linked_assessment_id?: string | null;
  linked_capa_id?: string | null;
  evidence_link?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export interface AiIncidentFilters {
  title?: string | null; // max:255
  status?: string | null; // enum: AiIncident\IncidentStatus
  severity?: string | null; // enum: AiIncident\IncidentSeverity
  stage?: string | null; // enum: AiIncident\IncidentStage
  category?: string | null; // enum: AiIncident\IncidentCategory
  from?: string | null; // date, before_or_equal:today
  to?: string | null; // date, before_or_equal:today, after_or_equal:from
  per_page?: number | null; // min:1, max:100
  // Legacy support
  search?: string;
  page?: number;
}

export interface CreateAiIncidentData {
  title: string;
  summary: string;
  category: AiIncident["category"];
  severity: AiIncident["severity"];
  status: AiIncident["status"];
  stage: AiIncident["stage"];
  ic_owner: string;
  model_id?: string | null;
  model_version_id?: string | null;
  use_case_id?: string | null;
  first_seen_at: string;
  declared_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  impacted_users?: string | null;
  impacted_data: string[];
  impacted_systems?: string | null;
  linked_release_id?: string | null;
  linked_risk_id?: string | null;
  linked_assessment_id?: string | null;
  linked_capa_id?: string | null;
  evidence_link?: string | null;
}

export const aiIncidentsApi = createApi({
  reducerPath: "aiIncidentsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AiIncident"],
  endpoints: (builder) => ({
    getAiIncidents: builder.query<
      { data: AiIncident[]; pagination: PaginationMeta },
      AiIncidentFilters | void
    >({
      query: (filters) => ({
        url: "/ai-incidents",
        method: "GET",
        params: filters ?? undefined,
      }),
      transformResponse: transformListResponseWithPagination<AiIncident>,
      providesTags: (result) => createListTags(result, "AiIncident"),
    }),

    getAiIncident: builder.query<AiIncident, number>({
      query: (id) => ({
        url: `/ai-incidents/${id}`,
        method: "GET",
      }),
      transformResponse: transformSingleItemResponse<AiIncident>,
      providesTags: createItemTags("AiIncident"),
    }),

    createAiIncident: builder.mutation<AiIncident, CreateAiIncidentData>({
      query: (data) => ({
        url: "/ai-incidents",
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateListTags("AiIncident"),
      onQueryStarted: createMutationToastHandler(
        "AI Incident created successfully",
        "Failed to create AI incident"
      ),
    }),

    updateAiIncident: builder.mutation<
      AiIncident,
      { id: number; data: Partial<CreateAiIncidentData> }
    >({
      query: ({ id, data }) => ({
        url: `/ai-incidents/${id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: createInvalidateItemAndListTags("AiIncident"),
      onQueryStarted: createMutationToastHandler(
        "AI Incident updated successfully",
        "Failed to update AI incident"
      ),
    }),

    deleteAiIncident: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ai-incidents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: createInvalidateItemAndListTags("AiIncident"),
      onQueryStarted: createDeleteToastHandler(
        "AI Incident deleted successfully",
        "Failed to delete AI incident"
      ),
    }),
  }),
});

export const {
  useGetAiIncidentsQuery,
  useGetAiIncidentQuery,
  useCreateAiIncidentMutation,
  useUpdateAiIncidentMutation,
  useDeleteAiIncidentMutation,
} = aiIncidentsApi;

