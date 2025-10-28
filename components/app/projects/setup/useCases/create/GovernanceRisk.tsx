"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDataType } from "./CreateUseCases";

interface GovernanceRiskProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const GovernanceRisk: React.FC<GovernanceRiskProps> = ({
  formData,
  setFormData,
}) => {
  const [overallRiskScoreInput, setOverallRiskScoreInput] = useState(
    formData.overall_risk_score ?? ""
  );

  useEffect(() => {
    setOverallRiskScoreInput(formData.overall_risk_score ?? "");
  }, [formData.overall_risk_score]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-[#039855] text-sm">
          Governance & risk
        </h2>
      </div>

      {/* Responsive Grid */}
      <div
        className="
          grid 
          grid-cols-1
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-5 
          gap-6
        "
      >
        {/* Overall Risk Score */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-[#344054] font-medium">
            Overall risk score
          </Label>
          <Input
            type="number"
            value={overallRiskScoreInput}
            onChange={(e) => setOverallRiskScoreInput(Number(e.target.value))}
            onBlur={() =>
              setFormData((prev) => ({
                ...prev,
                overall_risk_score: Number(overallRiskScoreInput),
              }))
            }
            placeholder="20,000"
            className="h-[44px] rounded-md border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus-visible:ring-0 focus-visible:border-[#D0D5DD]"
          />
        </div>

        {/* Risk Level */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-[#344054] font-medium">
            Risk level
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

        {/* Human Oversight Mode */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-[#344054] font-medium">
            Human oversight mode
          </Label>
          <Select
            value={formData.human_oversight_mode}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                human_oversight_mode: value,
              }))
            }
          >
            <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer">
              <SelectValue placeholder="HITL" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HITL">HITL</SelectItem>
              <SelectItem value="NO_HITL">No HITL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DPIA */}
        <div className="flex flex-col">
          <Label className="text-sm text-[#344054] font-medium">DPIA</Label>
          <div className="flex items-center mt-2 gap-2">
            <Checkbox
              checked={formData.dpia || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  dpia: checked === true,
                }))
              }
              className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
            />
            <Label className="text-sm text-[#344054]">Required?</Label>
          </div>
          <p className="text-xs text-[#475467] mt-1">
            Data Processing Impact Assessment
          </p>
        </div>

        {/* AIA */}
        <div className="flex flex-col">
          <Label className="text-sm text-[#344054] font-medium">AIA</Label>
          <div className="flex items-center mt-2 gap-2">
            <Checkbox
              checked={formData.aia || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  aia: checked === true,
                }))
              }
              className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
            />
            <Label className="text-sm text-[#344054]">Required?</Label>
          </div>
          <p className="text-xs text-[#475467] mt-1">AI impact Assessment</p>
        </div>
      </div>
    </div>
  );
};

export default GovernanceRisk;
