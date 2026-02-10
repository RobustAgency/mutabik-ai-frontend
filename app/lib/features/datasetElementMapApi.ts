import { baseApi } from "@/lib/api/baseApi";
import { toast } from "react-toastify";
import { MutationError } from "@/lib/api/rtkQueryBase";

export interface CreateDatasetElementMapData {
  dataset_id: number;
  data_element_id: number;
  column_name: string;
  nullable: "Yes" | "No";
  sensitivity_override?: "Public" | "Internal" | "Confidential" | "Restricted" | null;
  pii_override?: "Inherit" | "Yes" | "No";
  transform_applied?: string | null;
  quality_rules_applied?: string | null;
  cde_in_dataset: "Yes" | "No";
  cde_category_in_dataset?:
    | "Strategic"
    | "Compliance"
    | "External Reporting"
    | "Operational"
    | "Financial"
    | "Risk"
    | "Customer Experience";
  lineage_source_column?: string | null;
  deprecated?: "Yes" | "No";
  // organization_id is validated on backend; usually derived from auth
}

export const datasetElementMapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDatasetElementMap: builder.mutation<any, CreateDatasetElementMapData>({
      query: (data) => ({
        url: "/associate-data-element-with-dataset",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "DatasetElementMap", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Data element associated with dataset");
        } catch (error) {
          const mutationError = error as MutationError;
          if (!mutationError?.error?.data?.errors) {
            const msg = mutationError?.error?.data?.message || "Failed to associate data element";
            toast.error(msg);
          }
        }
      },
    }),
  }),
});

export const { useCreateDatasetElementMapMutation } = datasetElementMapApi;


