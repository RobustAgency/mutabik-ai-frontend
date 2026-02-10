"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

export const MinutesLinkField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const hasError = !!errors.minutes_link;

  return (
    <div className="space-y-2">
      <Label htmlFor="minutes_link">Minutes Link</Label>
      <Input
        id="minutes_link"
        type="url"
        {...register("minutes_link")}
        placeholder="https://example.com/minutes"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.minutes_link?.message as string}
        </p>
      )}
    </div>
  );
};

