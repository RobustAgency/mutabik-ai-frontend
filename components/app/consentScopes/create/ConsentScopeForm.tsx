"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateConsentScopeData } from "@/app/lib/features/consentScopesApi";

interface ConsentScopeFormProps {
  formData: CreateConsentScopeData;
  setFormData: React.Dispatch<React.SetStateAction<CreateConsentScopeData>>;
  errors: Record<string, string[]>;
}

const ConsentScopeForm: React.FC<ConsentScopeFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateConsentScopeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Scope Definition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataset_id">Dataset ID *</Label>
            <Input id="dataset_id" value={formData.dataset_id} onChange={(e) => handleChange("dataset_id", e.target.value)} placeholder="e.g., ds_12345" className={errors.dataset_id ? "border-red-500" : ""} />
            {errors.dataset_id && <p className="text-sm text-red-500">{errors.dataset_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input id="purpose" value={formData.purpose} onChange={(e) => handleChange("purpose", e.target.value)} placeholder="e.g., training_ai, analytics" className={errors.purpose ? "border-red-500" : ""} />
            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject_realm">Subject Realm *</Label>
            <Select value={formData.subject_realm} onValueChange={(value) => handleChange("subject_realm", value)}>
              <SelectTrigger className={errors.subject_realm ? "border-red-500" : ""}>
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
            <Label htmlFor="effective_from">Effective From *</Label>
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

