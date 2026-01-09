"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const DueDateField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const watchedDueDate = watch("due_date");
  const hasError = !!errors.due_date;

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

  return (
    <div className="space-y-2">
      <Label htmlFor="due_date">
        Due Date <span className="text-red-500">*</span>
      </Label>
      <Input
        id="due_date"
        type="date"
        value={formatDateForInput(watchedDueDate)}
        onChange={(e) =>
          setValue("due_date", e.target.value, {
            shouldValidate: true,
          })
        }
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.due_date?.message as string}
        </p>
      )}
    </div>
  );
};

