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
import { Checkbox } from "@/components/ui/checkbox";
import { FormDataType } from "../types/useCaseTypes";


interface GovernanceRiskProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const GovernanceRisk: React.FC<GovernanceRiskProps> = ({
  formData,
  setFormData,
}) => {
  // No local state needed for the new boolean assessment fields
  // They can be directly updated in formData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Governance & risk
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Responsive Grid */}
      <div
        className="
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-6
        "
      >
        {/* Risk Level */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-[#344054] font-medium">
            Risk Level
          </Label>
          <Select
            value={formData.risk_level}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                risk_level: value as "low" | "medium" | "high" | "critical",
              }))
            }
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="Medium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROI Assessment */}
        <div className="flex flex-col">
          <Label className="text-sm text-[#344054] font-medium">ROI Assessment</Label>
          <div className="flex items-center mt-2 gap-2">
            <Checkbox
              checked={formData.roi_assessment}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  roi_assessment: checked === true,
                }))
              }
              className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
            />
            <Label className="text-sm text-[#344054]">Completed?</Label>
          </div>
          <p className="text-xs text-[#475467] mt-1">
            Return on Investment assessment status
          </p>
        </div>

        {/* Risk Assessment */}
        <div className="flex flex-col">
          <Label className="text-sm text-[#344054] font-medium">Risk Assessment</Label>
          <div className="flex items-center mt-2 gap-2">
            <Checkbox
              checked={formData.risk_assessment}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  risk_assessment: checked === true,
                }))
              }
              className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
            />
            <Label className="text-sm text-[#344054]">Completed?</Label>
          </div>
          <p className="text-xs text-[#475467] mt-1">
            Risk assessment status
          </p>
        </div>

        {/* Data Assessment */}
        <div className="flex flex-col">
          <Label className="text-sm text-[#344054] font-medium">Data Assessment</Label>
          <div className="flex items-center mt-2 gap-2">
            <Checkbox
              checked={formData.data_assessment}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  data_assessment: checked === true,
                }))
              }
              className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
            />
            <Label className="text-sm text-[#344054]">Completed?</Label>
          </div>
          <p className="text-xs text-[#475467] mt-1">
            Data assessment status
          </p>
        </div>
      </div>
    </div>
  );
};

export default GovernanceRisk;
