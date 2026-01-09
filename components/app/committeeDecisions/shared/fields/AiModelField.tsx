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
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
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

  const handleChange = (value: string) => {
    if (value === "" || value === "none") {
      setValue("ai_model_id", null, { shouldValidate: true });
    } else {
      const numValue = parseInt(value, 10);
      setValue("ai_model_id", numValue, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="ai_model_id">AI Model</Label>
      <Select
        key={`ai_model_id-select-${watchedAiModelId || "none"}`}
        value={watchedAiModelId?.toString() || ""}
        onValueChange={handleChange}
        disabled={isLoadingModels}
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder={isLoadingModels ? "Loading..." : "Select AI model (optional)"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {aiModels.map((model) => (
            <SelectItem key={model.id} value={model.id.toString()}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.ai_model_id?.message as string}
        </p>
      )}
    </div>
  );
};

