import { z } from "zod";
import {
  DataType,
  Sensitivity,
  PiiFlag,
  PersonalDataCategory,
  SpecialCategoryFlag,
  CdeFlag,
  CdeCategory,
} from "@/app/lib/features/dataElementsApi";

// Enum schemas using zod
const DataTypeEnum = z.nativeEnum(DataType);
const SensitivityEnum = z.nativeEnum(Sensitivity);
const PiiFlagEnum = z.nativeEnum(PiiFlag);
const PersonalDataCategoryEnum = z.nativeEnum(PersonalDataCategory);
const SpecialCategoryFlagEnum = z.nativeEnum(SpecialCategoryFlag);
const CdeFlagEnum = z.nativeEnum(CdeFlag);
const CdeCategoryEnum = z.nativeEnum(CdeCategory);

export const dataElementSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must not exceed 255 characters"),
    business_definition: z.string().optional().nullable().or(z.literal("")),
    data_type: DataTypeEnum,
    format: z.string().max(255).optional().nullable().or(z.literal("")),
    sensitivity: SensitivityEnum,
    pii_flag: PiiFlagEnum,
    personal_data_category: PersonalDataCategoryEnum.optional().nullable(),
    special_category_flag: SpecialCategoryFlagEnum,
    cde_flag: CdeFlagEnum,
    cde_category: CdeCategoryEnum.optional().nullable(),
    owner_team: z.string().max(255).optional().nullable().or(z.literal("")),
    quality_rules_ref: z.string().optional().nullable().or(z.literal("")),
    catalog_column_id: z.string().max(255).optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If cde_flag is "Yes", cde_category is required
      if (data.cde_flag === CdeFlag.YES) {
        return data.cde_category !== null && data.cde_category !== undefined;
      }
      return true;
    },
    {
      message: "CDE category is required when CDE flag is Yes",
      path: ["cde_category"],
    }
  )
  .transform((data) => ({
    ...data,
    business_definition: data.business_definition === "" ? null : data.business_definition,
    format: data.format === "" ? null : data.format,
    owner_team: data.owner_team === "" ? null : data.owner_team,
    quality_rules_ref: data.quality_rules_ref === "" ? null : data.quality_rules_ref,
    catalog_column_id: data.catalog_column_id === "" ? null : data.catalog_column_id,
  }));

export type DataElementFormData = z.infer<typeof dataElementSchema>;
