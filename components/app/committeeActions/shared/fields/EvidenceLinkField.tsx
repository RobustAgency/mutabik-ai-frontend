"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const EvidenceLinkField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const hasError = !!errors.evidence_link;

  return (
    <div className="space-y-2">
      <Label htmlFor="evidence_link">Evidence Link</Label>
      <Input
        id="evidence_link"
        type="url"
        {...register("evidence_link")}
        placeholder="https://example.com/evidence"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.evidence_link?.message as string}
        </p>
      )}
    </div>
  );
};

