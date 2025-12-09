"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateIncidentAlertData } from "@/app/lib/features/incidentAlertsApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiIncidentModalForm from "@/components/app/incidents/create/AiIncidentModalForm";

interface IncidentAlertFormProps {
  formData: CreateIncidentAlertData;
  setFormData: React.Dispatch<React.SetStateAction<CreateIncidentAlertData>>;
  errors: Record<string, string[]>;
}

const IncidentAlertForm: React.FC<IncidentAlertFormProps> = ({
  formData,
  setFormData,
  errors,
}) => {
  const { data: incidentsData, isLoading: isIncidentsLoading } = useGetAiIncidentsQuery({ per_page: 100 });
  const incidents = incidentsData?.data || [];

  const handleInputChange = (field: keyof CreateIncidentAlertData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai_incident_id">Incident <span className="text-red-500">*</span></Label>
        <SelectWithInlineCreate
          value={formData.ai_incident_id ? String(formData.ai_incident_id) : ""}
          onValueChange={(value) => handleInputChange("ai_incident_id", Number(value))}
          placeholder={isIncidentsLoading ? "Loading incidents..." : "Select incident"}
          options={incidents.map((incident: any) => ({ id: incident.id, label: `#${incident.id} - ${incident.title}`, value: String(incident.id) }))}
          isLoading={isIncidentsLoading}
          isEmpty={!isIncidentsLoading && incidents.length === 0}
          entityName="Incident"
          canCreate={true}
          modalForm={AiIncidentModalForm}
          error={!!errors.ai_incident_id}
        />
        {getError("ai_incident_id") && (
          <p className="text-sm text-destructive">{getError("ai_incident_id")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="source_type">Source Type <span className="text-red-500">*</span></Label>
        <Select
          value={formData.source_type}
          onValueChange={(value) => handleInputChange("source_type", value)}
        >
          <SelectTrigger className={`w-full ${errors.source_type ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kri">KRI</SelectItem>
            <SelectItem value="monitoring_rule">Monitoring Rule</SelectItem>
            <SelectItem value="human_report">Human Report</SelectItem>
            <SelectItem value="vendor_notice">Vendor Notice</SelectItem>
            <SelectItem value="security_tool">Security Tool</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {getError("source_type") && (
          <p className="text-sm text-destructive">{getError("source_type")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="source_ref">Source Reference</Label>
        <Input
          id="source_ref"
          value={formData.source_ref || ""}
          onChange={(e) => handleInputChange("source_ref", e.target.value || null)}
          placeholder="ID/name of rule or KRI"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rule_version">Rule Version</Label>
        <Input
          id="rule_version"
          value={formData.rule_version || ""}
          onChange={(e) => handleInputChange("rule_version", e.target.value || null)}
          placeholder="Detector/rule version or hash"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="context">Context</Label>
        <Textarea
          id="context"
          value={formData.context || ""}
          onChange={(e) => handleInputChange("context", e.target.value || null)}
          placeholder="Brief payload/context (sanitized)"
          className={`min-h-32 resize-none`}
        />
        <p className="text-xs text-[#667085]">Ensure sensitive data is sanitized before logging</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="first_seen_at">First Seen At <span className="text-red-500">*</span></Label>
        <Input
          id="first_seen_at"
          type="datetime-local"
          value={formData.first_seen_at}
          onChange={(e) => handleInputChange("first_seen_at", e.target.value)}
          className={errors.first_seen_at ? "border-destructive" : ""}
        />
        {getError("first_seen_at") && (
          <p className="text-sm text-destructive">{getError("first_seen_at")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="last_seen_at">Last Seen At</Label>
        <Input
          id="last_seen_at"
          type="datetime-local"
          value={formData.last_seen_at || ""}
          onChange={(e) => handleInputChange("last_seen_at", e.target.value || null)}
        />
        <p className="text-xs text-[#667085]">Last occurrence before containment</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidence_link">Evidence Link</Label>
        <Input
          id="evidence_link"
          type="url"
          value={formData.evidence_link || ""}
          onChange={(e) => handleInputChange("evidence_link", e.target.value || null)}
          placeholder="https://example.com/logs"
        />
      </div>
    </div>
  );
};

export default IncidentAlertForm;

