"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { FormState } from "../types";
import { RiskDecision, RiskLevel } from "@/interfaces/AiRiskRegister";
import { formatRiskDecision, formatRiskLevel } from "@/utils/riskUtils";
import RiskMethodologyModalForm from "@/components/app/riskMethodologies/RiskMethodologyModalForm";

interface RiskAssessmentStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  riskMethodologies: any[];
  isRiskMethodologiesLoading: boolean;
}

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  riskMethodologies,
  isRiskMethodologiesLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Risk Assessment
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk_methodology_id">
          Risk Methodology <span className="text-red-500">*</span>
        </Label>
        <SelectWithInlineCreate
          key={`risk_methodology_id-${formState.risk_methodology_id ?? "none"}`}
          value={formState.risk_methodology_id || undefined}
          onValueChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              risk_methodology_id: value || "",
            }))
          }
          options={riskMethodologies.map((item: any) => ({
            id: item.id,
            label: item.name,
            value: String(item.id),
          }))}
          isLoading={isRiskMethodologiesLoading}
          isEmpty={
            !isRiskMethodologiesLoading && riskMethodologies.length === 0
          }
          entityName="Risk Methodology"
          modalForm={RiskMethodologyModalForm}
          placeholder="Select Risk Methodology"
          error={!!validationErrors.risk_methodology_id}
        />
        {validationErrors.risk_methodology_id && (
          <p className="text-sm text-red-500">
            {validationErrors.risk_methodology_id[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="likelihood_code">
            Likelihood Code <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.likelihood_code}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                likelihood_code: value,
              }))
            }
          >
            <SelectTrigger
              className={`h-[44px] w-full px-4 rounded-lg border ${
                validationErrors.likelihood_code
                  ? "border-red-500"
                  : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select likelihood" />
            </SelectTrigger>
            <SelectContent>
              {["rare", "unlikely", "possible", "likely", "almost_certain"].map(
                (item) => (
                  <SelectItem key={item} value={item}>
                    {item.replace("_", " ").replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {validationErrors.likelihood_code && (
            <p className="text-sm text-red-500">
              {validationErrors.likelihood_code[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="impact_code">
            Impact Code <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.impact_code}
            onValueChange={(value) =>
              setFormState((prev) => ({ ...prev, impact_code: value }))
            }
          >
            <SelectTrigger
              className={`h-[44px] w-full px-4 rounded-lg border ${
                validationErrors.impact_code
                  ? "border-red-500"
                  : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select impact" />
            </SelectTrigger>
            <SelectContent>
              {["rare", "unlikely", "possible", "likely", "almost_certain"].map(
                (item) => (
                  <SelectItem key={item} value={item}>
                    {item.replace("_", " ").replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {validationErrors.impact_code && (
            <p className="text-sm text-red-500">{validationErrors.impact_code[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="inherent_score">Inherent Score</Label>
          <Input
            id="inherent_score"
            value={formState.inherent_score}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                inherent_score: e.target.value,
              }))
            }
            placeholder="7"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="residual_score">Residual Score</Label>
          <Input
            id="residual_score"
            value={formState.residual_score}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                residual_score: e.target.value,
              }))
            }
            placeholder="3"
            className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="risk_level">
            Risk Level <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.risk_level}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                risk_level: value as RiskLevel,
              }))
            }
          >
            <SelectTrigger
              className={`w-full ${
                validationErrors.risk_level ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RiskLevel).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatRiskLevel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.risk_level && (
            <p className="text-sm text-red-500">{validationErrors.risk_level[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="decision">
            Decision <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.decision}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                decision: value as RiskDecision,
              }))
            }
          >
            <SelectTrigger
              className={`w-full ${
                validationErrors.decision ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select decision" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RiskDecision).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatRiskDecision(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {validationErrors.decision && (
            <p className="text-sm text-red-500">{validationErrors.decision[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

