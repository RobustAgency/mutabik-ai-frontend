import { z } from "zod";
import {
  AlertSourceType,
  AlertSeverity,
} from "@/app/lib/features/incidentAlertsApi";

// Enum schemas using zod
const AlertSourceTypeEnum = z.nativeEnum(AlertSourceType);
const AlertSeverityEnum = z.nativeEnum(AlertSeverity);

export const incidentAlertSchema = z
  .object({
    ai_incident_id: z
      .number()
      .int("Incident must be a valid integer")
      .min(1, "Incident is required"),
    source_type: AlertSourceTypeEnum,
    data_source_id: z.number().int().positive().optional().nullable(),
    alert_sensitivity: AlertSeverityEnum,
    source_ref: z
      .string()
      .max(255, "Source reference must not exceed 255 characters")
      .optional()
      .nullable(),
    context: z
      .string()
      .min(1, "Context is required")
      .max(5000, "Context must not exceed 5000 characters"),
    first_seen_at: z.string().min(1, "First seen at is required"),
    last_seen_at: z.string().optional().nullable().or(z.literal("")),
    evidence_link: z
      .string()
      .url("Evidence link must be a valid URL")
      .max(2048, "Evidence link must not exceed 2048 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    auto_promote_incident: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      if (data.last_seen_at && data.first_seen_at) {
        const firstSeen = new Date(data.first_seen_at);
        const lastSeen = new Date(data.last_seen_at || "");
        return lastSeen >= firstSeen;
      }
      return true;
    },
    {
      message: "Last seen at must be after or equal to first seen at",
      path: ["last_seen_at"],
    }
  )
  .transform((data) => ({
    ...data,
    last_seen_at: data.last_seen_at === "" ? null : data.last_seen_at,
    evidence_link: data.evidence_link === "" ? null : data.evidence_link,
    auto_promote_incident: data.auto_promote_incident ?? false,
  }));

export type IncidentAlertFormData = z.infer<typeof incidentAlertSchema>;
