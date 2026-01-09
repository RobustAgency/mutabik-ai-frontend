"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useGetUseCasesQuery } from "@/app/lib/features/useCasesApi";
import UseCaseModalForm from "@/components/app/useCases/create/UseCaseModalForm";
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

  // Prepare options for SelectWithInlineCreate
  const useCaseOptions = React.useMemo(() => {
    return useCases.map((useCase) => ({
      id: useCase.id,
      label: useCase.name,
      value: useCase.id.toString(),
    }));
  }, [useCases]);

  // Convert to string for SelectWithInlineCreate
  const useCaseIdString = watchedUseCaseId !== undefined && watchedUseCaseId !== null && watchedUseCaseId !== 0
    ? String(watchedUseCaseId)
    : "";

  return (
    <div className="space-y-2">
      <Label htmlFor="use_case_id">Use Case</Label>
      <SelectWithInlineCreate
        key={`use_case_id-select-${watchedUseCaseId || "none"}`}
        value={useCaseIdString}
        onValueChange={(value) => {
          if (value === "" || value === "none") {
            setValue("use_case_id", null, { shouldValidate: true });
          } else {
            const numValue = parseInt(value, 10);
            setValue("use_case_id", numValue, { shouldValidate: true });
          }
        }}
        placeholder="Select use case (optional)"
        options={useCaseOptions}
        isLoading={isLoadingUseCases}
        isEmpty={useCases.length === 0}
        entityName="Use Case"
        modalForm={UseCaseModalForm}
        canCreate={true}
        modalTitle="Create Use Case"
        modalDescription="Complete the form to create a new use case"
        error={hasError}
        triggerClassName={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.use_case_id?.message as string}
        </p>
      )}
    </div>
  );
};

