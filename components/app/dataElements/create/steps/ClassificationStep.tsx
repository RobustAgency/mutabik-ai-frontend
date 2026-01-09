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
  PersonalDataCategory,
  DefaultMaskingMethod,
} from "@/app/lib/features/dataElementsApi";

const SENSITIVITY_OPTIONS = [
  { value: Sensitivity.PUBLIC, label: "Public" },
  { value: Sensitivity.INTERNAL, label: "Internal" },
  { value: Sensitivity.CONFIDENTIAL, label: "Confidential" },
  { value: Sensitivity.RESTRICTED, label: "Restricted" },
];

const PERSONAL_DATA_CATEGORY_OPTIONS = [
  { value: PersonalDataCategory.DIRECT_IDENTIFIER, label: "Direct Identifier" },
  { value: PersonalDataCategory.CONTACT_INFORMATION, label: "Contact Information" },
  { value: PersonalDataCategory.FINANCIAL_DATA, label: "Financial Data" },
  { value: PersonalDataCategory.DEMOGRAPHIC, label: "Demographic" },
  { value: PersonalDataCategory.BEHAVIORAL, label: "Behavioral" },
  { value: PersonalDataCategory.LOCATION, label: "Location" },
  { value: PersonalDataCategory.BIOMETRIC, label: "Biometric" },
  { value: PersonalDataCategory.HEALTH, label: "Health" },
  { value: PersonalDataCategory.GENETIC, label: "Genetic" },
  { value: PersonalDataCategory.POLITICAL, label: "Political" },
  { value: PersonalDataCategory.RELIGIOUS, label: "Religious" },
  { value: PersonalDataCategory.RACIAL, label: "Racial" },
  { value: PersonalDataCategory.SEXUAL, label: "Sexual" },
  { value: PersonalDataCategory.CRIMINAL, label: "Criminal" },
  { value: PersonalDataCategory.CHILDREN, label: "Children" },
];

const MASKING_METHOD_OPTIONS = [
  { value: DefaultMaskingMethod.NONE, label: "None" },
  { value: DefaultMaskingMethod.TOKENIZATION, label: "Tokenization" },
  { value: DefaultMaskingMethod.HASHING, label: "Hashing" },
  { value: DefaultMaskingMethod.ENCRYPTION, label: "Encryption" },
  { value: DefaultMaskingMethod.REDACTION, label: "Redaction" },
  { value: DefaultMaskingMethod.GENERALIZATION, label: "Generalization" },
  { value: DefaultMaskingMethod.K_ANONYMITY, label: "K-Anonymity" },
  { value: DefaultMaskingMethod.DIFFERENTIAL_PRIVACY, label: "Differential Privacy" },
  { value: DefaultMaskingMethod.PSEUDONYMIZATION, label: "Pseudonymization" },
];

export const ClassificationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const sensitivity = watch("sensitivity");
  const containsPersonalData = watch("contains_personal_data");
  const personalDataType = watch("personal_data_type");
  const containsSensitiveData = watch("contains_sensitive_data");
  const defaultMaskingMethod = watch("default_masking_method");

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
            <Label htmlFor="contains_personal_data">
              Contains Personal Data <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`contains_personal_data-${containsPersonalData}`}
              value={containsPersonalData === null || containsPersonalData === undefined ? "" : String(containsPersonalData)}
              onValueChange={(value) => {
                const numericValue = Number(value) as 0 | 1;
                setValue("contains_personal_data", numericValue, {
                  shouldValidate: true,
                });
                // Reset dependent fields if 0 (false)
                if (numericValue === 0) {
                  setValue("personal_data_type", null);
                  setValue("contains_sensitive_data", null);
                } else {
                  // When set to 1 (true), set default value for contains_sensitive_data if not already set
                  if (containsSensitiveData === null || containsSensitiveData === undefined) {
                    setValue("contains_sensitive_data", 0 as 0 | 1, {
                      shouldValidate: true,
                    });
                  }
                }
              }}
            >
              <SelectTrigger
                className={`w-full ${hasError("contains_personal_data") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
            {hasError("contains_personal_data") && (
              <p className="text-sm text-red-500">{getError("contains_personal_data")}</p>
            )}
          </div>

          {/* Personal Data Type - Only shown when contains_personal_data is 1 */}
          {containsPersonalData === 1 && (
            <div className="space-y-2">
              <Label htmlFor="personal_data_type">
                Personal Data Type <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`personal_data_type-${personalDataType || "none"}`}
                value={personalDataType || ""}
                onValueChange={(value) =>
                  setValue("personal_data_type", value as PersonalDataCategory, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className={`w-full ${hasError("personal_data_type") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {PERSONAL_DATA_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError("personal_data_type") && (
                <p className="text-sm text-red-500">{getError("personal_data_type")}</p>
              )}
            </div>
          )}

          {/* Contains Sensitive Data - Only shown when contains_personal_data is true */}
          {containsPersonalData === 1 && (
            <div className="space-y-2">
              <Label htmlFor="contains_sensitive_data">
                Contains Sensitive Data <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`contains_sensitive_data-${containsSensitiveData === null || containsSensitiveData === undefined ? "none" : containsSensitiveData}`}
                value={containsSensitiveData === null || containsSensitiveData === undefined ? "" : String(containsSensitiveData)}
                onValueChange={(value) => {
                  // Must be a number (0 or 1), not null
                  const numericValue = Number(value) as 0 | 1;
                  setValue("contains_sensitive_data", numericValue, {
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger
                  className={`w-full ${hasError("contains_sensitive_data") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Yes</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
              {hasError("contains_sensitive_data") && (
                <p className="text-sm text-red-500">{getError("contains_sensitive_data")}</p>
              )}
            </div>
          )}

          {/* Default Masking Method */}
          <div className="space-y-2">
            <Label htmlFor="default_masking_method">Default Masking Method</Label>
            <Select
              key={`default_masking_method-${defaultMaskingMethod || "none"}`}
              value={defaultMaskingMethod || ""}
              onValueChange={(value) =>
                setValue("default_masking_method", value as DefaultMaskingMethod, {
                  shouldValidate: false,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {MASKING_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
