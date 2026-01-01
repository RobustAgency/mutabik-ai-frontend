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
import type { DatasetFormData } from "@/lib/schemas/dataset.schema";
import {
  CrossBorderTransfer,
  LicenseType,
} from "@/app/lib/features/datasetsApi";

const CROSS_BORDER_TRANSFER_OPTIONS = [
  { value: CrossBorderTransfer.NONE, label: "None" },
  { value: CrossBorderTransfer.ADEQUACY_DECISION, label: "Adequacy Decision" },
  { value: CrossBorderTransfer.STANDARD_CONTRACTUAL_CLAUSES, label: "Standard Contractual Clauses" },
  { value: CrossBorderTransfer.BINDING_CORPORATE_RULES, label: "Binding Corporate Rules" },
  { value: CrossBorderTransfer.EXPLICIT_CONSENT_FOR_TRANSFER, label: "Explicit Consent for Transfer" },
  { value: CrossBorderTransfer.DEROGATION, label: "Derogation" },
];

const LICENSE_TYPE_OPTIONS = [
  { value: LicenseType.PROPRIETARY, label: "Proprietary" },
  { value: LicenseType.OPEN_SOURCE, label: "Open Source" },
  { value: LicenseType.PURCHASES, label: "Purchased" },
  { value: LicenseType.COMMERCIAL_LICENSE, label: "Commercial License" },
  { value: LicenseType.RESEARCH_USE_ONLY, label: "Research Use Only" },
  { value: LicenseType.NO_RESTRICTIONS, label: "No Restrictions" },
];

export const CrossBorderStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetFormData>();

  const crossBorderTransfer = watch("cross_border_transfer");
  const licenseType = watch("license_type");

  const hasError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Cross-Border & Licensing
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cross-Border Transfer */}
        <div className="space-y-2">
          <Label htmlFor="cross_border_transfer">
            Cross-Border Transfer <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`cross_border_transfer-${crossBorderTransfer || "none"}`}
            value={crossBorderTransfer || ""}
            onValueChange={(value) => setValue("cross_border_transfer", value as CrossBorderTransfer, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("cross_border_transfer") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {CROSS_BORDER_TRANSFER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("cross_border_transfer") && (
            <p className="text-sm text-red-500">{getError("cross_border_transfer")}</p>
          )}
        </div>

        {/* License Type */}
        <div className="space-y-2">
          <Label htmlFor="license_type">
            License Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`license_type-${licenseType || "none"}`}
            value={licenseType || "null"}
            onValueChange={(value) => {
              if (value === "null") {
                setValue("license_type", null, { shouldValidate: true });
              } else {
                setValue("license_type", value as LicenseType, { shouldValidate: true });
              }
            }}
          >
            <SelectTrigger
              className={`w-full ${hasError("license_type") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">None</SelectItem>
              {LICENSE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("license_type") && (
            <p className="text-sm text-red-500">{getError("license_type")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

