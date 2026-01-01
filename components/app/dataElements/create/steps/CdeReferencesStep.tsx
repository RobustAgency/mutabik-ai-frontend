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
  CdeFlag,
  CdeCategory,
} from "@/app/lib/features/dataElementsApi";

const CDE_CATEGORY_OPTIONS = [
  { value: CdeCategory.STRATEGIC, label: "Strategic" },
  { value: CdeCategory.OPERATIONAL, label: "Operational" },
  { value: CdeCategory.COMPLIANCE, label: "Compliance & Regulatory" },
  { value: CdeCategory.EXTERNAL_REPORTING, label: "External Reporting" },
  { value: CdeCategory.FINANCIAL, label: "Financial" },
  { value: CdeCategory.RISK, label: "Risk Management" },
  { value: CdeCategory.CUSTOMER_EXPERIENCE, label: "Customer Experience" },
];

export const CdeReferencesStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const cdeFlag = watch("cde_flag");
  const cdeCategory = watch("cde_category");

  const hasError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataElementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      {/* Critical Data Element (CDE) */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Critical Data Element (CDE)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CDE Flag */}
          <div className="space-y-2">
            <Label htmlFor="cde_flag">
              CDE Flag <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`cde_flag-${cdeFlag || "none"}`}
              value={cdeFlag || ""}
              onValueChange={(value) =>
                setValue("cde_flag", value as CdeFlag, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("cde_flag") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CdeFlag.YES}>Yes - Critical Data Element</SelectItem>
                <SelectItem value={CdeFlag.NO}>No</SelectItem>
              </SelectContent>
            </Select>
            {hasError("cde_flag") && (
              <p className="text-sm text-red-500">{getError("cde_flag")}</p>
            )}
          </div>

          {/* CDE Category - Only shown when CDE flag is Yes */}
          {cdeFlag === CdeFlag.YES && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cde_category">
                CDE Categories <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
                {CDE_CATEGORY_OPTIONS.map((option) => {
                  const isSelected = cdeCategory === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setValue(
                          "cde_category",
                          isSelected ? null : (option.value as CdeCategory),
                          { shouldValidate: true }
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-green-100 text-green-700 border-2 border-green-500"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {hasError("cde_category") && (
                <p className="text-sm text-red-500">
                  {getError("cde_category")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
