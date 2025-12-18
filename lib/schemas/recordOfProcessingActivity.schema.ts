import { z } from "zod";

// Enum values matching backend
const ROPAStatus = z.enum(["draft", "active", "under_review", "archived"]);
const OwnerTeam = z.enum([
  "hr",
  "finance",
  "risk",
  "ai/ml",
  "it",
  "marketing",
  "operations",
  "legal",
  "sales",
]);
const ControllerRole = z.enum(["controller", "processor", "joint_controller"]);
const DataSubjectCategory = z.enum([
  "customers",
  "employees",
  "prospects",
  "vendors",
  "students",
  "children",
  "patients",
]);
const DataCategory = z.enum([
  "name",
  "contact",
  "identifier",
  "financial",
  "health",
  "biometric",
  "behavioral",
  "sensitive",
  "children",
  "location",
]);
const LawfulBasis = z.enum([
  "consent",
  "contract",
  "legitimate_interest",
  "legal_obligation",
  "public_task",
  "vital_interest",
]);
const DPIAStatus = z.enum([
  "required",
  "in_progress",
  "completed",
  "approved",
  "rejected",
]);
const ApplicableJurisdiction = z.enum([
  "eu",
  "uae",
  "uk",
  "ksa",
  "difc",
  "us_ca",
  "other",
]);

// Step 1: Basic Information
export const basicInformationSchema = z.object({
  activity_code: z
    .string()
    .min(1, "Activity code is required")
    .max(255, "Activity code must not exceed 255 characters"),
  activity_name: z
    .string()
    .min(1, "Activity name is required")
    .max(255, "Activity name must not exceed 255 characters"),
  purpose: z.string().min(1, "Purpose is required"),
  detailed_purpose: z.string().optional().nullable(),
  owner_team: OwnerTeam,
  controller_role: ControllerRole,
  status: ROPAStatus,
});

// Step 2: Data Categories & Subjects
export const dataCategoriesSchema = z.object({
  data_subject_categories: z
    .array(DataSubjectCategory)
    .min(1, "At least one data subject category is required"),
  data_categories: z
    .array(DataCategory)
    .min(1, "At least one data category is required"),
  contains_pii: z.boolean().default(false),
});

// Step 3: Legal Basis & Consent
export const legalBasisSchema = z.object({
  lawful_basis: LawfulBasis,
  consent_required: z.boolean().default(false),
  consent_coverage_percent: z
    .number()
    .min(0, "Consent coverage must be between 0 and 100")
    .max(100, "Consent coverage must be between 0 and 100")
    .optional()
    .nullable(),
  legitimate_interest_assessment: z.string().optional().nullable(),
});

// Step 4: DPIA Information
export const dpiaInformationSchema = z.object({
  dpia_required: z.boolean().default(false),
  dpia_status: DPIAStatus.optional().nullable(),
  dpia_id: z.number().int().positive().optional().nullable(),
});

// Step 5: Retention & Security
export const retentionSecuritySchema = z.object({
  retention_period: z
    .string()
    .min(1, "Retention period is required")
    .max(255, "Retention period must not exceed 255 characters"),
  retention_justification: z.string().min(1, "Retention justification is required"),
  security_measures: z.string().min(1, "Security measures are required"),
});

// Step 6: International Transfers & Jurisdictions
export const internationalTransfersSchema = z.object({
  has_international_transfers: z.boolean().default(false),
  applicable_jurisdictions: z
    .array(ApplicableJurisdiction)
    .min(1, "At least one applicable jurisdiction is required"),
  internal_recipients: z.array(z.string().max(255)).default([]),
  external_recipients: z.array(z.string().max(255)).default([]),
});

// Step 7: Review Schedule & Links
export const reviewScheduleSchema = z.object({
  last_reviewed_date: z.string().optional().nullable(),
  next_review_date: z.string().optional().nullable(),
  linked_dataset_ids: z.array(z.number().int().positive()).default([]),
  linked_ai_models_ids: z.array(z.number().int().positive()).default([]),
});

// Complete form schema
export const recordOfProcessingActivitySchema = basicInformationSchema
  .merge(dataCategoriesSchema)
  .merge(legalBasisSchema)
  .merge(dpiaInformationSchema)
  .merge(retentionSecuritySchema)
  .merge(internationalTransfersSchema)
  .merge(reviewScheduleSchema);

export type RecordOfProcessingActivityFormData = z.infer<
  typeof recordOfProcessingActivitySchema
>;

