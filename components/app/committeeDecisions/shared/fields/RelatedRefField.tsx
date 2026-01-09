"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const RelatedRefField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const hasError = !!errors.related_ref;

  return (
    <div className="space-y-2">
      <Label htmlFor="related_ref">Related Reference</Label>
      <Input
        id="related_ref"
        {...register("related_ref")}
        placeholder="Enter related reference"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.related_ref?.message as string}
        </p>
      )}
    </div>
  );
};

