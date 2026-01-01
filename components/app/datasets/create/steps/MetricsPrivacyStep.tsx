"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DatasetFormData } from "@/lib/schemas/dataset.schema";
import {
  SizeUnit,
  PrimaryLanguage,
  ContainPersonalData,
  Sensitivity,
} from "@/app/lib/features/datasetsApi";

const SIZE_UNIT_OPTIONS = [
  { value: SizeUnit.BYTES, label: "Bytes" },
  { value: SizeUnit.KILOBYTES, label: "KB" },
  { value: SizeUnit.MEGABYTES, label: "MB" },
  { value: SizeUnit.GIGABYTES, label: "GB" },
  { value: SizeUnit.TERABYTES, label: "TB" },
];

const PRIMARY_LANGUAGE_OPTIONS = [
  { value: PrimaryLanguage.ENGLISH, label: "English" },
  { value: PrimaryLanguage.SPANISH, label: "Spanish" },
  { value: PrimaryLanguage.FRENCH, label: "French" },
  { value: PrimaryLanguage.GERMAN, label: "German" },
  { value: PrimaryLanguage.CHINESE_MANDARIN, label: "Chinese (Mandarin)" },
  { value: PrimaryLanguage.JAPANESE, label: "Japanese" },
  { value: PrimaryLanguage.KOREAN, label: "Korean" },
  { value: PrimaryLanguage.ARABIC, label: "Arabic" },
  { value: PrimaryLanguage.PORTUGUESE, label: "Portuguese" },
  { value: PrimaryLanguage.HINDI, label: "Hindi" },
  { value: PrimaryLanguage.RUSSIAN, label: "Russian" },
  { value: PrimaryLanguage.ITALIAN, label: "Italian" },
  { value: PrimaryLanguage.DUTCH, label: "Dutch" },
  { value: PrimaryLanguage.MULTI_LANGUAGE, label: "Multi-language" },
  { value: PrimaryLanguage.CODE_NUMERIC_ONLY, label: "Code / Numeric Only" },
  { value: PrimaryLanguage.OTHER, label: "Other" },
];

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

export const MetricsPrivacyStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetFormData>();

  const estimatedRowCount = watch("estimated_row_count");
  const estimatedSize = watch("estimated_size");
  const sizeUnit = watch("size_unit");
  const retentionPeriod = watch("retention_period");
  const primaryLanguages = watch("primary_languages") || [];
  const containsPersonalData = watch("contains_personal_data");
  const sensitivity = watch("sensitivity");

  const hasError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetFormData) =>
    errors[fieldName]?.message as string;

  const handleToggleLanguage = (language: PrimaryLanguage) => {
    if (primaryLanguages.includes(language)) {
      setValue(
        "primary_languages",
        primaryLanguages.filter((l) => l !== language),
        { shouldValidate: true }
      );
    } else {
      setValue("primary_languages", [...primaryLanguages, language], { shouldValidate: true });
    }
  };

  const getLanguageLabel = (value: PrimaryLanguage): string => {
    const found = PRIMARY_LANGUAGE_OPTIONS.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Dataset Metrics Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
            Dataset Metrics
          </h2>
          <hr className="border-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Row Count */}
          <div className="space-y-2">
            <Label htmlFor="estimated_row_count">Estimated Row Count</Label>
            <Input
              id="estimated_row_count"
              type="number"
              min="0"
              value={estimatedRowCount || ""}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : null;
                setValue("estimated_row_count", value, { shouldValidate: true });
              }}
              className={hasError("estimated_row_count") ? "border-red-500" : ""}
              placeholder="e.g., 1500000"
            />
            <p className="text-xs text-gray-500">Approximate number of records</p>
            {hasError("estimated_row_count") && (
              <p className="text-sm text-red-500">{getError("estimated_row_count")}</p>
            )}
          </div>

          {/* Estimated Size with Unit */}
          <div className="space-y-2">
            <Label htmlFor="estimated_size">Estimated Size</Label>
            <div className="flex gap-2">
              <Input
                id="estimated_size"
                type="number"
                min="0"
                step="0.01"
                value={estimatedSize || ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : null;
                  setValue("estimated_size", value, { shouldValidate: true });
                }}
                className={hasError("estimated_size") ? "border-red-500" : ""}
                placeholder="e.g., 4.5"
              />
              <Select
                key={`size-unit-${sizeUnit || "none"}`}
                value={sizeUnit || ""}
                onValueChange={(value) => setValue("size_unit", value as SizeUnit, { shouldValidate: true })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_UNIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasError("estimated_size") && (
              <p className="text-sm text-red-500">{getError("estimated_size")}</p>
            )}
            {hasError("size_unit") && (
              <p className="text-sm text-red-500">{getError("size_unit")}</p>
            )}
          </div>

          {/* Retention Period */}
          <div className="space-y-2">
            <Label htmlFor="retention_period">Retention Period</Label>
            <Select 
              key={`retention-period-${retentionPeriod || "none"}`}
              value={retentionPeriod || ""}
              onValueChange={(value) => setValue("retention_period", value || null, { shouldValidate: true })}
            >
              <SelectTrigger className={`w-full ${hasError("retention_period") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 year">1 year</SelectItem>
                <SelectItem value="2 years">2 years</SelectItem>
                <SelectItem value="3 years">3 years</SelectItem>
                <SelectItem value="5 years">5 years</SelectItem>
                <SelectItem value="7 years">7 years</SelectItem>
                <SelectItem value="10 years">10 years</SelectItem>
                <SelectItem value="Indefinite">Indefinite</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">How long data will be retained</p>
            {hasError("retention_period") && (
              <p className="text-sm text-red-500">{getError("retention_period")}</p>
            )}
          </div>

          {/* Primary Language(s) */}
          <div className="space-y-2">
            <Label htmlFor="primary_languages">Primary Language(s)</Label>
            <div className="flex flex-wrap gap-2 p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB] max-h-48 overflow-y-auto">
              {PRIMARY_LANGUAGE_OPTIONS.map((option) => {
                const isSelected = primaryLanguages.includes(option.value);
                return (
                  <Badge
                    key={option.value}
                    variant={isSelected ? "filled" : "outlined"}
                    className={`cursor-pointer px-3 py-1 ${
                      isSelected
                        ? "bg-[#ECFDF3] text-[#047857] border-[#047857] hover:bg-[#D1FADF]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleToggleLanguage(option.value)}
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">Languages present in the data</p>
            {hasError("primary_languages") && (
              <p className="text-sm text-red-500">{getError("primary_languages")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Posture Section */}
      <div className="space-y-4">
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
    </div>
  );
};

