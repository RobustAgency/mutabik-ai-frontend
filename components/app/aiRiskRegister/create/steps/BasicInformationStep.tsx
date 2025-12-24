"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import type { AiRiskRegisterFormData } from "@/lib/schemas/aiRiskRegister.schema";
import { RiskCategory, RiskStatus } from "@/interfaces/AiRiskRegister";
import { formatRiskCategory, formatRiskStatus } from "@/utils/riskUtils";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import AiModelVersionModalForm from "@/components/app/aiModel/versions/AiModelVersionModalForm";
import UseCaseModalForm from "@/components/app/useCases/create/UseCaseModalForm";

interface BasicInformationStepProps {
  aiModels: any[];
  isModelsLoading: boolean;
  filteredVersions: any[];
  isVersionsLoading: boolean;
  useCases: any[];
  isUseCasesLoading: boolean;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  aiModels,
  isModelsLoading,
  filteredVersions,
  isVersionsLoading,
  useCases,
  isUseCasesLoading,
}) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AiRiskRegisterFormData>();

  const descriptionInput = watch("descriptionInput") || "";
  const aiModelId = watch("ai_model_id") || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Model Bias Risk"
          className={`h-11 w-full px-4 rounded-lg border ${
            errors.title ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Controller
          name="descriptionInput"
          control={control}
          render={({ field }) => (
            <>
              <Textarea
                {...field}
                id="description"
                rows={4}
                placeholder="Describe the risk in detail (required)..."
                className={`min-h-24 resize-none ${
                  errors.description ? "border-red-500" : ""
                }`}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  setValue("description", value, { shouldValidate: true });
                }}
              />
              <p className="text-xs text-gray-500">{field.value?.length || 0} characters</p>
            </>
          )}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="risk_category">Risk Category <span className="text-red-500">*</span></Label>
          <Controller
            name="risk_category"
            control={control}
            render={({ field }) => (
              <Select
              key={`risk-category-${field.value || "none"}`}
              value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${
                    errors.risk_category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select risk category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RiskCategory).map((item) => (
                    <SelectItem key={item} value={item}>
                      {formatRiskCategory(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.risk_category && (
            <p className="text-sm text-red-500">{errors.risk_category.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select 
              key={`status-${field.value || "none"}`}
              value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${
                    errors.status ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RiskStatus).map((item) => (
                    <SelectItem key={item} value={item}>
                      {formatRiskStatus(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ai_model_id">AI Model <span className="text-red-500">*</span></Label>
          <Controller
            name="ai_model_id"
            control={control}
            render={({ field }) => (
              <SelectWithInlineCreate
                key={`ai_model_id-${field.value || "none"}`}
                value={field.value || undefined}
                onValueChange={(value) => {
                  const newValue = value || "";
                  field.onChange(newValue);
                  // Reset version when model changes
                  if (newValue !== aiModelId) {
                    setValue("ai_model_version_id", "");
                  }
                }}
                options={aiModels.map((model: any) => ({
                  id: model.id,
                  label: model.name,
                  value: String(model.id),
                }))}
                isLoading={isModelsLoading}
                isEmpty={!isModelsLoading && aiModels.length === 0}
                entityName="AI Model"
                modalForm={AiModelModalForm}
                placeholder="Select AI Model"
                error={!!errors.ai_model_id}
              />
            )}
          />
          {errors.ai_model_id && (
            <p className="text-sm text-red-500">{errors.ai_model_id.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ai_model_version_id">AI Model Version</Label>
          <Controller
            name="ai_model_version_id"
            control={control}
            render={({ field }) => (
              <SelectWithInlineCreate
                key={`ai_model_version_id-${field.value || "none"}`}
                value={field.value || undefined}
                onValueChange={(value) => field.onChange(value || "")}
                options={filteredVersions.map((version: any) => ({
                  id: version.id,
                  label:
                    version.version_number ||
                    version.version ||
                    `Version ${version.id}`,
                  value: String(version.id),
                }))}
                isLoading={isVersionsLoading}
                isEmpty={
                  !isVersionsLoading &&
                  !!aiModelId &&
                  filteredVersions.length === 0
                }
                entityName="Model Version"
                modalForm={AiModelVersionModalForm}
                placeholder={
                  !aiModelId
                    ? "Select AI model first"
                    : "Select model version (optional)"
                }
                disabled={!aiModelId}
                error={!!errors.ai_model_version_id}
              />
            )}
          />
          {errors.ai_model_version_id && (
            <p className="text-sm text-red-500">
              {errors.ai_model_version_id.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="use_case_id">Use Case</Label>
          <Controller
            name="use_case_id"
            control={control}
            render={({ field }) => (
              <SelectWithInlineCreate
                key={`use_case_id-${field.value || "none"}`}
                value={field.value || undefined}
                onValueChange={(value) => field.onChange(value || "")}
                options={useCases.map((useCase: any) => ({
                  id: useCase.id,
                  label:
                    useCase.name ||
                    useCase.use_case_title ||
                    useCase.title ||
                    `Use Case ${useCase.id}`,
                  value: String(useCase.id),
                }))}
                isLoading={isUseCasesLoading}
                isEmpty={!isUseCasesLoading && useCases.length === 0}
                entityName="Use Case"
                modalForm={UseCaseModalForm}
                placeholder="Select use case (optional)"
                error={!!errors.use_case_id}
              />
            )}
          />
          {errors.use_case_id && (
            <p className="text-sm text-red-500">{errors.use_case_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="related_controls">Related Controls (comma separated)</Label>
        <Input
          id="related_controls"
          {...register("related_controls")}
          placeholder="control_1, control_2"
        />
      </div>
    </div>
  );
};

