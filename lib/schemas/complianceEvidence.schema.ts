import { z } from "zod";
import type {
  ComplianceEvidenceArtifactTypeEnum,
  ComplianceEvidenceReviewOutcomeEnum,
} from "@/interfaces/ComplianceEvidence";

const ArtifactTypeEnum = z.enum([
  "document",
  "screenshot",
  "log",
  "test_result",
  "sample_set",
  "ticket",
  "transcript",
  "submission_ack",
]) as unknown as z.ZodType<ComplianceEvidenceArtifactTypeEnum>;

const ReviewOutcomeEnum = z.enum([
  "pass",
  "fail",
  "needs_fix",
]) as unknown as z.ZodType<ComplianceEvidenceReviewOutcomeEnum>;

export const complianceEvidenceSchema = z.object({
  control_id: z
    .number("Control is required")
    .int("Control must be a valid ID")
    .positive("Control ID must be a valid control ID"),
  requirement_id: z.number().int().positive().nullable().optional(),
  ai_model_id: z.number().int().positive().nullable().optional(),
  artifact_type: ArtifactTypeEnum,
  artifact_uri: z
    .string()
    .min(1, "Artifact URI is required")
    .url("Artifact URI must be a valid URL"),
  sample_ids: z.array(z.string()),
  sampling_method: z.string().min(1, "Sampling method is required"),
  collection_period_start: z.string().nullable().optional(),
  collection_period_end: z.string().nullable().optional(),
  collected_by: z.number().int().positive().nullable().optional(),
  review_outcome: ReviewOutcomeEnum.nullable().optional(),
  reviewed_by: z.number().int().positive().nullable().optional(),
  reviewed_at: z.string().nullable().optional(),
  hash_checksum: z.string().min(1, "Hash checksum is required"),
});

export type ComplianceEvidenceFormData = z.infer<typeof complianceEvidenceSchema>;

