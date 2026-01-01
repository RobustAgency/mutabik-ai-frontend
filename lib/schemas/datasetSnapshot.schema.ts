import { z } from "zod";
import {
  FileFormat,
  ResidencyZone,
  StorageTier,
  Compression,
  EncryptionStatus,
  MaskingMethod,
  ApprovedBy,
  Status,
} from "@/app/lib/features/datasetSnapshotsApi";

const FileFormatEnum = z.nativeEnum(FileFormat);
const ResidencyZoneEnum = z.nativeEnum(ResidencyZone);
const StorageTierEnum = z.nativeEnum(StorageTier);
const CompressionEnum = z.nativeEnum(Compression);
const EncryptionStatusEnum = z.nativeEnum(EncryptionStatus);
const MaskingMethodEnum = z.nativeEnum(MaskingMethod);
const ApprovedByEnum = z.nativeEnum(ApprovedBy);
const StatusEnum = z.nativeEnum(Status);

export const datasetSnapshotSchema = z
  .object({
    dataset_id: z.number().int().positive("Dataset is required"),
    version_tag: z
      .string()
      .min(1, "Version tag is required")
      .max(50, "Version tag must not exceed 50 characters"),
    supersedes_snapshot_id: z.number().int().positive().nullable().optional(),
    description: z.string().optional().nullable().or(z.literal("")),
    time_range_start: z.string().min(1, "Time range start is required"),
    time_range_end: z.string().min(1, "Time range end is required"),
    row_count: z.number().int().min(0, "Row count must be >= 0"),
    file_count: z.number().int().min(0).nullable().optional(),
    total_size: z.number().int().min(0).nullable().optional(),
    size_unit: z.string().max(20).nullable().optional().or(z.literal("")),
    file_format: FileFormatEnum,
    pii_element_count: z.number().int().min(0).nullable().optional(),
    consent_coverage_at_creation: z.number().int().min(0).max(100).nullable().optional(),
    residency_zone: ResidencyZoneEnum,
    storage_uri: z
      .string()
      .min(1, "Storage URI is required")
      .max(500, "Storage URI must not exceed 500 characters"),
    storage_tier: StorageTierEnum.nullable().optional(),
    compression: CompressionEnum.nullable().optional(),
    encryption_status: EncryptionStatusEnum,
    masking_method_applied: MaskingMethodEnum.nullable().optional(),
    quality_checksums: z.string().max(255).nullable().optional().or(z.literal("")),
    created_by_system: z.boolean().nullable().optional(),
    approved_by: ApprovedByEnum.nullable().optional(),
    expiration_date: z.string().nullable().optional(),
    status: StatusEnum,
  })
  .refine(
    (data) => {
      // If time_range_end is provided, it must be after or equal to time_range_start
      if (data.time_range_start && data.time_range_end) {
        return new Date(data.time_range_end) >= new Date(data.time_range_start);
      }
      return true;
    },
    {
      message: "Time range end must be after or equal to time range start",
      path: ["time_range_end"],
    }
  )
  .transform((data) => ({
    ...data,
    description: data.description === "" ? null : data.description,
    size_unit: data.size_unit === "" ? null : data.size_unit,
    quality_checksums: data.quality_checksums === "" ? null : data.quality_checksums,
  }));

export type DatasetSnapshotFormData = z.infer<typeof datasetSnapshotSchema>;

