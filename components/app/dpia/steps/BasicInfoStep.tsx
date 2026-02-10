"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DPIAFormData } from "@/lib/schemas/dpia.schema";
import SingleRopaSelector from "@/components/app/consentRecords/SingleRopaSelector";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";

const linkedAssetTypeOptions = [
  { value: "ai_model", label: "AI Model" },
  { value: "system", label: "System" },
  { value: "process", label: "Process" },
  { value: "technology", label: "Technology" },
];

export const BasicInfoStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DPIAFormData>();

  const {
    data: aiModels = [],
    isLoading: isLoadingAiModels,
  } = useGetAiModelsQuery({ per_page: 100 });

  const ropaId = watch("ropa_id");
  const linkedAiModelId = watch("linked_ai_model_id");

  const aiModelOptions = useMemo(
    () =>
      aiModels.map((model: any) => ({
        id: model.id,
        value: String(model.id),
        label: model.name,
      })),
    [aiModels]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="dpia_name">
          DPIA Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dpia_name"
          {...register("dpia_name")}
          className={`w-full ${errors.dpia_name ? "border-red-500" : ""}`}
          placeholder="e.g., AI Customer Analytics DPIA"
        />
        {errors.dpia_name && (
          <p className="text-sm text-red-500">{errors.dpia_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Linked Processing Activity (ROPA){" "}
            <span className="text-red-500">*</span>
          </Label>
          <SingleRopaSelector
            value={ropaId && ropaId > 0 ? ropaId : null}
            onChange={(id) => setValue("ropa_id", id || 0)}
            error={errors.ropa_id ? "Processing activity is required" : undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linked_asset_type">
            Linked Asset Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`linked_asset_type-${watch("linked_asset_type") || "none"}`}
            value={watch("linked_asset_type")}
            onValueChange={(value) =>
              setValue("linked_asset_type", value as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {linkedAssetTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linked_ai_model_id">Linked AI Model (optional)</Label>
          <SelectWithInlineCreate
            key={`linked_ai_model_id-${linkedAiModelId || "none"}`}
            value={linkedAiModelId ? String(linkedAiModelId) : ""}
            onValueChange={(value) =>
              setValue(
                "linked_ai_model_id",
                value ? (Number(value) as any) : (null as any)
              )
            }
            placeholder="Select AI model (optional)"
            disabled={isLoadingAiModels}
            options={aiModelOptions}
            isLoading={isLoadingAiModels}
            isEmpty={aiModelOptions.length === 0}
            entityName="AI Model"
            modalForm={AiModelModalForm}
            canCreate={true}
            modalTitle="Create New AI Model"
            modalDescription="Create a new AI model and link it to this DPIA."
            triggerClassName="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="automated_trigger">
            Automated Trigger <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="automated_trigger"
              checked={watch("automated_trigger")}
              onCheckedChange={(checked) =>
                setValue("automated_trigger", checked === true)
              }
            />
            <span className="text-sm text-[#667085]">
              This DPIA was auto-triggered by risk rules
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trigger_reason">
          Trigger Reason <span className="text-red-500">*</span>
        </Label>
        <Input
          id="trigger_reason"
          {...register("trigger_reason")}
          className={`w-full ${errors.trigger_reason ? "border-red-500" : ""}`}
          placeholder="e.g., High-risk processing detected"
        />
        {errors.trigger_reason && (
          <p className="text-sm text-red-500">
            {errors.trigger_reason.message}
          </p>
        )}
      </div>
    </div>
  );
};


