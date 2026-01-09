"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const ClosedAtField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const watchedClosedAt = watch("closed_at");
  const hasError = !!errors.closed_at;

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("closed_at", value || null, {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="closed_at">Closed At</Label>
      <Input
        id="closed_at"
        type="date"
        value={formatDateForInput(watchedClosedAt)}
        onChange={handleChange}
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.closed_at?.message as string}
        </p>
      )}
    </div>
  );
};

