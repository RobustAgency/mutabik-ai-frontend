import { z } from "zod";
import type {
  RegulatorySubmissionTypeEnum,
  RegulatorySubmissionStatusEnum,
} from "@/interfaces/RegulatorySubmission";

const SubmissionTypeEnum = z.enum([
  "registration",
  "notification",
  "conformity_assessment",
  "incident_report",
  "dpia_filing",
  "renewal",
  "audit_response",
]) as unknown as z.ZodType<RegulatorySubmissionTypeEnum>;

const StatusEnum = z.enum([
  "draft",
  "submitted",
  "acknowledged",
  "approved",
  "rejected",
  "closed",
]) as unknown as z.ZodType<RegulatorySubmissionStatusEnum>;

export const regulatorySubmissionSchema = z.object({
  framework_id: z.number().int().positive().nullable().optional(),
  ai_model_id: z.number().int().positive().nullable().optional(),
  authority: z
    .string()
    .min(1, "Authority is required")
    .max(255, "Authority must not exceed 255 characters"),
  jurisdiction: z
    .array(z.string().max(255, "Each jurisdiction must not exceed 255 characters"))
    .min(1, "At least one jurisdiction is required"),
  submission_type: SubmissionTypeEnum,
  content_summary: z
    .string()
    .min(1, "Content summary is required")
    .max(5000, "Content summary must not exceed 5000 characters"),
  tracking_id: z
    .string()
    .min(1, "Tracking ID is required")
    .max(255, "Tracking ID must not exceed 255 characters"),
  commitments: z
    .array(z.string().max(1000, "Each commitment must not exceed 1000 characters"))
    .min(1, "At least one commitment is required"),
  status: StatusEnum,
  renewal_due_at: z.string().min(1, "Renewal due date is required"),
  evidence_bundle_ids: z
    .array(z.number().int())
    .min(1, "At least one evidence bundle ID is required"),
  submitted_at: z.string().min(1, "Submitted at date is required"),
  submitted_by: z
    .number()
    .int()
    .positive("Submitted by must be a valid user ID"),
  documents_uri: z
    .string()
    .url("Documents URI must be a valid URL")
    .max(2048, "Documents URI must not exceed 2048 characters"),
});

export type RegulatorySubmissionFormData = z.infer<typeof regulatorySubmissionSchema>;

