import { z } from "zod";
import {
  DPIAStatus,
  DPIAStage,
  DPIARiskLevel,
  DPIAResidualRiskLevel,
  DPIAFinalDecision,
  DPIALinkedAssetsType,
  DPIAJurisdiction,
} from "@/interfaces/DataProtectionImpactAssessment";

const StatusEnum = z.enum([
  "draft",
  "in_progress",
  "dpo_review",
  "pending_approval",
  "completed",
  "archived",
]) as unknown as z.ZodType<DPIAStatus>;

const StageEnum = z.enum([
  "screening",
  "necessity",
  "risk_identification",
  "mitigation",
  "dpo_consultation",
  "approval",
  "completed",
]) as unknown as z.ZodType<DPIAStage>;

const RiskLevelEnum = z.enum([
  "low",
  "medium",
  "high",
  "critical",
]) as unknown as z.ZodType<DPIARiskLevel>;

const ResidualRiskLevelEnum = z.enum([
  "low",
  "medium",
  "high",
]) as unknown as z.ZodType<DPIAResidualRiskLevel>;

const FinalDecisionEnum = z.enum([
  "approved",
  "approved_with_conditions",
  "rejected",
  "deferred",
]) as unknown as z.ZodType<DPIAFinalDecision>;

const LinkedAssetsTypeEnum = z.enum([
  "ai_model",
  "system",
  "process",
  "technology",
]) as unknown as z.ZodType<DPIALinkedAssetsType>;

const JurisdictionEnum = z.enum([
  "eu",
  "uae",
  "uk",
  "ksa",
  "difc",
]) as unknown as z.ZodType<DPIAJurisdiction>;

export const dpiaSchema = z
  .object({
    dpia_name: z
      .string()
      .min(1, "DPIA name is required")
      .max(255, "DPIA name must not exceed 255 characters"),
    ropa_id: z
      .number()
      .int()
      .positive("Linked processing activity is required"),
    linked_ai_model_id: z.number().int().positive().optional().nullable(),
    linked_asset_type: LinkedAssetsTypeEnum,
    automated_trigger: z.boolean(),
    trigger_reason: z
      .string()
      .min(1, "Trigger reason is required")
      .max(255, "Trigger reason must not exceed 255 characters"),
    risk_level: RiskLevelEnum,
    risk_score: z
      .number()
      .int()
      .min(1, "Risk score must be between 1 and 25")
      .max(25, "Risk score must be between 1 and 25"),
    stage: StageEnum,
    completion_percentage: z
      .number()
      .int()
      .min(0, "Completion must be between 0 and 100")
      .max(100, "Completion must be between 0 and 100"),
    necessity_justification: z.string().optional().nullable(),
    proportionality_assessment: z
      .string()
      .min(1, "Proportionality assessment is required"),
    alternatives_considered: z
      .string()
      .min(1, "Alternatives considered is required"),
    identified_risks: z.string().optional().nullable(),
    likelihood_assessment: z
      .string()
      .min(1, "Likelihood assessment is required"),
    impact_assessment: z
      .string()
      .min(1, "Impact assessment is required"),
    mitigation_measures: z.string().optional().nullable(),
    residual_risk_level: ResidualRiskLevelEnum.optional().nullable(),
    dpo_consulted: z.boolean().optional().nullable(),
    dpo_consultation_date: z.string().optional().nullable(),
    dpo_advice: z.string().optional().nullable(),
    dpo_user_id: z.number().int().positive().optional().nullable(),
    stakeholders_consulted: z.array(z.number().int().positive()).optional().nullable(),
    stakeholder_feedback: z.string().optional().nullable(),
    data_subjects_consulted: z.boolean(),
    consultation_method: z.string().optional().nullable(),
    final_decision: FinalDecisionEnum.optional().nullable(),
    approval_date: z.string().optional().nullable(),
    approved_by: z.number().int().positive().optional().nullable(),
    conditions: z.string().optional().nullable(),
    status: StatusEnum,
    review_frequency_months: z
      .number()
      .int()
      .min(1, "Review frequency must be at least 1 month"),
    applicable_jurisdictions: z
      .array(JurisdictionEnum)
      .min(1, "At least one jurisdiction is required"),
  })
  .superRefine((data, ctx) => {
    // Stage-based conditional fields
    if (data.stage === "necessity") {
      if (!data.necessity_justification) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["necessity_justification"],
          message: "Necessity justification is required at this stage",
        });
      }
    }

    if (data.stage === "risk_identification") {
      if (!data.identified_risks) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identified_risks"],
          message: "Identified risks are required at this stage",
        });
      }
    }

    if (data.stage === "mitigation") {
      if (!data.mitigation_measures) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mitigation_measures"],
          message: "Mitigation measures are required at this stage",
        });
      }
    }

    if (
      data.stage === "dpo_consultation" ||
      data.stage === "approval" ||
      data.stage === "completed"
    ) {
      if (!data.residual_risk_level) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["residual_risk_level"],
          message: "Residual risk level is required at this stage",
        });
      }
    }

    // DPO consulted conditional
    if (data.dpo_consulted) {
      if (!data.dpo_consultation_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dpo_consultation_date"],
          message: "Consultation date is required when DPO is consulted",
        });
      }
      if (!data.dpo_advice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dpo_advice"],
          message: "DPO advice is required when DPO is consulted",
        });
      }
      if (!data.dpo_user_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dpo_user_id"],
          message: "DPO user is required when DPO is consulted",
        });
      }
      if (!data.consultation_method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["consultation_method"],
          message: "Consultation method is required when DPO is consulted",
        });
      }
    }

    // Approval stage conditional
    if (data.stage === "approval") {
      if (!data.final_decision) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["final_decision"],
          message: "Final decision is required at approval stage",
        });
      }
      if (!data.approval_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["approval_date"],
          message: "Approval date is required at approval stage",
        });
      }
      if (!data.approved_by) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["approved_by"],
          message: "Approved by is required at approval stage",
        });
      }
    }

    if (data.final_decision === "approved_with_conditions") {
      if (!data.conditions) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["conditions"],
          message: "Conditions are required when approved with conditions",
        });
      }
    }
  });

export type DPIAFormData = z.infer<typeof dpiaSchema>;


