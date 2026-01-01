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
import type { DataElementFormData } from "@/lib/schemas/dataElement.schema";
import {
  Sensitivity,
  PiiFlag,
} from "@/app/lib/features/dataElementsApi";

const SENSITIVITY_OPTIONS = [
  { value: Sensitivity.PUBLIC, label: "Public" },
  { value: Sensitivity.INTERNAL, label: "Internal" },
  { value: Sensitivity.CONFIDENTIAL, label: "Confidential" },
  { value: Sensitivity.RESTRICTED, label: "Restricted" },
];

const PII_FLAG_OPTIONS = [
  { value: PiiFlag.YES, label: "Yes" },
  { value: PiiFlag.NO, label: "No" },
  { value: PiiFlag.MAY_CONTAIN, label: "May Contain" },
];

export const ClassificationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const sensitivity = watch("sensitivity");
  const piiFlag = watch("pii_flag");

  const hasError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      {/* Classification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Classification <span className="text-red-500">*</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sensitivity Level */}
          <div className="space-y-2">
            <Label htmlFor="sensitivity">
              Sensitivity Level <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`sensitivity-${sensitivity || "none"}`}
              value={sensitivity || ""}
              onValueChange={(value) =>
                setValue("sensitivity", value as Sensitivity, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("sensitivity") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {SENSITIVITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("sensitivity") && (
              <p className="text-sm text-red-500">{getError("sensitivity")}</p>
            )}
          </div>

          {/* Contains Personal Data */}
          <div className="space-y-2">
            <Label htmlFor="pii_flag">
              Contains Personal Data <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`pii_flag-${piiFlag || "none"}`}
              value={piiFlag || ""}
              onValueChange={(value) =>
                setValue("pii_flag", value as PiiFlag, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("pii_flag") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {PII_FLAG_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("pii_flag") && (
              <p className="text-sm text-red-500">{getError("pii_flag")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
