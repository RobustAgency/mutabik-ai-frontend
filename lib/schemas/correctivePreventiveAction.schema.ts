import { z } from "zod";
import {
  SourceType,
  CapaType,
  Priority,
  OwnerTeam,
  Status,
  VerificationResult,
} from "@/app/lib/features/correctivePreventiveActionsApi";

// Enum schemas using zod
const SourceTypeEnum = z.nativeEnum(SourceType);
const CapaTypeEnum = z.nativeEnum(CapaType);
const PriorityEnum = z.nativeEnum(Priority);
const OwnerTeamEnum = z.nativeEnum(OwnerTeam);
const StatusEnum = z.nativeEnum(Status);
const VerificationResultEnum = z.nativeEnum(VerificationResult).optional().nullable();

export const correctivePreventiveActionSchema = z
  .object({
    source_type: SourceTypeEnum,
    source_reference: z
      .string()
      .min(1, "Source reference is required")
      .max(255, "Source reference must not exceed 255 characters"),
    ai_model_id: z
      .number()
      .int("AI model ID must be a valid integer")
      .positive()
      .optional()
      .nullable(),
    dataset_id: z
      .number()
      .int("Dataset ID must be a valid integer")
      .positive()
      .optional()
      .nullable(),
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must not exceed 255 characters"),
    capa_type: CapaTypeEnum,
    priority: PriorityEnum,
    root_cause: z
      .string()
      .max(5000, "Root cause must not exceed 5000 characters")
      .optional()
      .nullable(),
    actions: z
      .string()
      .min(1, "Actions is required")
      .max(5000, "Actions must not exceed 5000 characters"),
    owner_team: OwnerTeamEnum,
    assignee: z
      .string()
      .max(255, "Assignee must not exceed 255 characters")
      .optional()
      .nullable(),
    due_date: z.string().min(1, "Due date is required"),
    status: StatusEnum,
    success_criteria: z
      .string()
      .max(5000, "Success criteria must not exceed 5000 characters")
      .optional()
      .nullable(),
    linked_training: z
      .string()
      .max(255, "Linked training must not exceed 255 characters")
      .optional()
      .nullable(),
    estimated_cost: z
      .number()
      .min(0, "Estimated cost must be non-negative")
      .optional()
      .nullable(),
    verification_result: VerificationResultEnum,
    effectiveness_review_date: z.string().optional().nullable().or(z.literal("")),
    evidence_link: z
      .string()
      .url("Evidence link must be a valid URL")
      .max(500, "Evidence link must not exceed 500 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // If status is CLOSED, verification_result is required
      if (data.status === Status.CLOSED && !data.verification_result) {
        return false;
      }
      return true;
    },
    {
      message: "Verification result is required when status is closed",
      path: ["verification_result"],
    }
  )
  .transform((data) => ({
    ...data,
    effectiveness_review_date:
      data.effectiveness_review_date === "" ? null : data.effectiveness_review_date,
    evidence_link: data.evidence_link === "" ? null : data.evidence_link,
  }));

export type CorrectivePreventiveActionFormData = z.infer<
  typeof correctivePreventiveActionSchema
>;

