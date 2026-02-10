import { z } from "zod";
import { RcaMethod } from "@/app/lib/features/incidentRootCauseAnalysesApi";

// Enum schema using zod
const RcaMethodEnum = z.nativeEnum(RcaMethod);

export const incidentRootCauseAnalysisSchema = z
  .object({
    ai_incident_id: z
      .number()
      .int("Incident must be a valid integer")
      .min(1, "Incident is required"),
    rca_method: RcaMethodEnum,
    analysis_date: z.string().optional().nullable().or(z.literal("")),
    immediate_cause: z
      .string()
      .min(1, "Immediate cause is required")
      .max(5000, "Immediate cause must not exceed 5000 characters"),
    root_causes: z
      .string()
      .min(1, "Root causes is required")
      .max(5000, "Root causes must not exceed 5000 characters"),
    contributing_factors: z
      .string()
      .max(5000, "Contributing factors must not exceed 5000 characters")
      .optional()
      .nullable(),
    control_failures: z
      .string()
      .max(5000, "Control failures must not exceed 5000 characters")
      .optional()
      .nullable(),
    recommendations: z
      .string()
      .min(1, "Recommendations is required")
      .max(5000, "Recommendations must not exceed 5000 characters"),
    lead_analyst: z
      .string()
      .min(1, "Lead analyst is required")
      .max(255, "Lead analyst must not exceed 255 characters"),
    review_committee: z
      .string()
      .max(255, "Review committee must not exceed 255 characters")
      .optional()
      .nullable(),
    approved_at: z.string().optional().nullable().or(z.literal("")),
    report_link: z
      .string()
      .url("Report link must be a valid URL")
      .max(2048, "Report link must not exceed 2048 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
  })
  .transform((data) => ({
    ...data,
    analysis_date: data.analysis_date === "" ? null : data.analysis_date,
    approved_at: data.approved_at === "" ? null : data.approved_at,
    report_link: data.report_link === "" ? null : data.report_link,
  }));

export type IncidentRootCauseAnalysisFormData = z.infer<
  typeof incidentRootCauseAnalysisSchema
>;

