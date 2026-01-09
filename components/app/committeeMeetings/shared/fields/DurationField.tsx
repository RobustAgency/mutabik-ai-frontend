"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

export const DurationField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const watchedDuration = watch("duration_minutes");
  const hasError = !!errors.duration_minutes;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      setValue("duration_minutes", null, { shouldValidate: true });
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        setValue("duration_minutes", numValue, { shouldValidate: true });
      } else {
        setValue("duration_minutes", null, { shouldValidate: true });
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="duration_minutes">Duration (minutes)</Label>
      <Input
        id="duration_minutes"
        type="number"
        min="1"
        value={watchedDuration ?? ""}
        onChange={handleChange}
        placeholder="Enter duration in minutes"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.duration_minutes?.message as string}
        </p>
      )}
    </div>
  );
};

