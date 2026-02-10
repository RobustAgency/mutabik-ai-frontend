"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const RationaleField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const hasError = !!errors.rationale;

  return (
    <div className="space-y-2">
      <Label htmlFor="rationale">
        Rationale <span className="text-red-500">*</span>
      </Label>
      <Textarea
        id="rationale"
        {...register("rationale")}
        placeholder="Enter decision rationale"
        rows={6}
        className="min-h-24 resize-none"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.rationale?.message as string}
        </p>
      )}
    </div>
  );
};

