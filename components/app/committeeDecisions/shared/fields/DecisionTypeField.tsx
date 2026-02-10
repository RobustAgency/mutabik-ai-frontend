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
import { DecisionType } from "@/interfaces/CommitteeDecision";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

const decisionTypeOptions = [
  { value: DecisionType.APPROVE, label: "Approve" },
  { value: DecisionType.DENY, label: "Deny" },
  { value: DecisionType.WAIVE, label: "Waive" },
  { value: DecisionType.POLICY, label: "Policy" },
  { value: DecisionType.ESCALATE, label: "Escalate" },
];

export const DecisionTypeField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const watchedDecisionType = watch("decision_type");
  const hasError = !!errors.decision_type;

  return (
    <div className="space-y-2">
      <Label htmlFor="decision_type">
        Decision Type <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`decision-type-select-${watchedDecisionType}`}
        value={watchedDecisionType || ""}
        onValueChange={(value) =>
          setValue("decision_type", value as DecisionType, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select decision type" />
        </SelectTrigger>
        <SelectContent>
          {decisionTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.decision_type?.message as string}
        </p>
      )}
    </div>
  );
};

