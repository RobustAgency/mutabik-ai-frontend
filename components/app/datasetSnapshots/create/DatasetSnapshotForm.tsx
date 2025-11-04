"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateDatasetSnapshotData } from "@/app/lib/features/datasetSnapshotsApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DatasetModalForm from "@/components/app/datasets/create/DatasetModalForm";

interface DatasetSnapshotFormProps {
  formData: CreateDatasetSnapshotData;
  setFormData: React.Dispatch<React.SetStateAction<CreateDatasetSnapshotData>>;
  errors: Record<string, string[]>;
}

const DatasetSnapshotForm: React.FC<DatasetSnapshotFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateDatasetSnapshotData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { data: datasetsData, isLoading: isLoadingDatasets, isError: isDatasetsError } = useGetDatasetsQuery();
  const datasets = datasetsData || [];

  return (
    <div className="space-y-6 pt-6">
      {/* Basic Snapshot Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Snapshot Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset *</Label>
            <SelectWithInlineCreate
              value={formData.dataset_id || undefined}
              onValueChange={(value) => handleChange("dataset_id", value)}
              options={datasets.map((ds) => ({
                id: ds.id,
                label: ds.name,
                value: String(ds.id),
              }))}
              isLoading={isLoadingDatasets}
              isEmpty={!isLoadingDatasets && datasets.length === 0}
              entityName="Dataset"
              modalForm={DatasetModalForm}
              placeholder={isLoadingDatasets ? "Loading datasets..." : "Select a dataset"}
              error={!!errors.dataset_id}
            />
            {errors.dataset_id && <p className="text-sm text-red-500">{errors.dataset_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="version_tag">Version Tag *</Label>
            <Input
              id="version_tag"
              value={formData.version_tag}
              onChange={(e) => handleChange("version_tag", e.target.value)}
              placeholder="e.g., v1.0.0, 2024-Q1-train"
              className={errors.version_tag ? "border-red-500" : ""}
            />
            {errors.version_tag && <p className="text-sm text-red-500">{errors.version_tag[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time_range_start">Time Range Start *</Label>
            <Input
              id="time_range_start"
              type="datetime-local"
              value={formData.time_range_start}
              onChange={(e) => handleChange("time_range_start", e.target.value)}
              className={errors.time_range_start ? "border-red-500" : ""}
            />
            {errors.time_range_start && <p className="text-sm text-red-500">{errors.time_range_start[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time_range_end">Time Range End *</Label>
            <Input
              id="time_range_end"
              type="datetime-local"
              value={formData.time_range_end}
              onChange={(e) => handleChange("time_range_end", e.target.value)}
              className={errors.time_range_end ? "border-red-500" : ""}
            />
            {errors.time_range_end && <p className="text-sm text-red-500">{errors.time_range_end[0]}</p>}
          </div>
        </div>
      </div>

      {/* Data Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Data Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="row_count">Row Count</Label>
            <Input
              id="row_count"
              type="number"
              value={formData.row_count || ""}
              onChange={(e) => handleChange("row_count", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 1000000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pii_element_count">PII Element Count</Label>
            <Input
              id="pii_element_count"
              type="number"
              value={formData.pii_element_count || ""}
              onChange={(e) => handleChange("pii_element_count", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_category_element_count">Special Category Element Count</Label>
            <Input
              id="special_category_element_count"
              type="number"
              value={formData.special_category_element_count || ""}
              onChange={(e) => handleChange("special_category_element_count", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality_checksums">Quality Checksums</Label>
            <Input
              id="quality_checksums"
              value={formData.quality_checksums || ""}
              onChange={(e) => handleChange("quality_checksums", e.target.value)}
              placeholder="e.g., SHA256:abc123..."
            />
          </div>
        </div>
      </div>

      {/* Privacy & Storage */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Privacy & Storage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="residency_zone">Residency Zone *</Label>
            <Select key={`residency_zone-${formData.residency_zone || 'empty'}`} value={formData.residency_zone || ""} onValueChange={(value) => handleChange("residency_zone", value)}>
              <SelectTrigger className={`w-full ${errors.residency_zone ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select residency zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AE">AE</SelectItem>
                <SelectItem value="EU">EU</SelectItem>
                <SelectItem value="KSA">KSA</SelectItem>
                <SelectItem value="US">US</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="QA">QA</SelectItem>
                <SelectItem value="JO">JO</SelectItem>
                <SelectItem value="MA">MA</SelectItem>
                <SelectItem value="BH">BH</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.residency_zone && <p className="text-sm text-red-500">{errors.residency_zone[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_uri">Storage URI *</Label>
            <Input
              id="storage_uri"
              value={formData.storage_uri}
              onChange={(e) => handleChange("storage_uri", e.target.value)}
              placeholder="e.g., s3://bucket/path/snapshot.parquet"
              className={errors.storage_uri ? "border-red-500" : ""}
            />
            {errors.storage_uri && <p className="text-sm text-red-500">{errors.storage_uri[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="masking_anonymization_method">Masking/Anonymization Method</Label>
            <Input
              id="masking_anonymization_method"
              value={formData.masking_anonymization_method || ""}
              onChange={(e) => handleChange("masking_anonymization_method", e.target.value)}
              placeholder="e.g., k-anonymity, differential privacy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privacy_transform_evidence_ref">Privacy Transform Evidence Reference</Label>
            <Input
              id="privacy_transform_evidence_ref"
              value={formData.privacy_transform_evidence_ref || ""}
              onChange={(e) => handleChange("privacy_transform_evidence_ref", e.target.value)}
              placeholder="Link to evidence document"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetSnapshotForm;

