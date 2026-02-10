import { z } from "zod";

const VendorTypeEnum = z.enum([
  "model_provider",
  "dataset_provider",
  "infrastructure_cloud",
  "saas_platform",
  "consulting_services",
  "hardware_provider",
  "api_service",
  "annotation_labeling",
  "other",
]);

const VendorRiskTierEnum = z.enum(["tier_1", "tier_2", "tier_3", "tier_4"]);

const VendorStatusEnum = z.enum([
  "evaluating",
  "approved",
  "conditionally_approved",
  "restricted",
  "suspended",
  "terminated",
]);

const DataProcessingRoleEnum = z.enum([
  "controller",
  "processor",
  "sub_processor",
  "not_applicable",
]);

const PrimaryContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().nullable().or(z.literal("")),
  role: z.string().optional().nullable().or(z.literal("")),
  primary: z.boolean().optional().nullable(),
});

export const vendorSchema = z
  .object({
    vendor_name: z
      .string()
      .min(1, "Vendor name is required")
      .max(255, "Vendor name must not exceed 255 characters"),
    legal_name: z
      .string()
      .min(1, "Legal name is required")
      .max(255, "Legal name must not exceed 255 characters"),
    hq_country: z
      .string()
      .min(1, "HQ country is required")
      .length(2, "HQ country must be a 2-letter country code")
      .regex(/^[A-Z]{2}$/, "HQ country must be uppercase 2-letter country code"),
    risk_tier: VendorRiskTierEnum,
    status: VendorStatusEnum,
    type: z
      .array(VendorTypeEnum)
      .min(1, "At least one vendor type is required"),
    data_processing_role: DataProcessingRoleEnum,
    service_provided: z
      .string()
      .max(500, "Service provided must not exceed 500 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    primary_contacts: z.array(PrimaryContactSchema).optional().nullable().default([]),
    duns_number: z
      .string()
      .max(50, "DUNS number must not exceed 50 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    lei_number: z
      .string()
      .max(50, "LEI number must not exceed 50 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    tax_id: z
      .string()
      .max(50, "Tax ID must not exceed 50 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    stock_ticker: z
      .string()
      .max(20, "Stock ticker must not exceed 20 characters")
      .optional()
      .nullable()
      .or(z.literal("")),
    notes: z.string().optional().nullable().or(z.literal("")),
    metadata: z
      .object({
        sub_processors_url: z
          .union([
            z.string().url("Please enter a valid URL"),
            z.literal(""),
            z.null(),
          ])
          .optional()
          .nullable(),
        residency_options: z.string().optional().nullable().or(z.literal("")),
        websites: z.string().optional().nullable().or(z.literal("")),
        parent_company: z.string().optional().nullable().or(z.literal("")),
        metadata_notes: z.string().optional().nullable().or(z.literal("")),
      })
      .optional()
      .nullable(),
  })
  .transform((data) => ({
    ...data,
    service_provided: data.service_provided === "" ? null : data.service_provided,
    duns_number: data.duns_number === "" ? null : data.duns_number,
    lei_number: data.lei_number === "" ? null : data.lei_number,
    tax_id: data.tax_id === "" ? null : data.tax_id,
    stock_ticker: data.stock_ticker === "" ? null : data.stock_ticker,
    notes: data.notes === "" ? null : data.notes,
    primary_contacts: data.primary_contacts?.map((contact) => ({
      ...contact,
      phone: contact.phone === "" ? null : contact.phone,
      role: contact.role === "" ? null : contact.role,
    })) || [],
    metadata: data.metadata ? (() => {
      const processed = {
        sub_processors_url: data.metadata.sub_processors_url === "" ? null : data.metadata.sub_processors_url,
        residency_options: data.metadata.residency_options === "" ? null : data.metadata.residency_options,
        websites: data.metadata.websites === "" ? null : data.metadata.websites,
        parent_company: data.metadata.parent_company === "" ? null : data.metadata.parent_company,
        metadata_notes: data.metadata.metadata_notes === "" ? null : data.metadata.metadata_notes,
      };
      // If all fields are null/empty, return null
      const hasAnyValue = Object.values(processed).some(val => val !== null && val !== "");
      return hasAnyValue ? processed : null;
    })() : null,
  }));

export type VendorFormData = z.infer<typeof vendorSchema>;

