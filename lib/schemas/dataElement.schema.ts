import { z } from "zod";
import {
  DataType,
  Sensitivity,
  DataSteward,
  Status,
  PersonalDataCategory,
  DefaultMaskingMethod,
} from "@/app/lib/features/dataElementsApi";

// Enum schemas using zod
const DataTypeEnum = z.nativeEnum(DataType);
const SensitivityEnum = z.nativeEnum(Sensitivity);
const DataStewardEnum = z.nativeEnum(DataSteward);
const StatusEnum = z.nativeEnum(Status);
const PersonalDataCategoryEnum = z.nativeEnum(PersonalDataCategory);
const DefaultMaskingMethodEnum = z.nativeEnum(DefaultMaskingMethod);

export const dataElementSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must not exceed 255 characters"),
    data_type: DataTypeEnum,
    format: z.string().max(255).optional().nullable().or(z.literal("")),
    business_definition: z.string().min(1, "Business definition is required"),
    data_steward: DataStewardEnum,
    status: StatusEnum,
    data_source_id: z.number().int().positive("Data source is required"),
    database_name: z
      .string()
      .min(1, "Database name is required")
      .max(255, "Database name must not exceed 255 characters"),
    schema_name: z.string().max(255).optional().nullable().or(z.literal("")),
    table_name: z
      .string()
      .min(1, "Table name is required")
      .max(255, "Table name must not exceed 255 characters"),
    column_name: z
      .string()
      .min(1, "Column name is required")
      .max(255, "Column name must not exceed 255 characters"),
    used_in_datasets: z.array(z.string()).optional().nullable(),
    is_nullable: z.boolean().optional().nullable(),
    is_unique: z.boolean().optional().nullable(),
    default_value: z.string().optional().nullable(),
    validation_rule: z.string().optional().nullable(),
    sample_values: z.string().optional().nullable(),
    sensitivity: SensitivityEnum,
    contains_personal_data: z.boolean(),
    personal_data_type: PersonalDataCategoryEnum.optional().nullable(),
    contains_sensitive_data: z.boolean().optional().nullable(),
    default_masking_method: DefaultMaskingMethodEnum.optional().nullable(),
    cde_flag: z.boolean().optional().nullable(),
    cde_categories: z.array(z.string()).min(1, "At least one CDE category is required"),
  })
  .refine(
    (data) => {
      // If contains_personal_data is true, personal_data_type is required
      if (data.contains_personal_data) {
        return data.personal_data_type !== null && data.personal_data_type !== undefined;
      }
      return true;
    },
    {
      message: "Personal data type is required when contains personal data is true",
      path: ["personal_data_type"],
    }
  )
  .refine(
    (data) => {
      // If contains_personal_data is true, contains_sensitive_data is required
      if (data.contains_personal_data) {
        return data.contains_sensitive_data !== null && data.contains_sensitive_data !== undefined;
      }
      return true;
    },
    {
      message: "Contains sensitive data is required when contains personal data is true",
      path: ["contains_sensitive_data"],
    }
  )
  .transform((data) => ({
    ...data,
    format: data.format === "" ? null : data.format,
    schema_name: data.schema_name === "" ? null : data.schema_name,
  }));

export type DataElementFormData = z.infer<typeof dataElementSchema>;
