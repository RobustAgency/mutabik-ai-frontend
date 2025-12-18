import { z } from "zod";
import {
  ConsentLifecycle,
  ConsentMethod,
  ConsentPurpose,
  ConsentStatus,
  ConsentLanguage,
  ConsentJurisdiction,
  ConsentSourceSystem,
  ConsentSubjectRealm,
  ConsentDataCategory,
} from "@/interfaces/ConsentRecord";

const StatusEnum = z.enum(["granted", "denied", "withdrawn", "expired"]) as unknown as z.ZodType<ConsentStatus>;

const LifecycleEnum = z.enum([
  "obtained",
  "active",
  "expiring",
  "expired",
  "withdrawn",
]) as unknown as z.ZodType<ConsentLifecycle>;

const PurposeEnum = z.enum([
  "marketing",
  "ai_training",
  "profiling",
  "personalization",
  "biometrics",
  "cctv",
  "analytics",
  "research",
]) as unknown as z.ZodType<ConsentPurpose>;

const MethodEnum = z.enum([
  "explicit_opt_in",
  "implied",
  "pre_checked",
  "verbal",
  "written",
]) as unknown as z.ZodType<ConsentMethod>;

const SourceSystemEnum = z.enum([
  "portal",
  "mobile_app",
  "crm",
  "call_center",
  "admin",
  "email",
  "website",
]) as unknown as z.ZodType<ConsentSourceSystem>;

const LanguageEnum = z.enum(["en", "ar", "fr", "es"]) as unknown as z.ZodType<ConsentLanguage>;

const JurisdictionEnum = z.enum([
  "eu",
  "uae",
  "uk",
  "ksa",
  "difc",
  "us_ca",
]) as unknown as z.ZodType<ConsentJurisdiction>;

const SubjectRealmEnum = z.enum([
  "customer",
  "employee",
  "vendor",
  "student",
  "patient",
  "visitor",
]) as unknown as z.ZodType<ConsentSubjectRealm>;

const DataCategoryEnum = z.enum([
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
]) as unknown as z.ZodType<ConsentDataCategory>;

export const consentRecordSchema = z
  .object({
    subject_key: z
      .string()
      .min(1, "Subject key is required")
      .max(255, "Subject key must not exceed 255 characters"),
    subject_realm: SubjectRealmEnum,
    subject_age_group: z.string().max(50).optional().nullable(),
    purpose: PurposeEnum,
    record_of_processing_activity_id: z
      .number()
      .int()
      .positive("Processing activity is required"),
    status: StatusEnum,
    lifecycle_stage: LifecycleEnum,
    consent_version: z
      .number()
      .int()
      .min(1, "Consent version must be at least 1"),
    consent_text: z.string().min(1, "Consent text is required"),
    consent_method: MethodEnum,
    effective_from: z.string().min(1, "Effective from is required"),
    effective_to: z.string().optional().nullable(),
    last_refreshed_date: z.string().optional().nullable(),
    source_system: SourceSystemEnum,
    evidence_uri: z.string().url("Evidence URL must be valid").optional().nullable(),
    ip_address: z.string().optional().nullable(),
    user_agent: z.string().optional().nullable(),
    language: LanguageEnum,
    jurisdiction: JurisdictionEnum,
    data_categories: z
      .array(DataCategoryEnum)
      .min(1, "At least one data category is required"),
    can_withdraw: z.boolean(),
    withdrawal_method: z
      .string()
      .min(1, "Withdrawal method is required")
      .max(255, "Withdrawal method must not exceed 255 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.effective_to && data.effective_from) {
      if (data.effective_to < data.effective_from) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["effective_to"],
          message: "Effective to must be after or equal to effective from",
        });
      }
    }
  });

export type ConsentRecordFormData = z.infer<typeof consentRecordSchema>;


