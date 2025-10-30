"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateConsentCoverageData } from "@/app/lib/features/consentCoverageApi";

interface ConsentCoverageFormProps {
  formData: CreateConsentCoverageData;
  setFormData: React.Dispatch<React.SetStateAction<CreateConsentCoverageData>>;
  errors: Record<string, string[]>;
}

const ConsentCoverageForm: React.FC<ConsentCoverageFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateConsentCoverageData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Coverage Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset ID *</Label>
            <Input id="dataset_id" value={formData.dataset_id} onChange={(e) => handleChange("dataset_id", e.target.value)} placeholder="e.g., ds_12345" className={errors.dataset_id ? "border-red-500" : ""} />
            {errors.dataset_id && <p className="text-sm text-red-500">{errors.dataset_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="snapshot_id">Snapshot ID (optional)</Label>
            <Input id="snapshot_id" value={formData.snapshot_id || ""} onChange={(e) => handleChange("snapshot_id", e.target.value)} placeholder="e.g., snap_12345" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input id="purpose" value={formData.purpose} onChange={(e) => handleChange("purpose", e.target.value)} placeholder="e.g., training_ai" className={errors.purpose ? "border-red-500" : ""} />
            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction *</Label>
            <Select value={formData.jurisdiction} onValueChange={(value) => handleChange("jurisdiction", value)}>
              <SelectTrigger className={errors.jurisdiction ? "border-red-500" : ""}>
                <SelectValue placeholder="Select jurisdiction" />
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
            {errors.jurisdiction && <p className="text-sm text-red-500">{errors.jurisdiction[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="as_of">As Of (UTC) *</Label>
            <Input id="as_of" type="datetime-local" value={formData.as_of} onChange={(e) => handleChange("as_of", e.target.value)} className={errors.as_of ? "border-red-500" : ""} />
            {errors.as_of && <p className="text-sm text-red-500">{errors.as_of[0]}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Coverage Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subjects_total">Total Subjects *</Label>
            <Input id="subjects_total" type="number" value={formData.subjects_total} onChange={(e) => handleChange("subjects_total", parseInt(e.target.value))} placeholder="e.g., 10000" className={errors.subjects_total ? "border-red-500" : ""} />
            {errors.subjects_total && <p className="text-sm text-red-500">{errors.subjects_total[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects_with_valid_consent">Subjects with Valid Consent *</Label>
            <Input id="subjects_with_valid_consent" type="number" value={formData.subjects_with_valid_consent} onChange={(e) => handleChange("subjects_with_valid_consent", parseInt(e.target.value))} placeholder="e.g., 9500" className={errors.subjects_with_valid_consent ? "border-red-500" : ""} />
            {errors.subjects_with_valid_consent && <p className="text-sm text-red-500">{errors.subjects_with_valid_consent[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverage_pct">Coverage % *</Label>
            <Input id="coverage_pct" type="number" step="0.01" min="0" max="100" value={formData.coverage_pct} onChange={(e) => handleChange("coverage_pct", parseFloat(e.target.value))} placeholder="e.g., 95.0" className={errors.coverage_pct ? "border-red-500" : ""} />
            {errors.coverage_pct && <p className="text-sm text-red-500">{errors.coverage_pct[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence_ref">Evidence Reference *</Label>
            <Input id="evidence_ref" value={formData.evidence_ref} onChange={(e) => handleChange("evidence_ref", e.target.value)} placeholder="Link to evidence" className={errors.evidence_ref ? "border-red-500" : ""} />
            {errors.evidence_ref && <p className="text-sm text-red-500">{errors.evidence_ref[0]}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentCoverageForm;

