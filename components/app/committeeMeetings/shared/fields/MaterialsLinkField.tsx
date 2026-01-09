"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

export const MaterialsLinkField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const hasError = !!errors.materials_link;

  return (
    <div className="space-y-2">
      <Label htmlFor="materials_link">Materials Link</Label>
      <Input
        id="materials_link"
        type="url"
        {...register("materials_link")}
        placeholder="https://example.com/materials"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.materials_link?.message as string}
        </p>
      )}
    </div>
  );
};

