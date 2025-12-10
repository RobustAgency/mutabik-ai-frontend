"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiRiskRegisterModalForm from "@/components/app/aiRiskRegister/create/AiRiskRegisterModalForm";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";
import { FormState } from "../types";
import { TreatmentStatus, TreatmentType } from "@/interfaces/AiRiskTreatment";

interface PlanStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  aiRiskRegisters: any[];
  isAiRiskRegistersLoading: boolean;
  stakeholders: any[];
  isStakeholdersLoading: boolean;
}

export const PlanStep: React.FC<PlanStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  aiRiskRegisters,
  isAiRiskRegistersLoading,
  stakeholders,
  isStakeholdersLoading,
}) => {
  const formatLabel = (text: string) =>
    text
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Plan
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ai_risk_register_id">
            AI Risk Register <span className="text-red-500">*</span>
          </Label>
          <SelectWithInlineCreate
            key={`ai_risk_register_id-${formState.ai_risk_register_id || "none"}`}
            value={formState.ai_risk_register_id || undefined}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                ai_risk_register_id: value || "",
              }))
            }
            options={aiRiskRegisters.map((risk: any) => ({
              id: risk.id,
              label: risk.title || `Risk Register ${risk.id}`,
              value: String(risk.id),
            }))}
            isLoading={isAiRiskRegistersLoading}
            isEmpty={!isAiRiskRegistersLoading && aiRiskRegisters.length === 0}
            entityName="AI Risk Register"
            modalForm={AiRiskRegisterModalForm}
            canCreate
            placeholder={isAiRiskRegistersLoading ? "Loading..." : "Select AI Risk Register"}
            triggerClassName="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            error={!!validationErrors.ai_risk_register_id}
          />
          {validationErrors.ai_risk_register_id && (
            <p className="text-sm text-red-500">
              {validationErrors.ai_risk_register_id[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="treatment_type">
            Treatment Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.treatment_type}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                treatment_type: value as TreatmentType,
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select treatment type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TreatmentType).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan_summary">
          Plan Summary <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="plan_summary"
          value={formState.plan_summary}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, plan_summary: e.target.value }))
          }
          rows={3}
          placeholder="Implement fairness checks in model training"
          className={`min-h-24 resize-none ${
            validationErrors.plan_summary ? "border-red-500" : ""
          }`}
        />
        {validationErrors.plan_summary && (
          <p className="text-sm text-red-500">{validationErrors.plan_summary[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="owner_stakeholder_id">
            Owner Stakeholder <span className="text-red-500">*</span>
          </Label>
          <SelectWithInlineCreate
            key={`owner_stakeholder_id-${formState.owner_stakeholder_id || "none"}`}
            value={formState.owner_stakeholder_id || undefined}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                owner_stakeholder_id: value || "",
              }))
            }
            options={stakeholders.map((s: any) => ({
              id: s.id,
              label: s.display_name || s.email || `Stakeholder ${s.id}`,
              value: String(s.id),
            }))}
            isLoading={isStakeholdersLoading}
            isEmpty={!isStakeholdersLoading && stakeholders.length === 0}
            entityName="Stakeholder"
            modalForm={StakeholderModalForm as any}
            canCreate
            placeholder={isStakeholdersLoading ? "Loading..." : "Select stakeholder"}
            triggerClassName="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            error={!!validationErrors.owner_stakeholder_id}
          />
          {validationErrors.owner_stakeholder_id && (
            <p className="text-sm text-red-500">
              {validationErrors.owner_stakeholder_id[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="due_date"
            type="date"
            value={formState.due_date}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, due_date: e.target.value }))
            }
            className={`h-[44px] w-full px-4 rounded-lg border ${
              validationErrors.due_date ? "border-red-500" : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.due_date && (
            <p className="text-sm text-red-500">{validationErrors.due_date[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.status}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                status: value as TreatmentStatus,
              }))
            }
          >
            <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TreatmentStatus).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};


