import { z } from "zod";
import {
  ActionType,
  ExecutionStatus,
  ApprovalRequired,
  ValidationResult,
} from "@/app/lib/features/incidentActionsApi";

// Enum schemas using zod
const ActionTypeEnum = z.nativeEnum(ActionType);
const ExecutionStatusEnum = z.nativeEnum(ExecutionStatus);
const ApprovalRequiredEnum = z.nativeEnum(ApprovalRequired);
const ValidationResultEnum = z.nativeEnum(ValidationResult);

export const incidentActionSchema = z
  .object({
    ai_incident_id: z
      .number()
      .int("Incident must be a valid integer")
      .min(1, "Incident is required"),
    action_type: ActionTypeEnum,
    execution_status: ExecutionStatusEnum,
    description: z
      .string()
      .min(1, "Description is required")
      .max(5000, "Description must not exceed 5000 characters"),
    performed_by: z
      .number()
      .int("Performed by must be a valid integer")
      .positive("Performed by is required"),
    individual_name: z
      .string()
      .max(255, "Individual name must not exceed 255 characters")
      .optional()
      .nullable(),
    depends_on: z
      .string()
      .max(255, "Depends on must not exceed 255 characters")
      .optional()
      .nullable(),
    approval_required: ApprovalRequiredEnum.optional().nullable(),
    estimated_duration: z.string().optional().nullable(),
    actual_duration: z.string().optional().nullable(),
    started_at: z.string().min(1, "Started at is required"),
    completed_at: z.string().optional().nullable().or(z.literal("")),
    validation_result: ValidationResultEnum,
    validation_notes: z.string().optional().nullable(),
    linked_release_id: z.string().optional().nullable(),
    evidence_link: z
      .string()
      .url("Evidence link must be a valid URL")
      .max(2048, "Evidence link must not exceed 2048 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.completed_at && data.started_at) {
        const started = new Date(data.started_at);
        const completed = new Date(data.completed_at || "");
        return completed >= started;
      }
      return true;
    },
    {
      message: "Completed at must be after or equal to started at",
      path: ["completed_at"],
    }
  )
  .transform((data) => ({
    ...data,
    completed_at: data.completed_at === "" ? null : data.completed_at,
    evidence_link: data.evidence_link === "" ? null : data.evidence_link,
  }));

export type IncidentActionFormData = z.infer<typeof incidentActionSchema>;

