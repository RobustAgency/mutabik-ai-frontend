"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const ExpiryDateField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const watchedExpiryDate = watch("expiry_date");
  const hasError = !!errors.expiry_date;

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
    setValue("expiry_date", value || null, {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="expiry_date">Expiry Date</Label>
      <Input
        id="expiry_date"
        type="date"
        value={formatDateForInput(watchedExpiryDate)}
        onChange={handleChange}
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.expiry_date?.message as string}
        </p>
      )}
    </div>
  );
};

