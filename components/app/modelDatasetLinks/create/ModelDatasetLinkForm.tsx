"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateModelDatasetLinkData } from "@/app/lib/features/modelDatasetLinksApi";

interface ModelDatasetLinkFormProps {
  formData: CreateModelDatasetLinkData;
  setFormData: React.Dispatch<React.SetStateAction<CreateModelDatasetLinkData>>;
  errors: Record<string, string[]>;
}

const ModelDatasetLinkForm: React.FC<ModelDatasetLinkFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateModelDatasetLinkData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Link Identification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Link Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model_id">Model ID *</Label>
            <Input
              id="model_id"
              value={formData.model_id}
              onChange={(e) => handleChange("model_id", e.target.value)}
              placeholder="e.g., model_12345"
              className={errors.model_id ? "border-red-500" : ""}
            />
            {errors.model_id && <p className="text-sm text-red-500">{errors.model_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model_version_id">Model Version ID *</Label>
            <Input
              id="model_version_id"
              value={formData.model_version_id}
              onChange={(e) => handleChange("model_version_id", e.target.value)}
              placeholder="e.g., v1.0.0"
              className={errors.model_version_id ? "border-red-500" : ""}
            />
            {errors.model_version_id && <p className="text-sm text-red-500">{errors.model_version_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="snapshot_id">Snapshot ID * (Required for AC-05)</Label>
            <Input
              id="snapshot_id"
              value={formData.snapshot_id}
              onChange={(e) => handleChange("snapshot_id", e.target.value)}
              placeholder="e.g., snap_12345"
              className={errors.snapshot_id ? "border-red-500" : ""}
            />
            {errors.snapshot_id && <p className="text-sm text-red-500">{errors.snapshot_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset ID (optional)</Label>
            <Input
              id="dataset_id"
              value={formData.dataset_id || ""}
              onChange={(e) => handleChange("dataset_id", e.target.value)}
              placeholder="e.g., ds_12345"
            />
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
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
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
              <SelectTrigger>
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

