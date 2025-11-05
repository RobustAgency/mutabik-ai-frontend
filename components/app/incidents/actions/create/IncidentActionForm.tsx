"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateIncidentActionData } from "@/app/lib/features/incidentActionsApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";

interface IncidentActionFormProps {
  formData: CreateIncidentActionData;
  setFormData: React.Dispatch<React.SetStateAction<CreateIncidentActionData>>;
  errors: Record<string, string[]>;
}

const IncidentActionForm: React.FC<IncidentActionFormProps> = ({ formData, setFormData, errors }) => {
  const { data: incidentsData, isLoading: isIncidentsLoading } = useGetAiIncidentsQuery({ per_page: 100 });
  const incidents = incidentsData?.data || [];
  
  const handleInputChange = (field: keyof CreateIncidentActionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Incident <span className="text-red-500">*</span></Label>
        <Select
          value={formData.ai_incident_id ? String(formData.ai_incident_id) : undefined}
          onValueChange={(value) => handleInputChange("ai_incident_id", Number(value))}
        >
          <SelectTrigger className={`w-full ${errors.ai_incident_id ? "border-destructive" : ""}`}>
            <SelectValue placeholder={isIncidentsLoading ? "Loading incidents..." : "Select incident"} />
          </SelectTrigger>
          <SelectContent>
            {incidents.map((incident: any) => (
              <SelectItem key={incident.id} value={String(incident.id)}>
                #{incident.id} - {incident.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ai_incident_id && (
          <p className="text-sm text-destructive">{errors.ai_incident_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Action Type <span className="text-red-500">*</span></Label>
        <Select value={formData.action_type} onValueChange={(value) => handleInputChange("action_type", value)}>
          <SelectTrigger className={`w-full ${errors.action_type ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kill_switch">Kill Switch</SelectItem>
            <SelectItem value="rollback_release">Rollback Release</SelectItem>
            <SelectItem value="key_rotation">Key Rotation</SelectItem>
            <SelectItem value="blocklist_update">Blocklist Update</SelectItem>
            <SelectItem value="traffic_throttle">Traffic Throttle</SelectItem>
            <SelectItem value="model_disable_tool">Model Disable Tool</SelectItem>
            <SelectItem value="policy_change">Policy Change</SelectItem>
            <SelectItem value="communication">Communication</SelectItem>
            <SelectItem value="data_purge">Data Purge</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Description <span className="text-red-500">*</span></Label>
        <Textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label>Performed By <span className="text-red-500">*</span></Label>
        <Input value={formData.performed_by} onChange={(e) => handleInputChange("performed_by", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Started At <span className="text-red-500">*</span></Label>
          <Input type="datetime-local" value={formData.started_at} onChange={(e) => handleInputChange("started_at", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Completed At</Label>
          <Input type="datetime-local" value={formData.completed_at || ""} onChange={(e) => handleInputChange("completed_at", e.target.value || null)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Validation Result <span className="text-red-500">*</span></Label>
        <Select value={formData.validation_result} onValueChange={(value) => handleInputChange("validation_result", value)}>
          <SelectTrigger className={`w-full ${errors.validation_result ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="not_applicable">Not Applicable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Validation Notes</Label>
        <Textarea value={formData.validation_notes || ""} onChange={(e) => handleInputChange("validation_notes", e.target.value || null)} rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Evidence Link</Label>
        <Input type="url" value={formData.evidence_link || ""} onChange={(e) => handleInputChange("evidence_link", e.target.value || null)} />
      </div>
    </div>
  );
};

export default IncidentActionForm;

