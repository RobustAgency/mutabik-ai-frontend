"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateCorrectivePreventiveActionData } from "@/app/lib/features/correctivePreventiveActionsApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";

interface CAPAFormProps {
  formData: CreateCorrectivePreventiveActionData;
  setFormData: React.Dispatch<React.SetStateAction<CreateCorrectivePreventiveActionData>>;
  errors: Record<string, string[]>;
}

const CAPAForm: React.FC<CAPAFormProps> = ({ formData, setFormData, errors }) => {
  const { data: aiModels = [], isLoading: isModelsLoading } = useGetAiModelsQuery();

  const handleInputChange = (field: keyof CreateCorrectivePreventiveActionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Source Type <span className="text-red-500">*</span></Label>
          <Select value={formData.source_type} onValueChange={(value) => handleInputChange("source_type", value)}>
            <SelectTrigger className={`w-full ${errors.source_type ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incident">Incident</SelectItem>
              <SelectItem value="risk">Risk</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="override">Override</SelectItem>
              <SelectItem value="audit">Audit</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Source ID <span className="text-red-500">*</span></Label>
          <Input
            value={formData.source_id}
            onChange={(e) => handleInputChange("source_id", e.target.value)}
            placeholder={formData.source_type === "incident" ? "Enter incident ID" : formData.source_type === "risk" ? "Enter risk ID" : "Enter source ID"}
            className={errors.source_id ? "border-destructive" : ""}
          />
          {errors.source_id && (
            <p className="text-sm text-destructive">{errors.source_id[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Model</Label>
        <SelectWithInlineCreate
          key={`model_id-${formData.model_id ?? 'none'}`}
          value={formData.model_id ? String(formData.model_id) : undefined}
          onValueChange={(value) => handleInputChange("model_id", value || null)}
          options={aiModels.map((model: any) => ({
            id: model.id,
            label: model.name,
            value: String(model.id),
          }))}
          isLoading={isModelsLoading}
          isEmpty={!isModelsLoading && aiModels.length === 0}
          entityName="AI Model"
          modalForm={AiModelModalForm}
          placeholder="Select model (optional)"
          error={!!errors.model_id}
        />
        {errors.model_id && (
          <p className="text-sm text-destructive">{errors.model_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Title <span className="text-red-500">*</span></Label>
        <Input value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CAPA Type <span className="text-red-500">*</span></Label>
          <Select value={formData.capa_type} onValueChange={(value) => handleInputChange("capa_type", value)}>
            <SelectTrigger className={`w-full ${errors.capa_type ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority <span className="text-red-500">*</span></Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
            <SelectTrigger className={`w-full ${errors.priority ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Owner Team <span className="text-red-500">*</span></Label>
          <Select value={formData.owner_team} onValueChange={(value) => handleInputChange("owner_team", value)}>
            <SelectTrigger className={`w-full ${errors.owner_team ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product_ops">Product Ops</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="data_science">Data Science</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="privacy">Privacy</SelectItem>
              <SelectItem value="risk">Risk</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="vendor_mgmt">Vendor Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Assignee</Label>
          <Input value={formData.assignee || ""} onChange={(e) => handleInputChange("assignee", e.target.value || null)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Root Cause</Label>
        <Textarea className="min-h-32 resize-none" value={formData.root_cause || ""} onChange={(e) => handleInputChange("root_cause", e.target.value || null)} rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Actions</Label>
        <Textarea className="min-h-32 resize-none" value={formData.actions || ""} onChange={(e) => handleInputChange("actions", e.target.value || null)} rows={3} placeholder="Steps or link to checklist" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Due Date <span className="text-red-500">*</span></Label>
          <Input type="date" value={formData.due_date} onChange={(e) => handleInputChange("due_date", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Status <span className="text-red-500">*</span></Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
            <SelectTrigger className={`w-full ${errors.status ? "border-destructive" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="pending_verification">Pending Verification</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Verification Result <span className="text-red-500">*</span></Label>
        <Select value={formData.verification_result} onValueChange={(value) => handleInputChange("verification_result", value)}>
          <SelectTrigger className={`w-full ${errors.verification_result ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="not_applicable">Not Applicable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Evidence Link</Label>
        <Input type="url" value={formData.evidence_link || ""} onChange={(e) => handleInputChange("evidence_link", e.target.value || null)} placeholder="Proof of fix" />
      </div>
    </div>
  );
};

export default CAPAForm;

