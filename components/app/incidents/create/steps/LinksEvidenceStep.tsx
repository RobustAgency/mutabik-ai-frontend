"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AiIncidentFormData } from "@/lib/schemas/aiIncident.schema";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { useGetAiRiskRegistersQuery } from "@/app/lib/features/aiRiskRegisterApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import DatasetModalForm from "@/components/app/datasets/create/DatasetModalForm";
import AiRiskRegisterModalForm from "@/components/app/aiRiskRegister/create/AiRiskRegisterModalForm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const LinksEvidenceStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AiIncidentFormData>();

  const { data: modelsData, isLoading: isLoadingModels } = useGetAiModelsQuery();
  const models = modelsData || [];

  const { data: datasetsData, isLoading: isLoadingDatasets } = useGetDatasetsQuery({});
  const datasets = datasetsData?.data || [];

  const { data: risksData, isLoading: isLoadingRisks } = useGetAiRiskRegistersQuery({});
  const risks = risksData?.data || [];

  const hasError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName]?.message as string;

  const aiModelId = watch("ai_model_id");
  const linkedDatasetId = watch("linked_dataset_id");
  const linkedRiskId = watch("linked_risk_id");

  const selectedModel = models.find((m: any) => m.id === aiModelId);
  const selectedDataset = datasets.find((d: any) => d.id === linkedDatasetId);
  const selectedRisk = risks.find((r: any) => r.id === linkedRiskId);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Links & References
        </h3>
        <p className="text-sm text-[#667085]">
          Connect this incident to related assets for full traceability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai_model_id">Linked Model</Label>
              {selectedModel && (
                <Link
                  href={`/core-assets/ai-models/${selectedModel.id}`}
                  target="_blank"
                  className="text-xs text-[#039855] hover:underline flex items-center gap-1"
                >
                  View <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <SelectWithInlineCreate
              value={aiModelId ? String(aiModelId) : undefined}
              onValueChange={(value) => setValue("ai_model_id", value ? Number(value) : null)}
              options={models.map((model: any) => ({
                id: model.id,
                label: model.name,
                value: String(model.id),
              }))}
              isLoading={isLoadingModels}
              isEmpty={!isLoadingModels && models.length === 0}
              entityName="AI Model"
              modalForm={AiModelModalForm}
              placeholder="Select AI model"
            />
            <p className="text-xs text-[#667085]">From Model Registry</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="linked_dataset_id">Linked Dataset</Label>
              {selectedDataset && (
                <Link
                  href={`/core-assets/data/registry/${selectedDataset.id}`}
                  target="_blank"
                  className="text-xs text-[#039855] hover:underline flex items-center gap-1"
                >
                  View <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <SelectWithInlineCreate
              value={linkedDatasetId ? String(linkedDatasetId) : undefined}
              onValueChange={(value) => setValue("linked_dataset_id", value ? Number(value) : null)}
              options={datasets.map((dataset: any) => ({
                id: dataset.id,
                label: dataset.name,
                value: String(dataset.id),
              }))}
              isLoading={isLoadingDatasets}
              isEmpty={!isLoadingDatasets && datasets.length === 0}
              entityName="Dataset"
              modalForm={DatasetModalForm}
              placeholder="Select dataset"
            />
            <p className="text-xs text-[#667085]">From Dataset Registry</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="linked_risk_id">Linked Risk</Label>
              {selectedRisk && (
                <Link
                  href={`/risk-compliance/ai-risk-management/register/${selectedRisk.id}`}
                  target="_blank"
                  className="text-xs text-[#039855] hover:underline flex items-center gap-1"
                >
                  View <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <SelectWithInlineCreate
              value={linkedRiskId ? String(linkedRiskId) : undefined}
              onValueChange={(value) => setValue("linked_risk_id", value ? Number(value) : null)}
              options={risks.map((risk: any) => ({
                id: risk.id,
                label: risk.title,
                value: String(risk.id),
              }))}
              isLoading={isLoadingRisks}
              isEmpty={!isLoadingRisks && risks.length === 0}
              entityName="AI Risk"
              modalForm={AiRiskRegisterModalForm}
              placeholder="Select risk from register"
            />
            <p className="text-xs text-[#667085]">From Risk Register</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="evidence_link">Evidence Link</Label>
            <Input
              id="evidence_link"
              type="url"
              {...register("evidence_link")}
              placeholder="https://example.com/evidence"
            />
            <p className="text-xs text-[#667085]">Link to logs, tickets, or documentation</p>
            {getError("evidence_link") && (
              <p className="text-sm text-destructive">{getError("evidence_link")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

