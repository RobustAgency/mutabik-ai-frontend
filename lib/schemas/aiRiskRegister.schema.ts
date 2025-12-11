import { z } from "zod";
import {
  RiskCategory,
  RiskLevel,
  RiskDecision,
  ReviewCadence,
  RiskStatus,
} from "@/interfaces/AiRiskRegister";

// Helper to parse string numbers or undefined (for API submission)
// Note: We keep values as strings in the form for compatibility with SelectWithInlineCreate
const optionalStringNumber = z.string().optional();

// Step 1: Basic Information
export const basicInformationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  risk_category: z.nativeEnum(RiskCategory),
  status: z.nativeEnum(RiskStatus),
  ai_model_id: z
    .string()
    .min(1, "AI Model is required"),
  ai_model_version_id: optionalStringNumber,
  use_case_id: optionalStringNumber,
  related_controls: z.string().optional(),
  descriptionInput: z.string().optional(), // For controlled input with character count
});

// Step 2: Risk Assessment
export const riskAssessmentSchema = z.object({
  risk_methodology_id: z
    .string()
    .min(1, "Risk Methodology is required"),
  likelihood_code: z.string().min(1, "Likelihood code is required"),
  impact_code: z.string().min(1, "Impact code is required"),
  inherent_score: z.string().optional(),
  residual_score: z.string().optional(),
  risk_level: z.nativeEnum(RiskLevel),
  decision: z.nativeEnum(RiskDecision),
});

// Step 3: Ownership & Review
export const ownershipReviewSchema = z.object({
  risk_owner: z
    .string()
    .min(1, "Risk owner is required"),
  review_cadence: z.nativeEnum(ReviewCadence),
  next_review_due: z.string().min(1, "Next review date is required"),
  created_by: z.string().email("Must be a valid email address").min(1, "Created by (email) is required"),
});

// Step 4: Links & Evidence (all optional)
export const linksEvidenceSchema = z.object({
  linked_assessment_id: optionalStringNumber,
  linked_incident_id: optionalStringNumber,
  linked_capa_id: optionalStringNumber,
  evidence_link: z.string().optional(),
  likelihood_label_snapshot: z.string().optional(),
  impact_label_snapshot: z.string().optional(),
  method_name_snapshot: z.string().optional(),
});

// Complete form schema (for final validation)
// Note: We keep IDs as strings in the form, transform them in the submit handler
export const aiRiskRegisterSchema = basicInformationSchema
  .merge(riskAssessmentSchema)
  .merge(ownershipReviewSchema)
  .merge(linksEvidenceSchema);

export type AiRiskRegisterFormData = z.infer<typeof aiRiskRegisterSchema>;

