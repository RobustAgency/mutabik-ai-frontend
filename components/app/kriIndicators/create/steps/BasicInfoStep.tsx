"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiRiskRegisterModalForm from "@/components/app/aiRiskRegister/create/AiRiskRegisterModalForm";
import { FormState } from "../types";
import { Directionality, KriStatus } from "@/interfaces/KriIndicator";
import { formatCategory } from "@/lib/helpers/ui";

interface BasicInfoStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
  aiRiskRegisters: any[];
  isAiRiskRegistersLoading: boolean;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formState,
  setFormState,
  validationErrors,
  aiRiskRegisters,
  isAiRiskRegistersLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Info
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
            placeholder={
              isAiRiskRegistersLoading ? "Loading..." : "Select AI Risk Register"
            }
            triggerClassName={`h-11 w-full px-4 rounded-lg border ${
              validationErrors.ai_risk_register_id
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
            error={!!validationErrors.ai_risk_register_id}
          />
          {validationErrors.ai_risk_register_id && (
            <p className="text-sm text-red-500">
              {validationErrors.ai_risk_register_id[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Model Accuracy Degradation"
            className={`h-11 w-full px-4 rounded-lg border ${
              validationErrors.name ? "border-red-500" : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500">{validationErrors.name[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="definition">
          Definition <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="definition"
          value={formState.definition}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, definition: e.target.value }))
          }
          rows={3}
          placeholder="Tracks percentage decrease in model accuracy compared to baseline"
          className={`min-h-24 resize-none ${
            validationErrors.definition ? "border-red-500" : ""
          }`}
        />
        {validationErrors.definition && (
          <p className="text-sm text-red-500">{validationErrors.definition[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="directionality">
            Directionality <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`directionality-${formState.directionality || "none"}`}
            value={formState.directionality}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                directionality: value as Directionality,
              }))
            }
          >
            <SelectTrigger className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select directionality" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Directionality).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            key={`unit-${formState.unit || "none"}`}
            value={formState.unit || undefined}
            onValueChange={(value) =>
              setFormState((prev) => ({ ...prev, unit: value || "" }))
            }
          >
            <SelectTrigger className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="%">%</SelectItem>
              <SelectItem value="ppm">ppm</SelectItem>
              <SelectItem value="count/day">count/day</SelectItem>
              <SelectItem value="score">score</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sample_window">
            Sample Window <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sample_window"
            value={formState.sample_window}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                sample_window: e.target.value,
              }))
            }
            placeholder="Monthly"
            className={`h-11 w-full px-4 rounded-lg border ${
              validationErrors.sample_window
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.sample_window && (
            <p className="text-sm text-red-500">
              {validationErrors.sample_window[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="owner_team">
            Owner Team <span className="text-red-500">*</span>
          </Label>
          <Input
            id="owner_team"
            value={formState.owner_team}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, owner_team: e.target.value }))
            }
            placeholder="Data Science"
            className={`h-11 w-full px-4 rounded-lg border ${
              validationErrors.owner_team
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.owner_team && (
            <p className="text-sm text-red-500">
              {validationErrors.owner_team[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`status-${formState.status || "none"}`}
            value={formState.status}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                status: value as KriStatus,
              }))
            }
          >
            <SelectTrigger className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(KriStatus).map((item) => (
                <SelectItem key={item} value={item}>
                  {formatCategory(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

