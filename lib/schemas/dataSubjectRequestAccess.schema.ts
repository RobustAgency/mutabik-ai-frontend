import { z } from "zod";
import {
  DSARStatus,
  DSARPriority,
  DSARRequestType,
  DSARSubjectRealm,
  DSARRequestSource,
  DSARResponseFormat,
  DSARResponseMethod,
  DSARVerificationMethod,
  DSARVerificationStatus,
} from "@/interfaces/DataSubjectRequestAccess";

// Enums using zod (mirror backend enums)
const StatusEnum = z.enum([
  "new",
  "pending_verification",
  "in_progress",
  "pending_approval",
  "ready_for_response",
  "completed",
  "rejected",
  "cancelled",
]) as unknown as z.ZodType<DSARStatus>;

const PriorityEnum = z.enum(["low", "normal", "high", "urgent"]) as unknown as z.ZodType<DSARPriority>;

const RequestTypeEnum = z.enum([
  "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
  "opt_out_marketing",
  "ai_explainability",
  "automated_decision_challenge",
]) as unknown as z.ZodType<DSARRequestType>;

const SubjectRealmEnum = z.enum([
  "customer",
  "employee",
  "vendor",
  "student",
  "patient",
]) as unknown as z.ZodType<DSARSubjectRealm>;

const VerificationStatusEnum = z.enum([
  "pending",
  "in_progress",
  "verified",
  "rejected",
  "failed",
]) as unknown as z.ZodType<DSARVerificationStatus>;

const VerificationMethodEnum = z.enum([
  "email_link",
  "sms_code",
  "id_document",
  "in_person",
  "callback",
]) as unknown as z.ZodType<DSARVerificationMethod>;

const RequestSourceEnum = z.enum([
  "email",
  "web_form",
  "phone",
  "letter",
  "in_person",
]) as unknown as z.ZodType<DSARRequestSource>;

const ResponseMethodEnum = z.enum([
  "email",
  "secure_portal",
  "encrypted_file",
  "physical_mail",
  "in_person",
]) as unknown as z.ZodType<DSARResponseMethod>;

const ResponseFormatEnum = z.enum([
  "pdf",
  "json",
  "csv",
  "excel",
  "portal_access",
  "physical_copy",
]) as unknown as z.ZodType<DSARResponseFormat>;

// Base schema (all fields as strings / primitives)
export const dataSubjectRequestAccessSchema = z
  .object({
    request_type: RequestTypeEnum,
    subject_identifier: z
      .string()
      .min(1, "Subject identifier is required")
      .max(255, "Subject identifier must not exceed 255 characters"),
    subject_name: z.string().max(255).optional().nullable(),
    subject_realm: SubjectRealmEnum,
    verification_status: VerificationStatusEnum,
    subject_key: z.string().max(255).optional().nullable(),
    verification_method: VerificationMethodEnum.optional().nullable(),
    verified_by: z
      .string()
      .optional()
      .nullable(), // keep as string for Select; convert to number on submit
    request_details: z.string().min(1, "Request details are required"),
    requested_data_categories: z.array(z.string()).optional().nullable(),
    request_source: RequestSourceEnum,
    submitted_date: z.string().min(1, "Submitted date is required"),
    due_date: z.string().min(1, "Due date is required"),
    extended_due_date: z.string().optional().nullable(),
    status: StatusEnum,
    response_date: z.string().optional().nullable(),
    completed_date: z.string().optional().nullable(),
    priority: PriorityEnum,
    is_overdue: z.boolean(),
    assigned_to: z
      .string()
      .min(1, "Assignee is required"), // string ID, convert to number on submit
    assigned_date: z.string().min(1, "Assigned date is required"),
    response_method: ResponseMethodEnum.optional().nullable(),
    response_format: ResponseFormatEnum.optional().nullable(),
    response_uri: z.string().url("Must be a valid URL").optional().nullable(),
    response_notes: z.string().optional().nullable(),
    rejection_reason: z.string().optional().nullable(),
    jurisdiction: z.string().max(255).optional().nullable(),
    processing_activity_ids: z.array(z.number().int().positive()).optional().nullable(),
    systems_checked: z
      .string()
      .min(1, "Systems checked is required")
      .max(255, "Systems checked must not exceed 255 characters"),
    records_found: z.number().int().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const isVerified = data.verification_status === "verified";
    const isCompleted = data.status === "completed";
    const isReadyForResponse = data.status === "ready_for_response";
    const isRejected = data.status === "rejected";

    // Conditional: verified
    if (isVerified) {
      if (!data.subject_key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subject_key"],
          message: "Subject key is required when verification status is verified",
        });
      }
      if (!data.verification_method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verification_method"],
          message: "Verification method is required when status is verified",
        });
      }
      if (!data.verified_by) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["verified_by"],
          message: "Verified by is required when status is verified",
        });
      }
    }

    // Conditional: completed
    if (isCompleted) {
      if (!data.response_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["response_date"],
          message: "Response date is required when status is completed",
        });
      }
      if (!data.completed_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["completed_date"],
          message: "Completed date is required when status is completed",
        });
      }
    }

    // Conditional: ready_for_response
    if (isReadyForResponse) {
      if (!data.response_method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["response_method"],
          message: "Response method is required when status is ready for response",
        });
      }
      if (!data.response_format) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["response_format"],
          message: "Response format is required when status is ready for response",
        });
      }
      if (!data.response_uri) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["response_uri"],
          message: "Response URI is required when status is ready for response",
        });
      }
    }

    // Conditional: rejected
    if (isRejected) {
      if (!data.jurisdiction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jurisdiction"],
          message: "Jurisdiction is required when status is rejected",
        });
      }
    }
  });

export type DataSubjectRequestAccessFormData = z.infer<
  typeof dataSubjectRequestAccessSchema
>;


