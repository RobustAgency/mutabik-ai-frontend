"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "../types/useCaseTypes";
import { InfoTooltip, TOOLTIP_DEFINITIONS } from "@/components/custom/InfoTooltip";

interface DataAssesmentProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}

const DataAssesment: React.FC<DataAssesmentProps> = ({ formData, setFormData, errors = {} }) => {
  const [dependenciesInput, setDependenciesInput] = useState(formData.dependencies || "");

  useEffect(() => {
    setDependenciesInput(formData.dependencies || "");
  }, [formData]);

  const handleChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855] ">
          Step 5: Data Assessment
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1 - Data Sensitivity + Data Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Sensitivity */}
          <div className="flex flex-col gap-2">
            <Label className="font-sans font-medium text-sm leading-5 text-[#344054] flex items-center">
              Data Sensitivity <span className="text-red-500">*</span>
              <InfoTooltip content={TOOLTIP_DEFINITIONS.DATA_SENSITIVITY} />
            </Label>
            <Select
              key={`data_sensitivity-${formData.data_sensitivity || "none"}`}
              value={formData.data_sensitivity}
              onValueChange={(value) => handleChange("data_sensitivity", value)}
            >
              <SelectTrigger
                className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                  hasError("data_sensitivity") ? "border-red-500" : "border-[#D0D5DD]"
                } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
              >
                <SelectValue placeholder="Select Data Sensitivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="personal_data">Personal Data (PII)</SelectItem>
                <SelectItem value="sensitive_data">Sensitive Data (Health / Financial / Biometrics)</SelectItem>
                <SelectItem value="highly_sensitive_data">Highly Sensitive / Restricted</SelectItem>
              </SelectContent>
            </Select>
            {hasError("data_sensitivity") && (
              <p className="text-sm text-red-500">{getError("data_sensitivity")}</p>
            )}
          </div>

          {/* Data Availability Status */}
          <div className="flex flex-col gap-2">
            <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
              Data Availability <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`data_availability_status-${formData.data_availability_status || "none"}`}
              value={formData.data_availability_status}
              onValueChange={(value) => handleChange("data_availability_status", value)}
            >
              <SelectTrigger
                className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                  hasError("data_availability_status") ? "border-red-500" : "border-[#D0D5DD]"
                } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
              >
                <SelectValue placeholder="Select Availability Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Fully Available</SelectItem>
                <SelectItem value="partially_available">Partially Available</SelectItem>
                <SelectItem value="not_available">Not Available</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            {hasError("data_availability_status") && (
              <p className="text-sm text-red-500">{getError("data_availability_status")}</p>
            )}
          </div>
        </div>

        {/* Data Readiness */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054] flex items-center">
            Data Readiness
            <InfoTooltip content={TOOLTIP_DEFINITIONS.DATA_READINESS} />
          </Label>
          <Select
            key={`data_readiness-${formData.data_readiness || "none"}`}
            value={formData.data_readiness}
            onValueChange={(value) => handleChange("data_readiness", value)}
          >
            <SelectTrigger
              className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                hasError("data_readiness") ? "border-red-500" : "border-[#D0D5DD]"
              } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select Data Readiness Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ready_for_use">Ready for Use</SelectItem>
              <SelectItem value="requires_cleaning">Requires Cleaning</SelectItem>
              <SelectItem value="requires_integration">Requires Integration</SelectItem>
              <SelectItem value="requires_collection">Requires Collection</SelectItem>
              <SelectItem value="not_ready">Not Ready</SelectItem>
            </SelectContent>
          </Select>
          {hasError("data_readiness") && (
            <p className="text-sm text-red-500">{getError("data_readiness")}</p>
          )}
        </div>

        {/* Dependencies (Non-Technical) */}
        <div className="flex flex-col gap-2 w-full">
          <Label>
            Dependencies (Non-Technical) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            required
            value={dependenciesInput}
            onChange={(e) => setDependenciesInput(e.target.value)}
            onBlur={() => setFormData((prev) => ({ ...prev, dependencies: dependenciesInput }))}
            placeholder="Describe any non-technical dependencies, constraints, or requirements (up to 2000 characters)..."
            className={`min-h-24 resize-none ${hasError("dependencies") ? "border-red-500" : ""}`}
          />
          {hasError("dependencies") && (
            <p className="text-sm text-red-500">{getError("dependencies")}</p>
          )}
          <p className="text-xs text-gray-500">{dependenciesInput.length} / 2000 characters</p>
        </div>
      </div>
    </div>
  );
};

export default DataAssesment;