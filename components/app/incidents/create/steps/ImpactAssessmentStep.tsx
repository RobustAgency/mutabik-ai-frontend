"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AiIncidentFormData } from "@/lib/schemas/aiIncident.schema";
import {
  ImpactedDataType,
  AffectedBusinessUnit,
  ExternalParty,
} from "@/app/lib/features/aiIncidentsApi";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";

const IMPACTED_DATA_TYPE_OPTIONS = [
  { value: ImpactedDataType.PII_DIRECT_IDENTIFIERS, label: "PII - Direct Identifiers" },
  { value: ImpactedDataType.PII_CONTACT_INFORMATION, label: "PII - Contact Information" },
  { value: ImpactedDataType.PII_FINANCIAL, label: "PII - Financial" },
  { value: ImpactedDataType.PII_DEMOGRAPHIC, label: "PII - Demographic" },
  { value: ImpactedDataType.PII_BEHAVIORAL, label: "PII - Behavioral" },
  { value: ImpactedDataType.PII_LOCATION, label: "PII - Location" },
  { value: ImpactedDataType.SPECIAL_CATEGORY_HEALTH, label: "Special Category - Health" },
  { value: ImpactedDataType.SPECIAL_CATEGORY_BIOMETRIC, label: "Special Category - Biometric" },
  { value: ImpactedDataType.SPECIAL_CATEGORY_GENETIC, label: "Special Category - Genetic" },
  { value: ImpactedDataType.SPECIAL_CATEGORY_POLITICAL, label: "Special Category - Political" },
  { value: ImpactedDataType.SPECIAL_CATEGORY_RELIGIOUS, label: "Special Category - Religious" },
  { value: ImpactedDataType.SPECIAL_CATEGORY_RACIAL_ETHNIC, label: "Special Category - Racial/Ethnic" },
  { value: ImpactedDataType.CONFIDENTIAL_BUSINESS_DATA, label: "Confidential Business Data" },
  { value: ImpactedDataType.INTERNAL_DATA, label: "Internal Data" },
  { value: ImpactedDataType.PUBLIC_DATA, label: "Public Data" },
  { value: ImpactedDataType.NONE_UNKNOWN, label: "None/Unknown" },
];

const AFFECTED_BUSINESS_UNIT_OPTIONS = [
  { value: AffectedBusinessUnit.FINANCE, label: "Finance" },
  { value: AffectedBusinessUnit.HUMAN_RESOURCES, label: "Human Resources" },
  { value: AffectedBusinessUnit.MARKETING, label: "Marketing" },
  { value: AffectedBusinessUnit.SALES, label: "Sales" },
  { value: AffectedBusinessUnit.OPERATIONS, label: "Operations" },
  { value: AffectedBusinessUnit.CUSTOMER_SERVICE, label: "Customer Service" },
  { value: AffectedBusinessUnit.IT_TECHNOLOGY, label: "IT/Technology" },
  { value: AffectedBusinessUnit.LEGAL, label: "Legal" },
  { value: AffectedBusinessUnit.RESEARCH_DEVELOPMENT, label: "Research & Development" },
  { value: AffectedBusinessUnit.SUPPLY_CHAIN, label: "Supply Chain" },
  { value: AffectedBusinessUnit.EXECUTIVE_OFFICE, label: "Executive Office" },
  { value: AffectedBusinessUnit.ALL, label: "All" },
];

const EXTERNAL_PARTY_OPTIONS = [
  { value: ExternalParty.CLOUD_SERVICE_PROVIDER, label: "Cloud Service Provider" },
  { value: ExternalParty.DATA_PROCESSOR, label: "Data Processor" },
  { value: ExternalParty.SOFTWARE_VENDOR, label: "Software Vendor" },
  { value: ExternalParty.HARDWARE_VENDOR, label: "Hardware Vendor" },
  { value: ExternalParty.CONSULTING_PARTNER, label: "Consulting Partner" },
  { value: ExternalParty.CUSTOMER, label: "Customer" },
  { value: ExternalParty.BUSINESS_PARTNER, label: "Business Partner" },
  { value: ExternalParty.REGULATOR, label: "Regulator" },
  { value: ExternalParty.AUDITOR, label: "Auditor" },
  { value: ExternalParty.INSURANCE_PROVIDER, label: "Insurance Provider" },
  { value: ExternalParty.NONE, label: "None" },
];

export const ImpactAssessmentStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AiIncidentFormData>();

  const hasError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName]?.message as string;

  const dataTypesImpacted = watch("data_types_impacted") || [];
  const affectedBusinessUnits = watch("affected_business_units") || [];
  const externalPartiesInvolved = watch("external_parties_involved") || [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Impact Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimated_impacted_users">Estimated Impacted Users</Label>
            <Input
              id="estimated_impacted_users"
              type="number"
              min="0"
              {...register("estimated_impacted_users", { valueAsNumber: true })}
              placeholder="Number or 'Internal Only'"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_impacted_records">
              Estimated Impacted Records <span className="text-red-500">*</span>
            </Label>
            <Input
              id="estimated_impacted_records"
              type="number"
              min="0"
              {...register("estimated_impacted_records", { valueAsNumber: true })}
              className={hasError("estimated_impacted_records") ? "border-destructive" : ""}
              placeholder="Number of data records affected"
            />
            {getError("estimated_impacted_records") && (
              <p className="text-sm text-destructive">{getError("estimated_impacted_records")}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="data_types_impacted">
              Data Types Impacted <span className="text-red-500">*</span>
            </Label>
            <CustomMultiSelect
              options={IMPACTED_DATA_TYPE_OPTIONS}
              value={dataTypesImpacted}
              onChange={(value) => setValue("data_types_impacted", value as ImpactedDataType[])}
              placeholder="Select data types"
              error={!!hasError("data_types_impacted")}
            />
            {getError("data_types_impacted") && (
              <p className="text-sm text-destructive">{getError("data_types_impacted")}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="affected_business_units">Affected Business Units</Label>
            <CustomMultiSelect
              options={AFFECTED_BUSINESS_UNIT_OPTIONS}
              value={affectedBusinessUnits}
              onChange={(value) => setValue("affected_business_units", value ? (value as AffectedBusinessUnit[]) : null)}
              placeholder="Select business units"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="external_parties_involved">External Parties Involved</Label>
            <CustomMultiSelect
              options={EXTERNAL_PARTY_OPTIONS}
              value={externalPartiesInvolved}
              onChange={(value) => setValue("external_parties_involved", value ? (value as ExternalParty[]) : null)}
              placeholder="Select external parties"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="business_impact_description">Business Impact Description</Label>
            <Textarea
              id="business_impact_description"
              {...register("business_impact_description")}
              className="min-h-32 resize-none"
              placeholder="Describe operational, reputational, or financial impact"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="impacted_systems">Impacted Systems</Label>
            <Input
              id="impacted_systems"
              {...register("impacted_systems")}
              placeholder="List affected systems, models, or services"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


