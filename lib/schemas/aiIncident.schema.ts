import { z } from "zod";
import {
  IncidentType,
  Domain,
  IncidentSeverity,
  IncidentStatus,
  ResponseTeam,
  PrimaryRegulatoryFramework,
  NotificationRequirement,
  ResidencyAffected,
  ImpactedDataType,
  AffectedBusinessUnit,
  ExternalParty,
} from "@/app/lib/features/aiIncidentsApi";

const IncidentTypeEnum = z.nativeEnum(IncidentType);
const DomainEnum = z.nativeEnum(Domain);
const IncidentSeverityEnum = z.nativeEnum(IncidentSeverity);
const IncidentStatusEnum = z.nativeEnum(IncidentStatus);
const ResponseTeamEnum = z.nativeEnum(ResponseTeam);
const PrimaryRegulatoryFrameworkEnum = z.nativeEnum(PrimaryRegulatoryFramework);
const NotificationRequirementEnum = z.nativeEnum(NotificationRequirement);
const ResidencyAffectedEnum = z.nativeEnum(ResidencyAffected);
const ImpactedDataTypeEnum = z.nativeEnum(ImpactedDataType);
const AffectedBusinessUnitEnum = z.nativeEnum(AffectedBusinessUnit);
const ExternalPartyEnum = z.nativeEnum(ExternalParty);

export const aiIncidentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters"),
  summary: z.string().min(1, "Summary is required"),
  incident_type: IncidentTypeEnum,
  domain: DomainEnum,
  severity: IncidentSeverityEnum,
  status: IncidentStatusEnum,
  incident_commander: z
    .string()
    .min(1, "Incident commander is required")
    .max(255, "Incident commander must not exceed 255 characters"),
  response_team: ResponseTeamEnum,
  primary_regulatory_framework: PrimaryRegulatoryFrameworkEnum,
  notification_requirement: NotificationRequirementEnum,
  data_residency_affected: ResidencyAffectedEnum.nullable().optional(),
  regulatory_reference: z.string().max(255).nullable().optional().or(z.literal("")),
  estimated_impacted_users: z.number().int().min(0).nullable().optional(),
  estimated_impacted_records: z.number().int().min(0, "Estimated impacted records is required"),
  data_types_impacted: z
    .array(ImpactedDataTypeEnum)
    .min(1, "At least one data type impacted is required"),
  affected_business_units: z
    .array(AffectedBusinessUnitEnum)
    .min(1)
    .nullable()
    .optional(),
  external_parties_involved: z.array(ExternalPartyEnum).nullable().optional(),
  business_impact_description: z.string().nullable().optional().or(z.literal("")),
  impacted_systems: z.string().max(255).nullable().optional().or(z.literal("")),
  ai_model_id: z.number().int().positive().nullable().optional(),
  linked_dataset_id: z.number().int().positive().nullable().optional(),
  linked_risk_id: z.number().int().positive().nullable().optional(),
  evidence_link: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
});

export type AiIncidentFormData = z.infer<typeof aiIncidentSchema>;


