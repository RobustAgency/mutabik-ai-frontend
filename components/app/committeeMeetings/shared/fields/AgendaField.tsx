"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

export const AgendaField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const hasError = !!errors.agenda;

  return (
    <div className="space-y-2">
      <Label htmlFor="agenda">
        Agenda <span className="text-red-500">*</span>
      </Label>
      <Textarea
        id="agenda"
        {...register("agenda")}
        placeholder="Enter meeting agenda"
        rows={6}
        className="min-h-24 resize-none"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.agenda?.message as string}
        </p>
      )}
    </div>
  );
};

