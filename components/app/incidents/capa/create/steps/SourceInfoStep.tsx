"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import DatasetModalForm from "@/components/app/datasets/create/DatasetModalForm";
import type { CorrectivePreventiveActionFormData } from "@/lib/schemas/correctivePreventiveAction.schema";
import { SourceType } from "@/app/lib/features/correctivePreventiveActionsApi";

const SOURCE_TYPE_OPTIONS = [
  { value: SourceType.INCIDENT, label: "Incident" },
  { value: SourceType.RCA, label: "RCA" },
  { value: SourceType.AUDIT_FINDING, label: "Audit Finding" },
  { value: SourceType.RISK_ASSESSMENT, label: "Risk Assessment" },
  { value: SourceType.CUSTOMER_COMPLAINT, label: "Customer Complaint" },
  { value: SourceType.REGULATORY_REQUIREMENT, label: "Regulatory Requirement" },
];

export const SourceInfoStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CorrectivePreventiveActionFormData>();

  const sourceType = watch("source_type");
  const sourceReference = watch("source_reference");
  const aiModelId = watch("ai_model_id");
  const datasetId = watch("dataset_id");

  const { data: aiModelsData, isLoading: isModelsLoading } = useGetAiModelsQuery();
  const { data: datasetsData, isLoading: isDatasetsLoading } = useGetDatasetsQuery({ per_page: 100 });

  const aiModels = aiModelsData || [];
  const datasets = datasetsData?.data || [];

  const hasError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  const getSourcePlaceholder = () => {
    switch (sourceType) {
      case SourceType.INCIDENT:
        return "Enter incident ID";
      case SourceType.RCA:
        return "Enter RCA ID";
      case SourceType.AUDIT_FINDING:
        return "Enter audit finding ID";
      case SourceType.RISK_ASSESSMENT:
        return "Enter risk assessment ID";
      case SourceType.CUSTOMER_COMPLAINT:
        return "Enter complaint ID";
      case SourceType.REGULATORY_REQUIREMENT:
        return "Enter regulatory requirement ID";
      default:
        return "Enter source reference";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Source Information <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Type */}
        <div className="space-y-2">
          <Label htmlFor="source_type">
            Source Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`source_type-${sourceType || "none"}`}
            value={sourceType || ""}
            onValueChange={(value) =>
              setValue("source_type", value as SourceType, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("source_type")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("source_type") && (
            <p className="text-sm text-red-500">{getError("source_type")}</p>
          )}
        </div>

        {/* Source Reference */}
        <div className="space-y-2">
          <Label htmlFor="source_reference">
            Source Reference <span className="text-red-500">*</span>
          </Label>
          <Input
            id="source_reference"
            value={sourceReference || ""}
            onChange={(e) =>
              setValue("source_reference", e.target.value, {
                shouldValidate: true,
              })
            }
            placeholder={getSourcePlaceholder()}
            className={hasError("source_reference") ? "border-red-500" : ""}
          />
          {hasError("source_reference") && (
            <p className="text-sm text-red-500">
              {getError("source_reference")}
            </p>
          )}
        </div>

        {/* AI Model */}
        <div className="space-y-2">
          <Label htmlFor="ai_model_id">AI Model</Label>
          <SelectWithInlineCreate
            key={`ai_model_id-${aiModelId || "none"}`}
            value={aiModelId ? String(aiModelId) : undefined}
            onValueChange={(value) =>
              setValue(
                "ai_model_id",
                value && value !== "__none__" ? Number(value) : null,
                { shouldValidate: true }
              )
            }
            placeholder={isModelsLoading ? "Loading models..." : "Select model (optional)"}
            options={aiModels.map((model: any) => ({
              id: model.id,
              label: model.name,
              value: String(model.id),
            }))}
            isLoading={isModelsLoading}
            isEmpty={!isModelsLoading && aiModels.length === 0}
            entityName="AI Model"
            canCreate={true}
            modalForm={AiModelModalForm}
            error={hasError("ai_model_id")}
          />
          {hasError("ai_model_id") && (
            <p className="text-sm text-red-500">{getError("ai_model_id")}</p>
          )}
        </div>

        {/* Dataset */}
        <div className="space-y-2">
          <Label htmlFor="dataset_id">Dataset</Label>
          <SelectWithInlineCreate
            key={`dataset_id-${datasetId || "none"}`}
            value={datasetId ? String(datasetId) : undefined}
            onValueChange={(value) =>
              setValue(
                "dataset_id",
                value && value !== "__none__" ? Number(value) : null,
                { shouldValidate: true }
              )
            }
            placeholder={isDatasetsLoading ? "Loading datasets..." : "Select dataset (optional)"}
            options={datasets.map((dataset: any) => ({
              id: dataset.id,
              label: dataset.name,
              value: String(dataset.id),
            }))}
            isLoading={isDatasetsLoading}
            isEmpty={!isDatasetsLoading && datasets.length === 0}
            entityName="Dataset"
            canCreate={true}
            modalForm={DatasetModalForm}
            error={hasError("dataset_id")}
          />
          {hasError("dataset_id") && (
            <p className="text-sm text-red-500">{getError("dataset_id")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

