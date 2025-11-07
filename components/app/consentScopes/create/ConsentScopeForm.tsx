"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateConsentScopeData } from "@/app/lib/features/consentScopesApi";
import { useGetDatasetsQuery } from "@/app/lib/features/datasetsApi";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";

interface ConsentScopeFormProps {
  formData: CreateConsentScopeData;
  setFormData: React.Dispatch<React.SetStateAction<CreateConsentScopeData>>;
  errors: Record<string, string[]>;
}

const ConsentScopeForm: React.FC<ConsentScopeFormProps> = ({ formData, setFormData, errors }) => {
  const { data: datasetsData } = useGetDatasetsQuery();
  const datasets = datasetsData || [];

  const purposeOptions = [
    { value: "marketing", label: "Marketing" },
    { value: "analytics", label: "Analytics" },
    { value: "personalization", label: "Personalization" },
    { value: "training_ai", label: "Training AI" },
    { value: "service_operations", label: "Service Operations" },
    { value: "support", label: "Support" },
    { value: "research", label: "Research" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (field: keyof CreateConsentScopeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Scope Definition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataset_id">
              Dataset <span className="text-red-500">*</span>
            </Label>
            <Select key={`dataset_id-${formData.dataset_id || 'empty'}`} value={formData.dataset_id || ""} onValueChange={(value) => handleChange("dataset_id", value)}>
              <SelectTrigger id="dataset_id" className={`w-full ${errors.dataset_id ? "border-red-500" : ""}`}>
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
            <Label htmlFor="purpose">Purpose <span className="text-red-500">*</span></Label>
            <CustomMultiSelect
              options={purposeOptions}
              value={formData.purpose}
              onChange={(value) => handleChange("purpose", value)}
              placeholder="Select purposes"
              className={errors.purpose ? "border-red-500" : ""}
            />
            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject_realm">Subject Realm <span className="text-red-500">*</span></Label>
            <Select key={`subject_realm-${formData.subject_realm || 'empty'}`} value={formData.subject_realm || ""} onValueChange={(value) => handleChange("subject_realm", value)}>
              <SelectTrigger className={`w-full ${errors.subject_realm ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select realm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">customer</SelectItem>
                <SelectItem value="prospect">prospect</SelectItem>
                <SelectItem value="employee">employee</SelectItem>
                <SelectItem value="vendor">vendor</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>
            {errors.subject_realm && <p className="text-sm text-red-500">{errors.subject_realm[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction <span className="text-red-500">*</span></Label>
            <Select key={`jurisdiction-${formData.jurisdiction || 'empty'}`} value={formData.jurisdiction || ""} onValueChange={(value) => handleChange("jurisdiction", value)}>
              <SelectTrigger className={`w-full ${errors.jurisdiction ? "border-red-500" : ""}`}>
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
            <Label htmlFor="source_created_at">Created At <span className="text-red-500">*</span></Label>
            <Input id="source_created_at" type="datetime-local" value={formData.source_created_at} onChange={(e) => handleChange("source_created_at", e.target.value)} className={errors.source_created_at ? "border-red-500" : ""} />
            {errors.source_created_at && <p className="text-sm text-red-500">{errors.source_created_at[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_from">Effective From <span className="text-red-500">*</span></Label>
            <Input id="effective_from" type="datetime-local" value={formData.effective_from} onChange={(e) => handleChange("effective_from", e.target.value)} className={errors.effective_from ? "border-red-500" : ""} />
            {errors.effective_from && <p className="text-sm text-red-500">{errors.effective_from[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_to">Effective To (optional)</Label>
            <Input id="effective_to" type="datetime-local" value={formData.effective_to || ""} onChange={(e) => handleChange("effective_to", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentScopeForm;

