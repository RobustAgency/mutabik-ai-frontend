"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateDatasetSubjectPopulationData } from "@/app/lib/features/datasetSubjectPopulationApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { useGetDatasetSnapshotsQuery } from "@/app/lib/features/datasetSnapshotsApi";

interface DatasetSubjectPopulationFormProps {
  formData: CreateDatasetSubjectPopulationData;
  setFormData: React.Dispatch<React.SetStateAction<CreateDatasetSubjectPopulationData>>;
  errors: Record<string, string[]>;
}

const SUBJECT_REALMS = ["customer", "prospect", "employee", "vendor", "other"];
const JURISDICTIONS = ["AE", "EU", "KSA", "US", "UK", "QA", "JO", "MA", "BH", "Other"];

const DatasetSubjectPopulationForm: React.FC<DatasetSubjectPopulationFormProps> = ({ formData, setFormData, errors }) => {
  const { data: datasetsData } = useGetDatasetsQuery({ page: 1, per_page: 1000 });
  const { data: snapshotsData } = useGetDatasetSnapshotsQuery({ page: 1, per_page: 1000 });

  const datasets = datasetsData?.data || [];
  const snapshots = snapshotsData?.data || [];

  // Filter snapshots based on selected dataset
  const filteredSnapshots = formData.dataset_id
    ? snapshots.filter((s) => String(s.dataset_id) === formData.dataset_id)
    : [];

  const handleChange = (field: keyof CreateDatasetSubjectPopulationData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Dataset & Snapshot Context */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Dataset & Snapshot Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataset_id">
              Dataset <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.dataset_id} onValueChange={(value) => {
              handleChange("dataset_id", value);
              // Clear snapshot when dataset changes
              handleChange("snapshot_id", "");
            }}>
              <SelectTrigger id="dataset_id" className={errors.dataset_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={String(dataset.id)}>
                    {dataset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dataset_id && <p className="text-sm text-red-500">{errors.dataset_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="snapshot_id">Snapshot (Optional)</Label>
            <Select value={formData.snapshot_id} onValueChange={(value) => handleChange("snapshot_id", value)} disabled={!formData.dataset_id}>
              <SelectTrigger id="snapshot_id" className={errors.snapshot_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Select snapshot (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredSnapshots.map((snapshot) => (
                  <SelectItem key={snapshot.id} value={String(snapshot.id)}>
                    {snapshot.version_tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.snapshot_id && <p className="text-sm text-red-500">{errors.snapshot_id[0]}</p>}
          </div>
        </div>
      </div>

      {/* Subject Context */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Subject Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject_realm">
              Subject Realm <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.subject_realm} onValueChange={(value) => handleChange("subject_realm", value)}>
              <SelectTrigger id="subject_realm" className={errors.subject_realm ? "border-red-500" : ""}>
                <SelectValue placeholder="Select subject realm" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_REALMS.map((realm) => (
                  <SelectItem key={realm} value={realm}>
                    {realm.charAt(0).toUpperCase() + realm.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject_realm && <p className="text-sm text-red-500">{errors.subject_realm[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction">
              Jurisdiction <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.jurisdiction} onValueChange={(value) => handleChange("jurisdiction", value)}>
              <SelectTrigger id="jurisdiction" className={errors.jurisdiction ? "border-red-500" : ""}>
                <SelectValue placeholder="Select jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {JURISDICTIONS.map((jurisdiction) => (
                  <SelectItem key={jurisdiction} value={jurisdiction}>
                    {jurisdiction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.jurisdiction && <p className="text-sm text-red-500">{errors.jurisdiction[0]}</p>}
          </div>
        </div>
      </div>

      {/* Population Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Population Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subjects_total">
              Total Subjects <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subjects_total"
              type="number"
              min="0"
              value={formData.subjects_total}
              onChange={(e) => handleChange("subjects_total", parseInt(e.target.value) || 0)}
              placeholder="Enter total number of subjects"
              className={errors.subjects_total ? "border-red-500" : ""}
            />
            {errors.subjects_total && <p className="text-sm text-red-500">{errors.subjects_total[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="as_of">
              As Of Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="as_of"
              type="datetime-local"
              value={formData.as_of}
              onChange={(e) => handleChange("as_of", e.target.value)}
              className={errors.as_of ? "border-red-500" : ""}
            />
            {errors.as_of && <p className="text-sm text-red-500">{errors.as_of[0]}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetSubjectPopulationForm;

