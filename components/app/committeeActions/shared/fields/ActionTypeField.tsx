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
import { ActionType } from "@/interfaces/CommitteeAction";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

const actionTypeOptions = [
  { value: ActionType.IMPLEMENT_CHANGE, label: "Implement Change" },
  { value: ActionType.COLLECT_EVIDENCE, label: "Collect Evidence" },
  { value: ActionType.UPDATE_POLICY, label: "Update Policy" },
  { value: ActionType.CONDUCT_ASSESSMENT, label: "Conduct Assessment" },
  { value: ActionType.NOTIFY_REGULATOR, label: "Notify Regulator" },
  { value: ActionType.OTHER, label: "Other" },
];

export const ActionTypeField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const watchedActionType = watch("action_type");
  const hasError = !!errors.action_type;

  return (
    <div className="space-y-2">
      <Label htmlFor="action_type">
        Action Type <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`action-type-select-${watchedActionType}`}
        value={watchedActionType || ""}
        onValueChange={(value) =>
          setValue("action_type", value as ActionType, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select action type" />
        </SelectTrigger>
        <SelectContent>
          {actionTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.action_type?.message as string}
        </p>
      )}
    </div>
  );
};

