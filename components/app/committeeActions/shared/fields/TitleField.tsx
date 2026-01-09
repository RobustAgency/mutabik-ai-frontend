"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const TitleField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const hasError = !!errors.title;

  return (
    <div className="space-y-2">
      <Label htmlFor="title">
        Title <span className="text-red-500">*</span>
      </Label>
      <Input
        id="title"
        {...register("title")}
        placeholder="Enter action title"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.title?.message as string}
        </p>
      )}
    </div>
  );
};

