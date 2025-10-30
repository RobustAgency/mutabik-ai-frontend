"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateModelDatasetLinkData } from "@/app/lib/features/modelDatasetLinksApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { useGetDatasetSnapshotsQuery } from "@/app/lib/features/datasetSnapshotsApi";

interface ModelDatasetLinkFormProps {
  formData: CreateModelDatasetLinkData;
  setFormData: React.Dispatch<React.SetStateAction<CreateModelDatasetLinkData>>;
  errors: Record<string, string[]>;
}

const ModelDatasetLinkForm: React.FC<ModelDatasetLinkFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateModelDatasetLinkData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { data: models = [], isLoading: isLoadingModels, isError: isModelsError } = useGetAiModelsQuery();
  const { data: datasets = [], isLoading: isLoadingDatasets, isError: isDatasetsError } = useGetDatasetsQuery();
  const { data: snapshots = [], isLoading: isLoadingSnapshots, isError: isSnapshotsError } = useGetDatasetSnapshotsQuery();

  const filteredSnapshots = React.useMemo(() => {
    if (!formData.dataset_id) return snapshots;
    return snapshots.filter((s: any) => String(s.dataset_id) === String(formData.dataset_id));
  }, [snapshots, formData.dataset_id]);

  return (
    <div className="space-y-6 pt-6">
      {/* Link Identification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Link Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai_model_id">Model *</Label>
            <Select
              value={formData.ai_model_id || undefined}
              onValueChange={(value) => handleChange("ai_model_id", value)}
              disabled={isLoadingModels || isModelsError}
            >
              <SelectTrigger id="ai_model_id" className={`w-full ${errors.ai_model_id ? "border-red-500" : ""}`}>
                <SelectValue
                  placeholder={
                    isLoadingModels
                      ? "Loading models..."
                      : isModelsError
                        ? "Failed to load models"
                        : "Select a model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((m: any) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ai_model_id && <p className="text-sm text-red-500">{errors.ai_model_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai_model_version_id">Model Version ID *</Label>
            <Input
              type="number"
              id="ai_model_version_id"
              value={formData.ai_model_version_id}
              onChange={(e) => handleChange("ai_model_version_id", e.target.value)}
              placeholder="1"
              className={errors.ai_model_version_id ? "border-red-500" : ""}
            />
            {errors.ai_model_version_id && <p className="text-sm text-red-500">{errors.ai_model_version_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset_snapshot_id">Snapshot * (Required for AC-05)</Label>
            <Select
              value={formData.dataset_snapshot_id || undefined}
              onValueChange={(value) => handleChange("dataset_snapshot_id", value)}
              disabled={isLoadingSnapshots || isSnapshotsError}
            >
              <SelectTrigger id="dataset_snapshot_id" className={`w-full ${errors.dataset_snapshot_id ? "border-red-500" : ""}`}>
                <SelectValue
                  placeholder={
                    isLoadingSnapshots
                      ? "Loading snapshots..."
                      : isSnapshotsError
                        ? "Failed to load snapshots"
                        : filteredSnapshots.length === 0 && formData.dataset_id
                          ? "No snapshots for selected dataset"
                          : "Select a snapshot"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredSnapshots.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.version_tag} {s.dataset_id ? ` (ds ${s.dataset_id})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dataset_snapshot_id && <p className="text-sm text-red-500">{errors.dataset_snapshot_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset (optional)</Label>
            <Select
              value={formData.dataset_id || undefined}
              onValueChange={(value) => {
                // Reset snapshot if it doesn't belong to newly selected dataset
                const willFilterTo = value;
                const currentSnapshotStillValid = snapshots.some((s: any) => String(s.id) === String(formData.dataset_snapshot_id) && (!willFilterTo || String(s.dataset_id) === String(willFilterTo)));
                setFormData((prev) => ({
                  ...prev,
                  dataset_id: value,
                  dataset_snapshot_id: currentSnapshotStillValid ? prev.dataset_snapshot_id : "",
                }));
              }}
              disabled={isLoadingDatasets || isDatasetsError}
            >
              <SelectTrigger id="dataset_id" className={`w-full ${errors.dataset_id ? "border-red-500" : ""}`}>
                <SelectValue
                  placeholder={
                    isLoadingDatasets
                      ? "Loading datasets..."
                      : isDatasetsError
                        ? "Failed to load datasets"
                        : "Select a dataset (optional)"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((d: any) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Role & Usage */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Role & Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
              <SelectTrigger className={`w-full ${errors.role ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pretrain">pretrain</SelectItem>
                <SelectItem value="train">train</SelectItem>
                <SelectItem value="fine_tune">fine_tune</SelectItem>
                <SelectItem value="align_rlhf">align_rlhf</SelectItem>
                <SelectItem value="validation">validation</SelectItem>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="eval_benchmark">eval_benchmark</SelectItem>
                <SelectItem value="rag_corpus">rag_corpus</SelectItem>
                <SelectItem value="drift_baseline">drift_baseline</SelectItem>
                <SelectItem value="online_feedback">online_feedback</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="created_by">Created By *</Label>
            <Input
              id="created_by"
              value={formData.created_by}
              onChange={(e) => handleChange("created_by", e.target.value)}
              placeholder="e.g., user_id or system"
              className={errors.created_by ? "border-red-500" : ""}
            />
            {errors.created_by && <p className="text-sm text-red-500">{errors.created_by[0]}</p>}
          </div>
        </div>
      </div>

      {/* Compliance & Checks */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Compliance & Checks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eligibility_status">Eligibility Status</Label>
            <Select value={formData.eligibility_status || ""} onValueChange={(value) => handleChange("eligibility_status", value)}>
              <SelectTrigger className={`w-full ${errors.eligibility_status ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eligible">eligible</SelectItem>
                <SelectItem value="eligible_with_conditions">eligible_with_conditions</SelectItem>
                <SelectItem value="not_eligible">not_eligible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="access_path">Access Path</Label>
            <Input
              id="access_path"
              value={formData.access_path || ""}
              onChange={(e) => handleChange("access_path", e.target.value)}
              placeholder="e.g., /mnt/data/train"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transform_pack_link">Transform Pack Link</Label>
            <Input
              id="transform_pack_link"
              value={formData.transform_pack_link || ""}
              onChange={(e) => handleChange("transform_pack_link", e.target.value)}
              placeholder="Link to transform package"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="license_check_ref">License Check Reference</Label>
            <Input
              id="license_check_ref"
              value={formData.license_check_ref || ""}
              onChange={(e) => handleChange("license_check_ref", e.target.value)}
              placeholder="License validation reference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy_check_ref">Privacy Check Reference</Label>
            <Input
              id="privacy_check_ref"
              value={formData.privacy_check_ref || ""}
              onChange={(e) => handleChange("privacy_check_ref", e.target.value)}
              placeholder="Privacy validation reference"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Additional notes about this link"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelDatasetLinkForm;

