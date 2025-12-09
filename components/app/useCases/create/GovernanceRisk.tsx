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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "../types/useCaseTypes";
import { InfoTooltip, TOOLTIP_DEFINITIONS } from "@/components/custom/InfoTooltip";

interface GovernanceRiskProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}

const GovernanceRisk: React.FC<GovernanceRiskProps> = ({
  formData,
  setFormData,
  errors = {},
}) => {
  const [potentialHarmInput, setPotentialHarmInput] = useState(formData.potential_harm || "");

  useEffect(() => {
    setPotentialHarmInput(formData.potential_harm || "");
  }, [formData]);

  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 4: Governance & Risk
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1 - Risk Level + Regulatory Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preliminary Risk Level */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#344054] font-medium flex items-center">
              Preliminary Risk Level <span className="text-red-500">*</span>
              <InfoTooltip content={TOOLTIP_DEFINITIONS.PRELIMINARY_RISK_LEVEL} />
            </Label>
            <Select
              value={formData.preliminary_risk_level}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  preliminary_risk_level: value as FormDataType["preliminary_risk_level"],
                }))
              }
            >
              <SelectTrigger
                className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                  hasError("preliminary_risk_level") ? "border-red-500" : "border-[#D0D5DD]"
                } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
              >
                <SelectValue placeholder="Select Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {hasError("preliminary_risk_level") && (
              <p className="text-sm text-red-500">{getError("preliminary_risk_level")}</p>
            )}
          </div>

          {/* Regulatory Impact */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#344054] font-medium flex items-center">
              Regulatory Impact (Yes/No) <span className="text-red-500">*</span>
              <InfoTooltip content={TOOLTIP_DEFINITIONS.REGULATORY_IMPACT} />
            </Label>
            <div className="flex items-center gap-4 h-[44px] px-4 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF]">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.regulatory_impact}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      regulatory_impact: checked === true,
                    }))
                  }
                  className="data-[state=checked]:bg-[#039855] data-[state=checked]:border-0"
                />
                <Label className="text-sm text-[#344054]">
                  {formData.regulatory_impact ? "Yes" : "No"}
                </Label>
              </div>
            </div>
            {hasError("regulatory_impact") && (
              <p className="text-sm text-red-500">{getError("regulatory_impact")}</p>
            )}
          </div>
        </div>

        {/* Potential Harm / Impact Description */}
        <div className="flex flex-col gap-2 w-full">
          <Label>
            Potential Harm / Impact Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            required
            value={potentialHarmInput}
            onChange={(e) => setPotentialHarmInput(e.target.value)}
            onBlur={() =>
              setFormData((prev) => ({ ...prev, potential_harm: potentialHarmInput }))
            }
            placeholder="Describe potential risks, harms, or negative impacts (minimum 50 characters)..."
            className={`min-h-24 resize-none ${
              hasError("potential_harm") ? "border-red-500" : ""
            }`}
          />
          {hasError("potential_harm") && (
            <p className="text-sm text-red-500">{getError("potential_harm")}</p>
          )}
          <p className="text-xs text-gray-500">
            {potentialHarmInput.length} / 2000 characters (minimum 50)
          </p>
        </div>

        {/* Human Oversight Mode */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <Label className="text-sm text-[#344054] font-medium flex items-center">
            Human Oversight Mode <span className="text-red-500">*</span>
            <InfoTooltip content={TOOLTIP_DEFINITIONS.HUMAN_OVERSIGHT_MODE} />
          </Label>
          <Select
            value={formData.human_oversight_mode}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                human_oversight_mode: value as FormDataType["human_oversight_mode"],
              }))
            }
          >
            <SelectTrigger
              className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                hasError("human_oversight_mode") ? "border-red-500" : "border-[#D0D5DD]"
              } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select Human Oversight Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="human_in_the_loop">Human-in-the-Loop</SelectItem>
              <SelectItem value="human_on_the_loop">Human-on-the-Loop</SelectItem>
              <SelectItem value="human_in_command">Human-in-Command</SelectItem>
            </SelectContent>
          </Select>
          {hasError("human_oversight_mode") && (
            <p className="text-sm text-red-500">{getError("human_oversight_mode")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernanceRisk;
