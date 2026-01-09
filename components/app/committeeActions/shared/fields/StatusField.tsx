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
import { Status } from "@/interfaces/CommitteeAction";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

const statusOptions = [
  { value: Status.NEW, label: "New" },
  { value: Status.IN_PROGRESS, label: "In Progress" },
  { value: Status.BLOCKED, label: "Blocked" },
  { value: Status.COMPLETED, label: "Completed" },
  { value: Status.CANCELLED, label: "Cancelled" },
];

export const StatusField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const watchedStatus = watch("status");
  const hasError = !!errors.status;

  return (
    <div className="space-y-2">
      <Label htmlFor="status">
        Status <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`status-select-${watchedStatus}`}
        value={watchedStatus || ""}
        onValueChange={(value) =>
          setValue("status", value as Status, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.status?.message as string}
        </p>
      )}
    </div>
  );
};

