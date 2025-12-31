import { z } from "zod";
import {
  SystemType,
  OwnerTeam,
  DataDomain,
  DataResidency,
  CriticalityLevel,
  HostingModel,
  DataSourceStatus,
} from "@/app/lib/features/dataSourcesApi";

// Enum schemas using zod
const SystemTypeEnum = z.nativeEnum(SystemType);
const OwnerTeamEnum = z.nativeEnum(OwnerTeam);
const DataDomainEnum = z.nativeEnum(DataDomain);
const DataResidencyEnum = z.nativeEnum(DataResidency);
const CriticalityLevelEnum = z.nativeEnum(CriticalityLevel);
const HostingModelEnum = z.nativeEnum(HostingModel);
const DataSourceStatusEnum = z.nativeEnum(DataSourceStatus);

export const dataSourceSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must not exceed 255 characters"),
    description: z.string().min(1, "Description is required"),
    system_type: SystemTypeEnum,
    owner_team: OwnerTeamEnum,
    data_domains: z.array(DataDomainEnum),
    residency: DataResidencyEnum,
    criticality_level: CriticalityLevelEnum.optional().nullable(),
    hosting_model: HostingModelEnum,
    technical_owner: OwnerTeamEnum,
    business_owner: OwnerTeamEnum,
    last_review_date: z.string().optional().nullable().or(z.literal("")),
    next_review_date: z.string().optional().nullable().or(z.literal("")),
    status: DataSourceStatusEnum,
  })
  .refine(
    (data) => {
      if (data.last_review_date && data.next_review_date) {
        const lastReview = new Date(data.last_review_date);
        const nextReview = new Date(data.next_review_date);
        return nextReview >= lastReview;
      }
      return true;
    },
    {
      message: "Next review date must be after or equal to last review date",
      path: ["next_review_date"],
    }
  )
  .transform((data) => ({
    ...data,
    last_review_date: data.last_review_date === "" ? null : data.last_review_date,
    next_review_date: data.next_review_date === "" ? null : data.next_review_date,
  }));

export type DataSourceFormData = z.infer<typeof dataSourceSchema>;

