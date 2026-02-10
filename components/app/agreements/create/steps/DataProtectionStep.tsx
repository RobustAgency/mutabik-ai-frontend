"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AgreementFormData } from "@/lib/schemas/agreement.schema";

const TRAINING_OPT_OUT_OPTIONS = [
  { value: "prohibited", label: "Prohibited" },
  { value: "allowed_with_consent", label: "Allowed with Consent" },
  { value: "allowed_with_pre_terms", label: "Allowed with Pre-Terms" },
  { value: "not_applicable", label: "Not Applicable" },
  { value: "not_specified", label: "Not Specified" },
];

const AUDIT_RIGHTS_OPTIONS = [
  { value: "full_audit_rights", label: "Full Audit Rights" },
  { value: "third_party_audit_only", label: "Third Party Audit Only" },
  { value: "soc_2_iso_reports_only", label: "SOC 2 / ISO Reports Only" },
  { value: "none", label: "None" },
  { value: "limited", label: "Limited" },
];

const TRANSFER_MECHANISM_OPTIONS = [
  { value: "adequacy", label: "Adequacy" },
  { value: "sccs", label: "SCCs" },
  { value: "bcrs", label: "BCRs" },
  { value: "dpa_addendum", label: "DPA Addendum" },
  { value: "derogation", label: "Derogation" },
  { value: "none", label: "None" },
];

const SUB_PROCESSING_RIGHTS_OPTIONS = [
  { value: "prohibited", label: "Prohibited" },
  { value: "allowed_with_notification", label: "Allowed with Notification" },
  { value: "allowed_with_approval", label: "Allowed with Approval" },
  { value: "per_sub_processor_list", label: "Per Sub-Processor List" },
];


export const DataProtectionStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AgreementFormData>();

  const trainingOptOut = watch("training_opt_out");
  const auditRights = watch("audit_rights");
  const transferMechanism = watch("transfer_mechanism");
  const subProcessingRights = watch("sub_processing_rights");

  const hasError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 4: Compliance Details
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Training Opt Out */}
        <div className="space-y-2">
          <Label htmlFor="training_opt_out">Training Opt Out</Label>
          <Select
            key={`training_opt_out-select-${trainingOptOut || "none"}`}
            value={trainingOptOut || ""}
            onValueChange={(value) =>
              setValue("training_opt_out", value ? (value as any) : null, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select training opt out" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_OPT_OUT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("training_opt_out") && (
            <p className="text-sm text-red-500">{getError("training_opt_out")}</p>
          )}
        </div>

        {/* Audit Rights */}
        <div className="space-y-2">
          <Label htmlFor="audit_rights">Audit Rights</Label>
          <Select
            key={`audit_rights-select-${auditRights || "none"}`}
            value={auditRights || ""}
            onValueChange={(value) =>
              setValue("audit_rights", value ? (value as any) : null, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select audit rights" />
            </SelectTrigger>
            <SelectContent>
              {AUDIT_RIGHTS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("audit_rights") && (
            <p className="text-sm text-red-500">{getError("audit_rights")}</p>
          )}
        </div>

        {/* Transfer Mechanism */}
        <div className="space-y-2">
          <Label htmlFor="transfer_mechanism">Transfer Mechanism</Label>
          <Select
            key={`transfer_mechanism-select-${transferMechanism || "none"}`}
            value={transferMechanism || ""}
            onValueChange={(value) =>
              setValue("transfer_mechanism", value ? (value as any) : null, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select transfer mechanism" />
            </SelectTrigger>
            <SelectContent>
              {TRANSFER_MECHANISM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("transfer_mechanism") && (
            <p className="text-sm text-red-500">{getError("transfer_mechanism")}</p>
          )}
        </div>

        {/* Sub Processing Rights */}
        <div className="space-y-2">
          <Label htmlFor="sub_processing_rights">Sub Processing Rights</Label>
          <Select
            key={`sub_processing_rights-select-${subProcessingRights || "none"}`}
            value={subProcessingRights || ""}
            onValueChange={(value) =>
              setValue("sub_processing_rights", value ? (value as any) : null, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sub processing rights" />
            </SelectTrigger>
            <SelectContent>
              {SUB_PROCESSING_RIGHTS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("sub_processing_rights") && (
            <p className="text-sm text-red-500">{getError("sub_processing_rights")}</p>
          )}
        </div>

      </div>
    </div>
  );
};

