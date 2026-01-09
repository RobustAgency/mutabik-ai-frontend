"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUseCasesQuery } from "@/app/lib/features/useCasesApi";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const UseCaseField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const { data: useCases = [], isLoading: isLoadingUseCases } = useGetUseCasesQuery();
  const watchedUseCaseId = watch("use_case_id");
  const hasError = !!errors.use_case_id;

  const handleChange = (value: string) => {
    if (value === "" || value === "none") {
      setValue("use_case_id", null, { shouldValidate: true });
    } else {
      const numValue = parseInt(value, 10);
      setValue("use_case_id", numValue, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="use_case_id">Use Case</Label>
      <Select
        key={`use_case_id-select-${watchedUseCaseId || "none"}`}
        value={watchedUseCaseId?.toString() || ""}
        onValueChange={handleChange}
        disabled={isLoadingUseCases}
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder={isLoadingUseCases ? "Loading..." : "Select use case (optional)"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {useCases.map((useCase) => (
            <SelectItem key={useCase.id} value={useCase.id.toString()}>
              {useCase.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.use_case_id?.message as string}
        </p>
      )}
    </div>
  );
};

