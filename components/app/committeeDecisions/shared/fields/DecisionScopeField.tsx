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
import { DecisionScope } from "@/interfaces/CommitteeDecision";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

const decisionScopeOptions = [
  { value: DecisionScope.MODEL, label: "Model" },
  { value: DecisionScope.USE_CASE, label: "Use Case" },
  { value: DecisionScope.CONTROL, label: "Control" },
  { value: DecisionScope.POLICY, label: "Policy" },
  { value: DecisionScope.VENDOR, label: "Vendor" },
  { value: DecisionScope.RELEASE, label: "Release" },
  { value: DecisionScope.ASSESSMENT, label: "Assessment" },
  { value: DecisionScope.OTHER, label: "Other" },
];

export const DecisionScopeField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const watchedDecisionScope = watch("decision_scope");
  const hasError = !!errors.decision_scope;

  return (
    <div className="space-y-2">
      <Label htmlFor="decision_scope">
        Decision Scope <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`decision-scope-select-${watchedDecisionScope}`}
        value={watchedDecisionScope || ""}
        onValueChange={(value) =>
          setValue("decision_scope", value as DecisionScope, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select decision scope" />
        </SelectTrigger>
        <SelectContent>
          {decisionScopeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.decision_scope?.message as string}
        </p>
      )}
    </div>
  );
};

