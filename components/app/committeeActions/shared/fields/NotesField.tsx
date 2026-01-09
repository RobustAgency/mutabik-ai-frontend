"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const NotesField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const hasError = !!errors.notes;

  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        {...register("notes")}
        placeholder="Enter additional notes"
        rows={4}
        className="min-h-20 resize-none"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.notes?.message as string}
        </p>
      )}
    </div>
  );
};

