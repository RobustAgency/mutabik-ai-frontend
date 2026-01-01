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
import { Checkbox } from "@/components/ui/checkbox";
import type { ModelDatasetLinkFormData } from "@/lib/schemas/modelDatasetLink.schema";
import {
  ConsentCheckStatus,
  CrossBorderCheck,
  SpecialCategoryCheck,
} from "@/app/lib/features/modelDatasetLinksApi";

const CONSENT_CHECK_STATUS_OPTIONS = [
  { value: ConsentCheckStatus.PASSED, label: "Passed" },
  { value: ConsentCheckStatus.WARNING, label: "Warning" },
  { value: ConsentCheckStatus.FAILED, label: "Failed" },
  { value: ConsentCheckStatus.NOT_APPLICABLE, label: "Not Applicable" },
];

const CROSS_BORDER_CHECK_OPTIONS = [
  { value: CrossBorderCheck.PASSED, label: "Passed" },
  { value: CrossBorderCheck.FAILED, label: "Failed" },
  { value: CrossBorderCheck.NOT_APPLICABLE, label: "Not Applicable" },
];

const SPECIAL_CATEGORY_CHECK_OPTIONS = [
  { value: SpecialCategoryCheck.PASSED, label: "Passed" },
  { value: SpecialCategoryCheck.FAILED, label: "Failed" },
  { value: SpecialCategoryCheck.NOT_APPLICABLE, label: "Not Applicable" },
];

export const ComplianceChecksStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ModelDatasetLinkFormData>();

  const consentCheckStatus = watch("consent_check_status");
  const crossBorderCheck = watch("cross_border_check");
  const specialCategoryCheck = watch("special_category_check");
  const biasMitigationApplied = watch("bias_mitigation_applied");

  const hasError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Compliance Checks <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consent Check Status */}
          <div className="space-y-2">
            <Label htmlFor="consent_check_status">Consent Check Status</Label>
            <Select
              key={`consent_check_status-${consentCheckStatus || "none"}`}
              value={consentCheckStatus || "null"}
              onValueChange={(value) =>
                setValue("consent_check_status", value === "null" ? null : (value as ConsentCheckStatus), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {CONSENT_CHECK_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cross-Border Check */}
          <div className="space-y-2">
            <Label htmlFor="cross_border_check">
              Cross-Border Check <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`cross_border_check-${crossBorderCheck || "none"}`}
              value={crossBorderCheck || ""}
              onValueChange={(value) =>
                setValue("cross_border_check", value as CrossBorderCheck, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("cross_border_check") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {CROSS_BORDER_CHECK_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("cross_border_check") && (
              <p className="text-sm text-red-500">{getError("cross_border_check")}</p>
            )}
          </div>

          {/* Special Category Check */}
          <div className="space-y-2">
            <Label htmlFor="special_category_check">
              Special Category Check <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`special_category_check-${specialCategoryCheck || "none"}`}
              value={specialCategoryCheck || ""}
              onValueChange={(value) =>
                setValue("special_category_check", value as SpecialCategoryCheck, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("special_category_check") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {SPECIAL_CATEGORY_CHECK_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("special_category_check") && (
              <p className="text-sm text-red-500">{getError("special_category_check")}</p>
            )}
          </div>

          {/* Bias Mitigation Applied */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bias_mitigation_applied"
                checked={biasMitigationApplied ?? false}
                onCheckedChange={(checked) =>
                  setValue("bias_mitigation_applied", checked as boolean, {
                    shouldValidate: true,
                  })
                }
              />
              <Label htmlFor="bias_mitigation_applied" className="cursor-pointer">
                Bias Mitigation Applied
              </Label>
            </div>
            <p className="text-xs text-[#667085]">Whether bias mitigation techniques were applied</p>
          </div>
        </div>
      </div>
    </div>
  );
};

