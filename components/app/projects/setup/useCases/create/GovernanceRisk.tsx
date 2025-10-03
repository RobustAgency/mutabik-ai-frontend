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
  // ✅ Local state for smooth typing
  const [overallRiskScoreInput, setOverallRiskScoreInput] = useState(
    formData.overall_risk_score ?? ""
  );

  // Sync local state when formData resets
  useEffect(() => {
    setOverallRiskScoreInput(formData.overall_risk_score ?? "");
  }, [formData.overall_risk_score]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Governance & risk
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Overall Risk Score */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
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
            className="h-[44px] gap-2 opacity-100 px-4 py-[22px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] placeholder:text-[#98A2B3] font-sans font-normal text-sm leading-5 tracking-normal"
            placeholder="20,000"
          />
        </div>

        {/* Risk Level */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
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

        {/* Human Oversight */}
        <div className="flex flex-col gap-2">
          <Label className="font-sans font-medium text-sm leading-5 text-[#344054]">
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
              <SelectItem value="hitl">HITL</SelectItem>
              <SelectItem value="nohitl">No HITL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DPIA & AIA */}
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* DPIA */}
          <div className="flex flex-col gap-2">
            <Label className="text-[#344054]" id="dpia">
              DPIA
            </Label>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={formData.dpia || false}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    dpia: checked === true,
                  }))
                }
                className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
                id="dpia"
              />
              <Label htmlFor="dpia" className="text-sm text-[#344054]">
                Required?
              </Label>
            </div>
            <p className="text-xs text-[#475467]">AI impact Assessment</p>
          </div>

          {/* AIA */}
          <div className="flex flex-col gap-2">
            <Label className="text-[#344054]" id="aia">
              AIA
            </Label>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={formData.aia || false}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    aia: checked === true,
                  }))
                }
                className="data-[state=checked]:bg-[#465FFF] data-[state=checked]:border-0"
                id="aia"
              />
              <Label htmlFor="aia" className="text-sm text-[#344054]">
                Required?
              </Label>
            </div>
            <p className="text-xs text-[#475467]">
              Data Processing Impact Assessment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceRisk;
