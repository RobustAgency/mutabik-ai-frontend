import { z } from "zod";
import {
  ActionType,
  Status,
  VerificationResult,
} from "@/interfaces/CommitteeAction";

const ActionTypeEnum = z.nativeEnum(ActionType);
const StatusEnum = z.nativeEnum(Status);
const VerificationResultEnum = z.nativeEnum(VerificationResult);

export const committeeActionSchema = z.object({
  committee_decision_id: z
    .number()
    .int("Committee Decision ID must be a valid integer")
    .positive("Committee Decision is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters"),
  action_type: ActionTypeEnum,
  assignee_id: z
    .number()
    .int("Assignee ID must be a valid integer")
    .positive("Assignee is required"),
  due_date: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      },
      { message: "Due date must be after today" }
    ),
  status: StatusEnum,
  verification_result: VerificationResultEnum,
  evidence_link: z
    .union([
      z.string().url("Evidence link must be a valid URL"),
      z.literal(""),
    ])
    .optional()
    .nullable(),
  notes: z.string().optional().nullable().or(z.literal("")),
  closed_at: z
    .string()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Closed date must be a valid date" }
    )
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type CommitteeActionFormData = z.infer<typeof committeeActionSchema>;

