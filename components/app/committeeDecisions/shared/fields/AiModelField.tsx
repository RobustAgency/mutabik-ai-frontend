"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const AiModelField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const { data: aiModels = [], isLoading: isLoadingModels } = useGetAiModelsQuery({ per_page: 100 });
  const watchedAiModelId = watch("ai_model_id");
  const hasError = !!errors.ai_model_id;

  // Prepare options for SelectWithInlineCreate
  const modelOptions = React.useMemo(() => {
    return aiModels.map((model) => ({
      id: model.id,
      label: model.name,
      value: model.id.toString(),
    }));
  }, [aiModels]);

  // Convert to string for SelectWithInlineCreate
  const modelIdString = watchedAiModelId !== undefined && watchedAiModelId !== null && watchedAiModelId !== 0
    ? String(watchedAiModelId)
    : "";

  return (
    <div className="space-y-2">
      <Label htmlFor="ai_model_id">AI Model</Label>
      <SelectWithInlineCreate
        key={`ai_model_id-select-${watchedAiModelId || "none"}`}
        value={modelIdString}
        onValueChange={(value) => {
          if (value === "" || value === "none") {
            setValue("ai_model_id", null, { shouldValidate: true });
          } else {
            const numValue = parseInt(value, 10);
            setValue("ai_model_id", numValue, { shouldValidate: true });
          }
        }}
        placeholder="Select AI model (optional)"
        options={modelOptions}
        isLoading={isLoadingModels}
        isEmpty={aiModels.length === 0}
        entityName="AI Model"
        modalForm={AiModelModalForm}
        canCreate={true}
        modalTitle="Create AI Model"
        modalDescription="Complete the form to create a new AI model"
        error={hasError}
        triggerClassName={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.ai_model_id?.message as string}
        </p>
      )}
    </div>
  );
};

