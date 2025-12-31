import { z } from "zod";
import {
  Purpose,
  OwnerTeam,
  DataSteward,
  Status,
  SizeUnit,
  PrimaryLanguage,
  ContainPersonalData,
  Sensitivity,
  CrossBorderTransfer,
  LicenseType,
} from "@/app/lib/features/datasetsApi";

// Enum schemas using zod
const PurposeEnum = z.nativeEnum(Purpose);
const OwnerTeamEnum = z.nativeEnum(OwnerTeam);
const DataStewardEnum = z.nativeEnum(DataSteward);
const StatusEnum = z.nativeEnum(Status);
const SizeUnitEnum = z.nativeEnum(SizeUnit);
const PrimaryLanguageEnum = z.nativeEnum(PrimaryLanguage);
const ContainPersonalDataEnum = z.nativeEnum(ContainPersonalData);
const SensitivityEnum = z.nativeEnum(Sensitivity);
const CrossBorderTransferEnum = z.nativeEnum(CrossBorderTransfer);
const LicenseTypeEnum = z.nativeEnum(LicenseType);

export const datasetSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must not exceed 255 characters"),
    description: z.string().optional().nullable().or(z.literal("")),
    purpose: PurposeEnum,
    owner_team: OwnerTeamEnum,
    data_steward: DataStewardEnum,
    source_ids: z
      .array(z.number().int().positive())
      .min(1, "At least one data source is required"),
    status: StatusEnum,
    estimated_row_count: z.number().int().min(0).optional().nullable(),
    estimated_size: z.number().int().min(0).optional().nullable(),
    size_unit: SizeUnitEnum.optional().nullable(),
    retention_period: z.string().max(100).optional().nullable().or(z.literal("")),
    primary_languages: z.array(PrimaryLanguageEnum).min(1).optional().nullable(),
    contains_personal_data: ContainPersonalDataEnum,
    sensitivity: SensitivityEnum,
    cross_border_transfer: CrossBorderTransferEnum,
    license_type: LicenseTypeEnum.optional().nullable(),
  })
  .refine(
    (data) => {
      // If estimated_size is provided, size_unit is required
      if (data.estimated_size !== null && data.estimated_size !== undefined) {
        return data.size_unit !== null && data.size_unit !== undefined;
      }
      return true;
    },
    {
      message: "Size unit is required when estimated size is provided",
      path: ["size_unit"],
    }
  )
  .transform((data) => ({
    ...data,
    description: data.description === "" ? null : data.description,
    retention_period: data.retention_period === "" ? null : data.retention_period,
  }));

export type DatasetFormData = z.infer<typeof datasetSchema>;

