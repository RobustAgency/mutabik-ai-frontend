import { z } from "zod";
import type {
  PrivacyIncidentStatus,
  PrivacyIncidentType,
  PrivacyIncidentRiskLevel,
  PrivacyIncidentNotificationRequired,
  PrivacyIncidentNotificationStatus,
  PrivacyIncidentNotificationMethod,
  PrivacyIncidentDataCategory,
  PrivacyIncidentBreachCriteria,
} from "@/interfaces/PrivacyIncident";

const StatusEnum = z.enum([
  "detected",
  "under_investigation",
  "contained",
  "notified",
  "remediation",
  "resolved",
  "closed",
]) as unknown as z.ZodType<PrivacyIncidentStatus>;

const IncidentTypeEnum = z.enum([
  "unauthorized_access",
  "data_exposure",
  "lost_device",
  "stolen_device",
  "misdelivery",
  "ransomware",
  "phishing",
  "system_breach",
  "human_error",
  "third_party",
]) as unknown as z.ZodType<PrivacyIncidentType>;

const RiskLevelEnum = z.enum([
  "low",
  "medium",
  "high",
  "severe",
]) as unknown as z.ZodType<PrivacyIncidentRiskLevel>;

const NotificationRequiredEnum = z.enum([
  "none",
  "authority",
  "subjects",
  "both",
]) as unknown as z.ZodType<PrivacyIncidentNotificationRequired>;

const NotificationStatusEnum = z.enum([
  "pending",
  "not_required",
  "in_progress",
  "authority_notified",
  "subjects_notified",
  "completed",
]) as unknown as z.ZodType<PrivacyIncidentNotificationStatus>;

const NotificationMethodEnum = z.enum([
  "email",
  "letter",
  "phone",
  "SMS",
  "website",
  "media_announcement",
]) as unknown as z.ZodType<PrivacyIncidentNotificationMethod>;

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
]) as unknown as z.ZodType<PrivacyIncidentDataCategory>;

const BreachCriteriaEnum = z.enum([
  "confidentiality",
  "integrity",
  "availability",
]) as unknown as z.ZodType<PrivacyIncidentBreachCriteria>;

export const privacyIncidentSchema = z
  .object({
    incident_title: z
      .string()
      .min(1, "Incident title is required")
      .max(255, "Incident title must not exceed 255 characters"),
    incident_type: IncidentTypeEnum,
    risk_level: RiskLevelEnum,
    is_breach: z.boolean().default(false),
    breach_criteria_met: z
      .array(BreachCriteriaEnum)
      .optional()
      .nullable(),
    detected_date: z.string().min(1, "Detected date is required"),
    occurred_date: z.string().optional().nullable(),
    hours_to_deadline: z.number().int().optional().nullable(),
    is_deadline_passed: z.boolean().default(false),
    incident_description: z
      .string()
      .min(1, "Incident description is required"),
    what_happened: z.string().min(1, "What happened is required"),
    how_discovered: z.string().min(1, "How discovered is required"),
    data_compromised: z.string().min(1, "Data compromised is required"),
    data_categories_affected: z
      .array(DataCategoryEnum)
      .min(1, "At least one data category must be selected"),
    estimated_affected_subjects: z
      .number()
      .int()
      .positive("Estimated affected subjects must be a positive number"),
    affected_subject_keys: z.array(z.string()).optional().nullable(),
    notification_required: NotificationRequiredEnum,
    notification_status: NotificationStatusEnum,
    authority_notified: z.boolean().default(false),
    authority_notification_date: z.string().optional().nullable(),
    supervisory_authority: z.string().optional().nullable(),
    authority_reference_number: z.string().optional().nullable(),
    authority_response: z.string().optional().nullable(),
    subjects_notified: z.boolean().default(false),
    subject_notification_date: z.string().optional().nullable(),
    notification_method: NotificationMethodEnum.optional().nullable(),
    notification_template_used: z.string().optional().nullable(),
    immediate_actions: z.string().min(1, "Immediate actions is required"),
    mitigation_measures: z
      .string()
      .min(1, "Mitigation measures is required"),
    preventive_measures: z
      .string()
      .min(1, "Preventive measures is required"),
    root_cause_analysis: z.string().optional().nullable(),
    responsible_party: z.string().optional().nullable(),
    lessons_learned: z.string().optional().nullable(),
    status: StatusEnum,
    resolution_date: z.string().optional().nullable(),
    processing_activity_ids: z
      .array(z.number().int().positive())
      .optional()
      .nullable(),
    affected_systems: z
      .array(z.string().max(255, "Each system must not exceed 255 characters"))
      .min(1, "At least one affected system must be specified"),
    third_party_involved: z.boolean().default(false),
    vendor_id: z.number().int().positive().optional().nullable(),
    evidence_uris: z
      .array(z.string().url("Each evidence URI must be a valid URL"))
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Conditional: is_breach
    if (data.is_breach) {
      if (
        !data.breach_criteria_met ||
        data.breach_criteria_met.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breach_criteria_met"],
          message: "Breach criteria must be specified when is_breach is true",
        });
      }
    }

    // Conditional: authority_notified
    if (data.authority_notified) {
      if (!data.authority_notification_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["authority_notification_date"],
          message:
            "Authority notification date is required when authority is notified",
        });
      }
      if (!data.supervisory_authority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["supervisory_authority"],
          message:
            "Supervisory authority is required when authority is notified",
        });
      }
    }

    // Conditional: subjects_notified
    if (data.subjects_notified) {
      if (!data.subject_notification_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subject_notification_date"],
          message:
            "Subject notification date is required when subjects are notified",
        });
      }
      if (!data.notification_method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["notification_method"],
          message:
            "Notification method is required when subjects are notified",
        });
      }
    }

    // Conditional: status = resolved
    if (data.status === "resolved") {
      if (!data.root_cause_analysis) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["root_cause_analysis"],
          message: "Root cause analysis is required when status is resolved",
        });
      }
      if (!data.lessons_learned) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lessons_learned"],
          message: "Lessons learned is required when status is resolved",
        });
      }
      if (!data.resolution_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resolution_date"],
          message: "Resolution date is required when status is resolved",
        });
      }
    }

    // Conditional: third_party_involved
    if (data.third_party_involved) {
      if (!data.vendor_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["vendor_id"],
          message: "Vendor ID is required when third party is involved",
        });
      }
    }
  });

export type PrivacyIncidentFormData = z.infer<typeof privacyIncidentSchema>;

