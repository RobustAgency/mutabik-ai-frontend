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

// CDE Categories - these are string values, not enums
const CDE_CATEGORY_OPTIONS = [
  { value: "Strategic", label: "Strategic" },
  { value: "Operational", label: "Operational" },
  { value: "Compliance", label: "Compliance & Regulatory" },
  { value: "External Reporting", label: "External Reporting" },
  { value: "Financial", label: "Financial" },
  { value: "Risk", label: "Risk Management" },
  { value: "Customer Experience", label: "Customer Experience" },
];

export const CdeReferencesStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataElementFormData>();

  const cdeFlag = watch("cde_flag");
  const cdeCategories = watch("cde_categories") || [];

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
              CDE Flag
            </Label>
            <Select
              key={`cde_flag-${cdeFlag === null ? "none" : cdeFlag}`}
              value={cdeFlag === null ? "" : String(cdeFlag)}
              onValueChange={(value) => {
                const boolValue = value === "true" ? true : value === "false" ? false : null;
                setValue("cde_flag", boolValue, {
                  shouldValidate: true,
                });
              }}
            >
              <SelectTrigger
                className={`w-full ${hasError("cde_flag") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes - Critical Data Element</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            {hasError("cde_flag") && (
              <p className="text-sm text-red-500">{getError("cde_flag")}</p>
            )}
          </div>

          {/* CDE Categories - Always visible and required */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cde_categories">
              CDE Categories <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
              {CDE_CATEGORY_OPTIONS.map((option) => {
                const isSelected = cdeCategories.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const newCategories = isSelected
                        ? cdeCategories.filter((cat) => cat !== option.value)
                        : [...cdeCategories, option.value];
                      setValue("cde_categories", newCategories, {
                        shouldValidate: true,
                      });
                    }}
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
            {hasError("cde_categories") && (
              <p className="text-sm text-red-500">
                {getError("cde_categories")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
