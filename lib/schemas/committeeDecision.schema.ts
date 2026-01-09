import { z } from "zod";
import {
  DecisionType,
  DecisionScope,
  VoteMethod,
  VoteResult,
} from "@/interfaces/CommitteeDecision";

const DecisionTypeEnum = z.nativeEnum(DecisionType);
const DecisionScopeEnum = z.nativeEnum(DecisionScope);
const VoteMethodEnum = z.nativeEnum(VoteMethod);
const VoteResultEnum = z.nativeEnum(VoteResult);

export const committeeDecisionSchema = z.object({
  committee_meeting_id: z
    .number()
    .int("Committee Meeting ID must be a valid integer")
    .positive("Committee Meeting is required"),
  decision_type: DecisionTypeEnum,
  decision_scope: DecisionScopeEnum,
  ai_model_id: z
    .number()
    .int("AI Model ID must be a valid integer")
    .positive()
    .optional()
    .nullable(),
  use_case_id: z
    .number()
    .int("Use Case ID must be a valid integer")
    .positive()
    .optional()
    .nullable(),
  control_id: z
    .number()
    .int("Control ID must be a valid integer")
    .positive()
    .optional()
    .nullable(),
  related_ref: z.string().optional().nullable().or(z.literal("")),
  rationale: z.string().min(1, "Rationale is required"),
  conditions: z.string().optional().nullable().or(z.literal("")),
  expiry_date: z
    .string()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Expiry date must be a valid date" }
    )
    .optional()
    .nullable()
    .or(z.literal("")),
  vote_method: VoteMethodEnum,
  vote_result: VoteResultEnum,
  owner_team: z
    .string()
    .min(1, "Owner team is required")
    .max(255, "Owner team must not exceed 255 characters"),
});

export type CommitteeDecisionFormData = z.infer<typeof committeeDecisionSchema>;

