import { z } from "zod";
import {
  Role,
  ConsentCheckStatus,
  CrossBorderCheck,
  SpecialCategoryCheck,
  CreatedBy,
  LinkageStatus,
} from "@/app/lib/features/modelDatasetLinksApi";

const RoleEnum = z.nativeEnum(Role);
const ConsentCheckStatusEnum = z.nativeEnum(ConsentCheckStatus);
const CrossBorderCheckEnum = z.nativeEnum(CrossBorderCheck);
const SpecialCategoryCheckEnum = z.nativeEnum(SpecialCategoryCheck);
const CreatedByEnum = z.nativeEnum(CreatedBy);
const LinkageStatusEnum = z.nativeEnum(LinkageStatus);

export const modelDatasetLinkSchema = z
  .object({
    ai_model_id: z.number().int().positive("AI Model is required"),
    ai_model_version_id: z.number().int().positive("AI Model Version is required"),
    dataset_id: z.number().int().positive("Dataset is required"),
    dataset_snapshot_id: z.number().int().positive().nullable().optional(),
    role: RoleEnum,
    rows_used: z.number().int().min(0).nullable().optional(),
    training_start_date: z.string().nullable().optional(),
    training_end_date: z.string().nullable().optional(),
    training_duration: z.string().max(100).nullable().optional().or(z.literal("")),
    compute_resources: z.string().max(255).nullable().optional().or(z.literal("")),
    cost: z.number().min(0).nullable().optional(),
    consent_check_status: ConsentCheckStatusEnum.nullable().optional(),
    cross_border_check: CrossBorderCheckEnum,
    special_category_check: SpecialCategoryCheckEnum,
    bias_mitigation_applied: z.boolean().nullable().optional(),
    created_by_system: CreatedByEnum,
    linkage_status: LinkageStatusEnum,
    business_justification: z.string().nullable().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If role is TRAIN, VALIDATION, TEST, or EVAL_BENCHMARK, dataset_snapshot_id is required
      const rolesRequiringSnapshot = [
        Role.TRAIN,
        Role.VALIDATION,
        Role.TEST,
        Role.EVAL_BENCHMARK,
      ];
      if (rolesRequiringSnapshot.includes(data.role)) {
        return data.dataset_snapshot_id !== null && data.dataset_snapshot_id !== undefined;
      }
      return true;
    },
    {
      message:
        "A dataset snapshot is required for train, validation, test, and eval_benchmark roles for reproducibility and audit purposes.",
      path: ["dataset_snapshot_id"],
    }
  )
  .refine(
    (data) => {
      // If training_end_date is provided, it must be after or equal to training_start_date
      if (data.training_start_date && data.training_end_date) {
        return new Date(data.training_end_date) >= new Date(data.training_start_date);
      }
      return true;
    },
    {
      message: "Training end date must be after or equal to training start date",
      path: ["training_end_date"],
    }
  )
  .transform((data) => ({
    ...data,
    training_duration: data.training_duration === "" ? null : data.training_duration,
    compute_resources: data.compute_resources === "" ? null : data.compute_resources,
    business_justification: data.business_justification === "" ? null : data.business_justification,
  }));

export type ModelDatasetLinkFormData = z.infer<typeof modelDatasetLinkSchema>;

