"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateUserConsentData } from "@/app/lib/features/userConsentsApi";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";

interface UserConsentFormProps {
  formData: CreateUserConsentData;
  setFormData: React.Dispatch<React.SetStateAction<CreateUserConsentData>>;
  errors: Record<string, string[]>;
}

const UserConsentForm: React.FC<UserConsentFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateUserConsentData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const consentPurposeOptions = [
    { value: "marketing", label: "marketing" },
    { value: "analytics", label: "analytics" },
    { value: "personalization", label: "personalization" },
    { value: "training_ai", label: "training_ai" },
    { value: "service_operations", label: "service_operations" },
    { value: "support", label: "support" },
    { value: "research", label: "research" },
    { value: "other", label: "other" },
  ];

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Subject Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject_key">Subject Key * (pseudonymous)</Label>
            <Input id="subject_key" value={formData.subject_key} onChange={(e) => handleChange("subject_key", e.target.value)} placeholder="e.g., subject_abc123" className={errors.subject_key ? "border-red-500" : ""} />
            {errors.subject_key && <p className="text-sm text-red-500">{errors.subject_key[0]}</p>}
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
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Consent Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="consent_status">Consent Status *</Label>
            <Select value={formData.consent_status} onValueChange={(value) => handleChange("consent_status", value)}>
              <SelectTrigger className={errors.consent_status ? "border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="granted">granted</SelectItem>
                <SelectItem value="denied">denied</SelectItem>
                <SelectItem value="withdrawn">withdrawn</SelectItem>
                <SelectItem value="expired">expired</SelectItem>
                <SelectItem value="not_obtained">not_obtained</SelectItem>
              </SelectContent>
            </Select>
            {errors.consent_status && <p className="text-sm text-red-500">{errors.consent_status[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="legal_basis">Legal Basis *</Label>
            <Select value={formData.legal_basis} onValueChange={(value) => handleChange("legal_basis", value)}>
              <SelectTrigger className={errors.legal_basis ? "border-red-500" : ""}>
                <SelectValue placeholder="Select legal basis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consent">consent</SelectItem>
                <SelectItem value="contract">contract</SelectItem>
                <SelectItem value="legal_obligation">legal_obligation</SelectItem>
                <SelectItem value="legitimate_interests">legitimate_interests</SelectItem>
                <SelectItem value="public_task">public_task</SelectItem>
                <SelectItem value="vital_interests">vital_interests</SelectItem>
              </SelectContent>
            </Select>
            {errors.legal_basis && <p className="text-sm text-red-500">{errors.legal_basis[0]}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="consent_purpose">Consent Purpose *</Label>
            <CustomMultiSelect
              options={consentPurposeOptions}
              value={formData.consent_purpose || []}
              onChange={(value) => handleChange("consent_purpose", value)}
              placeholder="Select consent purposes"
              className={errors.consent_purpose ? "border-red-500" : ""}
            />
            {errors.consent_purpose && <p className="text-sm text-red-500">{errors.consent_purpose[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_system">Source System *</Label>
            <Input id="source_system" value={formData.source_system} onChange={(e) => handleChange("source_system", e.target.value)} placeholder="e.g., consent_management_system" className={errors.source_system ? "border-red-500" : ""} />
            {errors.source_system && <p className="text-sm text-red-500">{errors.source_system[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence_ref">Evidence Reference *</Label>
            <Input id="evidence_ref" value={formData.evidence_ref} onChange={(e) => handleChange("evidence_ref", e.target.value)} placeholder="Link to evidence" className={errors.evidence_ref ? "border-red-500" : ""} />
            {errors.evidence_ref && <p className="text-sm text-red-500">{errors.evidence_ref[0]}</p>}
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

          <div className="space-y-2">
            <Label htmlFor="scope">Scope (optional)</Label>
            <Input id="scope" value={formData.scope || ""} onChange={(e) => handleChange("scope", e.target.value)} placeholder="e.g., marketing, analytics" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserConsentForm;

