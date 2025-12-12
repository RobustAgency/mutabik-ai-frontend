"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDataType } from "../types/useCaseTypes";
import { InfoTooltip, TOOLTIP_DEFINITIONS } from "@/components/custom/InfoTooltip";

interface UseCaseClassificationProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}

const UseCaseClassification: React.FC<UseCaseClassificationProps> = ({
  formData,
  setFormData,
  errors = {},
}) => {
  // handleChange function for cleaner code
  const handleChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 3: Use Case Classification
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROI Classification */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054] flex items-center">
            ROI Classification
            <InfoTooltip content={TOOLTIP_DEFINITIONS.ROI_CLASSIFICATION} />
          </Label>
          <Select
            key={`roi_classification-${formData.roi_classification || "none"}`}
            value={formData.roi_classification}
            onValueChange={(value) => handleChange("roi_classification", value)}
          >
            <SelectTrigger
              className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                hasError("roi_classification") ? "border-red-500" : "border-[#D0D5DD]"
              } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select ROI Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          {hasError("roi_classification") && (
            <p className="text-sm text-red-500">{getError("roi_classification")}</p>
          )}
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
            Priority
          </Label>
          <Select
            key={`priority-${formData.priority || "none"}`}
            value={formData.priority}
            onValueChange={(value) => handleChange("priority", value)}
          >
            <SelectTrigger
              className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                hasError("priority") ? "border-red-500" : "border-[#D0D5DD]"
              } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          {hasError("priority") && (
            <p className="text-sm text-red-500">{getError("priority")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UseCaseClassification;
