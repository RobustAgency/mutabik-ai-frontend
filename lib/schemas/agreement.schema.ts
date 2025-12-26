import { z } from "zod";

const AgreementTypeEnum = z.enum([
  "msa",
  "dpa",
  "order_form",
  "addendum",
  "sla",
  "nda",
  "sow",
  "other",
]);

const AgreementStatusEnum = z.enum([
  "draft",
  "under_review",
  "pending_signature",
  "active",
  "expired",
  "terminated",
  "suspended",
]);

const RenewalTypeEnum = z.enum([
  "auto_renewal",
  "manual_renewal",
  "one_time_fixed_term",
  "evergreen",
]);

const GoverningLawEnum = z.enum([
  "delaware",
  "california",
  "england_new_wales",
  "uae_federal",
  "germany",
  "singapore",
]);

const TrainingOptOutEnum = z.enum([
  "prohibited",
  "allowed_with_consent",
  "allowed_with_pre_terms",
  "not_applicable",
  "not_specified",
]);

const AuditRightsEnum = z.enum([
  "full_audit_rights",
  "third_party_audit_only",
  "soc_2_iso_reports_only",
  "none",
  "limited",
]);

const TransferMechanismEnum = z.enum([
  "adequacy",
  "sccs",
  "bcrs",
  "dpa_addendum",
  "derogation",
  "none",
]);

const SubProcessingRightsEnum = z.enum([
  "prohibited",
  "allowed_with_notification",
  "allowed_with_approval",
  "per_sub_processor_list",
]);

const IndemnificationEnum = z.enum([
  "vendor_indemnifies",
  "mutual",
  "limited",
  "none",
]);

const DisputeResolutionEnum = z.enum([
  "mediation_then_arbitration",
  "arbitration",
  "courts",
]);

const ConfidentialityTermEnum = z.enum([
  "strict",
  "moderate",
  "lenient",
]);

const ParentAgreementEnum = z.enum([
  "msa_openai_2024",
  "msa_aws_2023",
  "none",
]);

const ReplacesAgreementEnum = z.enum([
  "dpa_openai_2023",
  "none",
]);

export const agreementSchema = z
  .object({
    vendor_id: z.number().int().positive("Vendor is required"),
    agreement_type: AgreementTypeEnum,
    status: AgreementStatusEnum,
    agreement_owner_id: z.number().int().positive("Agreement owner is required"),
    asset_types_covered: z
      .array(z.string())
      .min(1, "At least one asset type must be selected"),
    renewal_type: RenewalTypeEnum.optional().nullable(),
    notice_period_days: z
      .number()
      .int()
      .nonnegative("Notice period days must be a non-negative integer")
      .optional()
      .nullable()
      .transform((val) => (val === 0 ? null : val)),
    termination_for_convenience: z.boolean().optional().nullable(),
    governing_law: GoverningLawEnum.optional().nullable(),
    effective_from: z
      .string()
      .min(1, "Effective from date is required")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        { message: "Effective from must be a valid date" }
      ),
    effective_to: z
      .string()
      .min(1, "Effective to date is required")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        { message: "Effective to must be a valid date" }
      ),
    training_opt_out: TrainingOptOutEnum.optional().nullable(),
    audit_rights: AuditRightsEnum.optional().nullable(),
    transfer_mechanism: TransferMechanismEnum.optional().nullable(),
    sub_processing_rights: SubProcessingRightsEnum.optional().nullable(),
    contract_value: z
      .number()
      .nonnegative("Contract value must be a non-negative number")
      .optional()
      .nullable()
      .transform((val) => (val === 0 ? null : val)),
    liability_cap: z
      .number()
      .nonnegative("Liability cap must be a non-negative number")
      .optional()
      .nullable()
      .transform((val) => (val === 0 ? null : val)),
    insurance_requirements: z
      .string()
      .max(500, "Insurance requirements must not exceed 500 characters")
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    indemnification: IndemnificationEnum.optional().nullable(),
    internal_reference_number: z
      .string()
      .max(255, "Internal reference number must not exceed 255 characters")
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    vendor_contract_id: z
      .string()
      .max(255, "Vendor contract ID must not exceed 255 characters")
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    dispute_resolution: DisputeResolutionEnum.optional().nullable(),
    confidentiality_term: ConfidentialityTermEnum.optional().nullable(),
    parent_agreement: ParentAgreementEnum.optional().nullable(),
    replaces_agreement: ReplacesAgreementEnum.optional().nullable(),
    notes: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val === "" ? null : val)),
    doc_ref: z
      .string()
      .min(1, "Document reference is required")
      .max(500, "Document reference must not exceed 500 characters"),
  })
  .refine(
    (data) => {
      if (data.effective_from && data.effective_to) {
        return new Date(data.effective_to) > new Date(data.effective_from);
      }
      return true;
    },
    {
      message: "Effective to date must be after effective from date",
      path: ["effective_to"],
    }
  );

export type AgreementFormData = z.infer<typeof agreementSchema>;

