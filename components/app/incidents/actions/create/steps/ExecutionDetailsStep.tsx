"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StakeholderSelectorWithInline from "@/components/app/useCases/create/StakeholderSelectorWithInline";
import type { IncidentActionFormData } from "@/lib/schemas/incidentAction.schema";
import { ExecutionStatus } from "@/app/lib/features/incidentActionsApi";

const EXECUTION_STATUS_OPTIONS = [
  { value: ExecutionStatus.PLANNED, label: "Planned" },
  { value: ExecutionStatus.IN_PROGRESS, label: "In Progress" },
  { value: ExecutionStatus.COMPLETED, label: "Completed" },
  { value: ExecutionStatus.FAILED, label: "Failed" },
  { value: ExecutionStatus.ROLLED_BACK, label: "Rolled Back" },
];

export const ExecutionDetailsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentActionFormData>();

  const executionStatus = watch("execution_status");
  const performedBy = watch("performed_by");
  const individualName = watch("individual_name");
  const startedAt = watch("started_at");
  const completedAt = watch("completed_at");
  const estimatedDuration = watch("estimated_duration");
  const actualDuration = watch("actual_duration");

  const hasError = (fieldName: keyof IncidentActionFormData): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Execution Details <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Execution Status */}
        <div className="space-y-2">
          <Label htmlFor="execution_status">
            Execution Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`execution_status-${executionStatus || "none"}`}
            value={executionStatus || ""}
            onValueChange={(value) =>
              setValue("execution_status", value as ExecutionStatus, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("execution_status")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select execution status" />
            </SelectTrigger>
            <SelectContent>
              {EXECUTION_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("execution_status") && (
            <p className="text-sm text-red-500">
              {getError("execution_status")}
            </p>
          )}
        </div>

        {/* Performed By */}
        <div className="space-y-2">
          <StakeholderSelectorWithInline
            label="Performed By"
            value={performedBy && performedBy > 0 ? performedBy : null}
            onValueChange={(value) =>
              setValue("performed_by", value ? Number(value) : 0, {
                shouldValidate: true,
              })
            }
            placeholder="Select stakeholder"
            required={true}
            error={hasError("performed_by") ? getError("performed_by") : undefined}
            filterType="person"
          />
          {hasError("performed_by") && (
            <p className="text-sm text-red-500">{getError("performed_by")}</p>
          )}
        </div>

        {/* Individual Name */}
        <div className="space-y-2">
          <Label htmlFor="individual_name">Individual Name</Label>
          <Input
            id="individual_name"
            value={individualName || ""}
            onChange={(e) =>
              setValue("individual_name", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Name of individual if different from stakeholder"
            className={hasError("individual_name") ? "border-red-500" : ""}
          />
          {hasError("individual_name") && (
            <p className="text-sm text-red-500">
              {getError("individual_name")}
            </p>
          )}
        </div>

        {/* Started At */}
        <div className="space-y-2">
          <Label htmlFor="started_at">
            Started At <span className="text-red-500">*</span>
          </Label>
          <Input
            id="started_at"
            type="datetime-local"
            value={startedAt || ""}
            onChange={(e) =>
              setValue("started_at", e.target.value, { shouldValidate: true })
            }
            className={hasError("started_at") ? "border-red-500" : ""}
          />
          {hasError("started_at") && (
            <p className="text-sm text-red-500">{getError("started_at")}</p>
          )}
        </div>

        {/* Completed At */}
        <div className="space-y-2">
          <Label htmlFor="completed_at">Completed At</Label>
          <Input
            id="completed_at"
            type="datetime-local"
            value={completedAt || ""}
            onChange={(e) =>
              setValue("completed_at", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={hasError("completed_at") ? "border-red-500" : ""}
          />
          {hasError("completed_at") && (
            <p className="text-sm text-red-500">{getError("completed_at")}</p>
          )}
        </div>

        {/* Estimated Duration */}
        <div className="space-y-2">
          <Label htmlFor="estimated_duration">Estimated Duration</Label>
          <Input
            id="estimated_duration"
            value={estimatedDuration || ""}
            onChange={(e) =>
              setValue("estimated_duration", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="e.g., 2 hours, 1 day"
            className={hasError("estimated_duration") ? "border-red-500" : ""}
          />
          {hasError("estimated_duration") && (
            <p className="text-sm text-red-500">
              {getError("estimated_duration")}
            </p>
          )}
        </div>

        {/* Actual Duration */}
        <div className="space-y-2">
          <Label htmlFor="actual_duration">Actual Duration</Label>
          <Input
            id="actual_duration"
            value={actualDuration || ""}
            onChange={(e) =>
              setValue("actual_duration", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="e.g., 2.5 hours, 1.5 days"
            className={hasError("actual_duration") ? "border-red-500" : ""}
          />
          {hasError("actual_duration") && (
            <p className="text-sm text-red-500">
              {getError("actual_duration")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

