"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreatePdpProcessingRegisterData } from "@/app/lib/features/pdpProcessingRegisterApi";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";

interface PdpProcessingRegisterFormProps {
  formData: CreatePdpProcessingRegisterData;
  setFormData: React.Dispatch<React.SetStateAction<CreatePdpProcessingRegisterData>>;
  errors: Record<string, string[]>;
}

const PdpProcessingRegisterForm: React.FC<PdpProcessingRegisterFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreatePdpProcessingRegisterData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const dataSubjectCategories = [
    { value: "Customers", label: "Customers" },
    { value: "Prospects", label: "Prospects" },
    { value: "Employees", label: "Employees" },
    { value: "Vendors", label: "Vendors" },
    { value: "Minors", label: "Minors" },
  ];

  const personalDataCategories = [
    { value: "Identifiers", label: "Identifiers" },
    { value: "Contact Information", label: "Contact Information" },
    { value: "Financial Data", label: "Financial Data" },
    { value: "Behavioral Data", label: "Behavioral Data" },
    { value: "Location Data", label: "Location Data" },
    { value: "Biometric Data", label: "Biometric Data" },
    { value: "Health Data", label: "Health Data" },
  ];

  const recipientOptions = [
    { value: "Internal Teams", label: "Internal Teams" },
    { value: "Third Party Vendors", label: "Third Party Vendors" },
    { value: "Cloud Service Providers", label: "Cloud Service Providers" },
    { value: "Data Processors", label: "Data Processors" },
    { value: "Regulatory Authorities", label: "Regulatory Authorities" },
    { value: "Business Partners", label: "Business Partners" },
  ];

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Processing Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="purpose">Processing Purpose *</Label>
            <Textarea id="purpose" value={formData.purpose} onChange={(e) => handleChange("purpose", e.target.value)} placeholder="Describe the processing purpose" rows={2} className={errors.purpose ? "border-red-500" : ""} />
            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="controller_role">Controller Role *</Label>
            <Select value={formData.controller_role} onValueChange={(value) => handleChange("controller_role", value)}>
              <SelectTrigger className={`w-full ${errors.controller_role ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Controller">Controller</SelectItem>
                <SelectItem value="Joint Controller">Joint Controller</SelectItem>
                <SelectItem value="Processor">Processor</SelectItem>
              </SelectContent>
            </Select>
            {errors.controller_role && <p className="text-sm text-red-500">{errors.controller_role[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_team">Owner Team *</Label>
            <Input id="owner_team" value={formData.owner_team} onChange={(e) => handleChange("owner_team", e.target.value)} placeholder="e.g., Data Governance" className={errors.owner_team ? "border-red-500" : ""} />
            {errors.owner_team && <p className="text-sm text-red-500">{errors.owner_team[0]}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="data_subject_categories">Data Subject Categories *</Label>
            <CustomMultiSelect
              options={dataSubjectCategories}
              value={formData.data_subject_categories}
              onChange={(value) => handleChange("data_subject_categories", value)}
              placeholder="Select data subject categories"
              className={errors.data_subject_categories ? "border-red-500" : ""}
            />
            {errors.data_subject_categories && <p className="text-sm text-red-500">{errors.data_subject_categories[0]}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="personal_data_categories">Personal Data Categories *</Label>
            <CustomMultiSelect
              options={personalDataCategories}
              value={formData.personal_data_categories}
              onChange={(value) => handleChange("personal_data_categories", value)}
              placeholder="Select personal data categories"
              className={errors.personal_data_categories ? "border-red-500" : ""}
            />
            {errors.personal_data_categories && <p className="text-sm text-red-500">{errors.personal_data_categories[0]}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Legal Basis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lawful_basis">Lawful Basis *</Label>
            <Select value={formData.lawful_basis} onValueChange={(value) => handleChange("lawful_basis", value)}>
              <SelectTrigger className={`w-full ${errors.lawful_basis ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select basis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consent">Consent</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Legal Obligation">Legal Obligation</SelectItem>
                <SelectItem value="Legitimate Interests">Legitimate Interests</SelectItem>
                <SelectItem value="Public Task">Public Task</SelectItem>
                <SelectItem value="Vital Interests">Vital Interests</SelectItem>
              </SelectContent>
            </Select>
            {errors.lawful_basis && <p className="text-sm text-red-500">{errors.lawful_basis[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lawful_basis_detail">Lawful Basis Detail</Label>
            <Input id="lawful_basis_detail" value={formData.lawful_basis_detail || ""} onChange={(e) => handleChange("lawful_basis_detail", e.target.value)} placeholder="Additional details or link" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Compliance & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dpia_required_flag">DPIA Required</Label>
            <Select value={formData.dpia_required_flag || ""} onValueChange={(value) => handleChange("dpia_required_flag", value)}>
              <SelectTrigger className={`w-full ${errors.dpia_required_flag ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className={`w-full ${errors.status ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="retention_policy_ref">Retention Policy Reference</Label>
            <Input id="retention_policy_ref" value={formData.retention_policy_ref || ""} onChange={(e) => handleChange("retention_policy_ref", e.target.value)} placeholder="Link to retention policy" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="international_transfer_ref">International Transfer Reference</Label>
            <Input id="international_transfer_ref" value={formData.international_transfer_ref || ""} onChange={(e) => handleChange("international_transfer_ref", e.target.value)} placeholder="Adequacy, SCCs, etc." />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="recipients">Recipients</Label>
            <CustomMultiSelect
              options={recipientOptions}
              value={formData.recipients || []}
              onChange={(value) => handleChange("recipients", value)}
              placeholder="Select recipients"
            />
            {errors.recipients && <p className="text-sm text-red-500">{errors.recipients[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="security_measures_ref">Security Measures Reference</Label>
            <Input id="security_measures_ref" value={formData.security_measures_ref || ""} onChange={(e) => handleChange("security_measures_ref", e.target.value)} placeholder="Link to security measures" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_from">Effective From *</Label>
            <Input id="effective_from" type="date" value={formData.effective_from} onChange={(e) => handleChange("effective_from", e.target.value)} className={errors.effective_from ? "border-red-500" : ""} />
            {errors.effective_from && <p className="text-sm text-red-500">{errors.effective_from[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_to">Effective To (optional)</Label>
            <Input id="effective_to" type="date" value={formData.effective_to || ""} onChange={(e) => handleChange("effective_to", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdpProcessingRegisterForm;

