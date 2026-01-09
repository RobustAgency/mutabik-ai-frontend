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
import { useGetControlsQuery } from "@/app/lib/features/controlsApi";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const ControlField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const { data: controlsData, isLoading: isLoadingControls } = useGetControlsQuery({ per_page: 100 });
  const controls = controlsData?.data ?? [];
  const watchedControlId = watch("control_id");
  const hasError = !!errors.control_id;

  const handleChange = (value: string) => {
    if (value === "" || value === "none") {
      setValue("control_id", null, { shouldValidate: true });
    } else {
      const numValue = parseInt(value, 10);
      setValue("control_id", numValue, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="control_id">Control</Label>
      <Select
        key={`control_id-select-${watchedControlId || "none"}`}
        value={watchedControlId?.toString() || ""}
        onValueChange={handleChange}
        disabled={isLoadingControls}
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder={isLoadingControls ? "Loading..." : "Select control (optional)"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {controls.map((control) => (
            <SelectItem key={control.id} value={control.id.toString()}>
              {control.reference ? `${control.reference} - ${control.name}` : control.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.control_id?.message as string}
        </p>
      )}
    </div>
  );
};

