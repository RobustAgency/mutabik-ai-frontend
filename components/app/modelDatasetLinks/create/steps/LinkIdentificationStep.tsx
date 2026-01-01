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
import type { ModelDatasetLinkFormData } from "@/lib/schemas/modelDatasetLink.schema";
import { Role } from "@/app/lib/features/modelDatasetLinksApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetAiModelVersionsQuery } from "@/app/lib/features/aiModelVersionsApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { useGetDatasetSnapshotsQuery } from "@/app/lib/features/datasetSnapshotsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import AiModelVersionModalForm from "@/components/app/aiModel/versions/AiModelVersionModalForm";
import DatasetSnapshotModalForm from "@/components/app/datasetSnapshots/create/DatasetSnapshotModalForm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const ROLE_OPTIONS = [
  { value: Role.PRETRAIN, label: "Pretrain" },
  { value: Role.TRAIN, label: "Train" },
  { value: Role.FINE_TUNE, label: "Fine Tune" },
  { value: Role.ALIGN_RLHF, label: "Align RLHF" },
  { value: Role.VALIDATION, label: "Validation" },
  { value: Role.TEST, label: "Test" },
  { value: Role.EVAL_BENCHMARK, label: "Eval Benchmark" },
  { value: Role.RAG_CORPUS, label: "RAG Corpus" },
  { value: Role.DRIFT_BASELINE, label: "Drift Baseline" },
  { value: Role.ONLINE_FEEDBACK, label: "Online Feedback" },
];

export const LinkIdentificationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ModelDatasetLinkFormData>();

  const { data: modelsData, isLoading: isLoadingModels } = useGetAiModelsQuery();
  const models = modelsData || [];

  const aiModelId = watch("ai_model_id");
  const { data: modelVersionsData, isLoading: isLoadingVersions } = useGetAiModelVersionsQuery(
    aiModelId && aiModelId > 0 ? { ai_model_id: aiModelId } : undefined,
    { skip: !aiModelId || aiModelId === 0 }
  );
  const modelVersions = React.useMemo(() => modelVersionsData || [], [modelVersionsData]);

  const { data: datasetsData, isLoading: isLoadingDatasets } = useGetDatasetsQuery({});
  const datasets = datasetsData?.data || [];

  const datasetId = watch("dataset_id");
  const { data: snapshotsData, isLoading: isLoadingSnapshots } = useGetDatasetSnapshotsQuery({});
  const allSnapshots = React.useMemo(() => snapshotsData?.data || [], [snapshotsData]);
  const snapshots = React.useMemo(() => {
    if (!datasetId || datasetId === 0) return [];
    return allSnapshots.filter((s: any) => s.dataset_id === datasetId);
  }, [allSnapshots, datasetId]);

  const role = watch("role");
  const datasetSnapshotId = watch("dataset_snapshot_id");

  // Determine if snapshot is required based on role
  const isSnapshotRequired = React.useMemo(() => {
    const rolesRequiringSnapshot = [
      Role.TRAIN,
      Role.VALIDATION,
      Role.TEST,
      Role.EVAL_BENCHMARK,
    ];
    return rolesRequiringSnapshot.includes(role);
  }, [role]);

  const hasError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName]?.message as string;

  const selectedModel = models.find((m: any) => m.id === aiModelId);
  const selectedDataset = datasets.find((d: any) => d.id === datasetId);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Link Identification <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Model */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai_model_id">
                AI Model <span className="text-red-500">*</span>
              </Label>
              {selectedModel && (
                <Link
                  href={`/core-assets/ai-models/${selectedModel.id}/details`}
                  className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                  target="_blank"
                >
                  View
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <SelectWithInlineCreate
              key={`ai_model_id-${aiModelId || "none"}`}
              value={aiModelId ? String(aiModelId) : undefined}
              onValueChange={(value) => {
                if (value) {
                  setValue("ai_model_id", Number(value), { shouldValidate: true });
                  // Reset version when model changes
                  setValue("ai_model_version_id", 0 as any, { shouldValidate: true });
                }
              }}
              options={models.map((m: any) => ({
                id: String(m.id),
                label: m.name,
                value: String(m.id),
              }))}
              isLoading={isLoadingModels}
              isEmpty={!isLoadingModels && models.length === 0}
              entityName="AI Model"
              modalForm={AiModelModalForm}
              placeholder="Select..."
              error={!!hasError("ai_model_id")}
            />
            {hasError("ai_model_id") && (
              <p className="text-sm text-red-500">{getError("ai_model_id")}</p>
            )}
          </div>

          {/* AI Model Version */}
          <div className="space-y-2">
            <Label htmlFor="ai_model_version_id">
              AI Model Version <span className="text-red-500">*</span>
            </Label>
            <SelectWithInlineCreate
              key={`ai_model_version_id-${watch("ai_model_version_id") || "none"}`}
              value={watch("ai_model_version_id") ? String(watch("ai_model_version_id")) : undefined}
              onValueChange={(value) => {
                if (value) {
                  setValue("ai_model_version_id", Number(value), { shouldValidate: true });
                }
              }}
              options={modelVersions.map((v: any) => ({
                id: String(v.id),
                label: v.version_number || `Version ${v.id}`,
                value: String(v.id),
              }))}
              isLoading={isLoadingVersions}
              isEmpty={!isLoadingVersions && modelVersions.length === 0}
              entityName="Model Version"
              modalForm={AiModelVersionModalForm}
              placeholder={!aiModelId ? "Select model first" : "Select..."}
              error={!!hasError("ai_model_version_id")}
              disabled={!aiModelId}
            />
            {hasError("ai_model_version_id") && (
              <p className="text-sm text-red-500">{getError("ai_model_version_id")}</p>
            )}
          </div>

          {/* Dataset */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dataset_id">
                Dataset <span className="text-red-500">*</span>
              </Label>
              {selectedDataset && (
                <Link
                  href={`/core-assets/data/registry/${selectedDataset.id}/details`}
                  className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                  target="_blank"
                >
                  View
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <Select
              key={`dataset_id-${datasetId || "none"}`}
              value={datasetId ? String(datasetId) : undefined}
              onValueChange={(value) => {
                if (value) {
                  setValue("dataset_id", Number(value), { shouldValidate: true });
                  // Reset snapshot if it doesn't belong to newly selected dataset
                  // Don't trigger validation here - let user select snapshot first
                  const currentSnapshot = snapshots.find(
                    (s: any) => s.id === datasetSnapshotId
                  );
                  if (!currentSnapshot || currentSnapshot.dataset_id !== Number(value)) {
                    setValue("dataset_snapshot_id", null, { shouldValidate: false });
                  }
                }
              }}
            >
              <SelectTrigger
                className={`w-full ${hasError("dataset_id") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder={isLoadingDatasets ? "Loading..." : "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((d: any) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("dataset_id") && (
              <p className="text-sm text-red-500">{getError("dataset_id")}</p>
            )}
          </div>

          {/* Dataset Snapshot */}
          <div className="space-y-2">
            <Label htmlFor="dataset_snapshot_id">
              Dataset Snapshot {isSnapshotRequired ? <span className="text-red-500">*</span> : null}
            </Label>
            <SelectWithInlineCreate
              key={`dataset_snapshot_id-${datasetSnapshotId || "none"}`}
              value={datasetSnapshotId ? String(datasetSnapshotId) : undefined}
              onValueChange={(value) => {
                if (value) {
                  setValue("dataset_snapshot_id", Number(value), { shouldValidate: true });
                } else {
                  setValue("dataset_snapshot_id", null, { shouldValidate: true });
                }
              }}
              options={snapshots.map((s: any) => ({
                id: String(s.id),
                label: `${s.version_tag}${s.dataset?.name ? ` (${s.dataset.name})` : ""}`,
                value: String(s.id),
              }))}
              isLoading={isLoadingSnapshots}
              isEmpty={!isLoadingSnapshots && snapshots.length === 0}
              entityName="Dataset Snapshot"
              modalForm={DatasetSnapshotModalForm}
              placeholder={!datasetId ? "Select dataset first" : "Select..."}
              error={!!hasError("dataset_snapshot_id")}
              disabled={!datasetId}
            />
            {isSnapshotRequired && (
              <p className="text-xs text-[#667085]">
                Required for train, validation, test, and eval_benchmark roles
              </p>
            )}
            {hasError("dataset_snapshot_id") && (
              <p className="text-sm text-red-500">{getError("dataset_snapshot_id")}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`role-${role || "none"}`}
              value={role || ""}
              onValueChange={(value) => {
                setValue("role", value as Role, { shouldValidate: true });
              }}
            >
              <SelectTrigger
                className={`w-full ${hasError("role") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("role") && (
              <p className="text-sm text-red-500">{getError("role")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

