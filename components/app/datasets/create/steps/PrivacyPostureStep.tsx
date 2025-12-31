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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DatasetFormData } from "@/lib/schemas/dataset.schema";
import {
  ContainPersonalData,
  Sensitivity,
} from "@/app/lib/features/datasetsApi";

const CONTAINS_PERSONAL_DATA_OPTIONS = [
  { value: ContainPersonalData.YES, label: "Yes" },
  { value: ContainPersonalData.NO, label: "No" },
  { value: ContainPersonalData.UNKNOWN, label: "Unknown" },
];

const SENSITIVITY_OPTIONS = [
  { value: Sensitivity.PUBLIC, label: "Public" },
  { value: Sensitivity.INTERNAL, label: "Internal" },
  { value: Sensitivity.CONFIDENTIAL, label: "Confidential" },
  { value: Sensitivity.RESTRICTED, label: "Restricted" },
];

export const PrivacyPostureStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetFormData>();

  const containsPersonalData = watch("contains_personal_data");
  const sensitivity = watch("sensitivity");

  const hasError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
            Privacy Posture <span className="text-red-500">*</span>
          </h2>
          <Badge className="bg-red-100 text-red-800">Critical</Badge>
        </div>
        <hr className="border-gray-200" />
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Privacy classification determines compliance requirements. Complete all required fields accurately.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contains Personal Data */}
        <div className="space-y-2">
          <Label htmlFor="contains_personal_data">
            Contains Personal Data <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`contains_personal_data-${containsPersonalData || "none"}`}
            value={containsPersonalData || ""}
            onValueChange={(value) => setValue("contains_personal_data", value as ContainPersonalData, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("contains_personal_data") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {CONTAINS_PERSONAL_DATA_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("contains_personal_data") && (
            <p className="text-sm text-red-500">{getError("contains_personal_data")}</p>
          )}
        </div>

        {/* Sensitivity Level */}
        <div className="space-y-2">
          <Label htmlFor="sensitivity">
            Sensitivity Level <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`sensitivity-${sensitivity || "none"}`}
            value={sensitivity || ""}
            onValueChange={(value) => setValue("sensitivity", value as Sensitivity, { shouldValidate: true })}
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
      </div>
    </div>
  );
};

