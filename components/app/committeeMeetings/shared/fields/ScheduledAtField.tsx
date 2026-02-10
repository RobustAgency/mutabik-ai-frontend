"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

export const ScheduledAtField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const watchedScheduledAt = watch("scheduled_at");
  const hasError = !!errors.scheduled_at;

  return (
    <div className="space-y-2">
      <Label htmlFor="scheduled_at">
        Scheduled At <span className="text-red-500">*</span>
      </Label>
      <Input
        id="scheduled_at"
        type="datetime-local"
        value={watchedScheduledAt || ""}
        onChange={(e) =>
          setValue("scheduled_at", e.target.value, {
            shouldValidate: true,
          })
        }
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.scheduled_at?.message as string}
        </p>
      )}
    </div>
  );
};

