"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const ConditionsField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const hasError = !!errors.conditions;

  return (
    <div className="space-y-2">
      <Label htmlFor="conditions">Conditions</Label>
      <Textarea
        id="conditions"
        {...register("conditions")}
        placeholder="Enter conditions (optional)"
        rows={4}
        className="min-h-20 resize-none"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.conditions?.message as string}
        </p>
      )}
    </div>
  );
};

