"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const OwnerTeamField: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const hasError = !!errors.owner_team;

  return (
    <div className="space-y-2">
      <Label htmlFor="owner_team">
        Owner Team <span className="text-red-500">*</span>
      </Label>
      <Input
        id="owner_team"
        {...register("owner_team")}
        placeholder="Enter owner team"
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.owner_team?.message as string}
        </p>
      )}
    </div>
  );
};

