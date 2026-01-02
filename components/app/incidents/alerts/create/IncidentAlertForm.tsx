"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateIncidentAlertData, AlertSourceType, AlertSeverity } from "@/app/lib/features/incidentAlertsApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiIncidentModalForm from "@/components/app/incidents/create/AiIncidentModalForm";
import DataSourceModalForm from "@/components/app/dataSources/create/DataSourceModalForm";

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
  const { data: dataSourcesData, isLoading: isDataSourcesLoading } = useGetDataSourcesQuery({ per_page: 100 });
  const incidents = incidentsData?.data || [];
  const dataSources = dataSourcesData?.data || [];

  const handleInputChange = (field: keyof CreateIncidentAlertData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai_incident_id">Incident <span className="text-red-500">*</span></Label>
        <SelectWithInlineCreate
          key={`ai_incident_id-${formData.ai_incident_id || "none"}`}
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
          key={`source_type-${formData.source_type || "none"}`}
          value={formData.source_type}
          onValueChange={(value) => handleInputChange("source_type", value)}
        >
          <SelectTrigger className={`w-full ${errors.source_type ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AlertSourceType.MONITORING_RULE}>Monitoring Rule</SelectItem>
            <SelectItem value={AlertSourceType.KRI_THRESHOLD}>KRI Threshold</SelectItem>
            <SelectItem value={AlertSourceType.MANUAL_REPORT}>Manual Report</SelectItem>
            <SelectItem value={AlertSourceType.AUTOMATED_SCAN}>Automated Scan</SelectItem>
            <SelectItem value={AlertSourceType.USER_COMPLAINT}>User Complaint</SelectItem>
            <SelectItem value={AlertSourceType.EXTERNAL_REPORT}>External Report</SelectItem>
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
        <Label htmlFor="data_source_id">Data Source</Label>
        <SelectWithInlineCreate
          key={`data_source_id-${formData.data_source_id || "none"}`}
          value={formData.data_source_id ? String(formData.data_source_id) : ""}
          onValueChange={(value) => {
            // Empty string means no selection (null)
            handleInputChange("data_source_id", value === "" ? null : Number(value));
          }}
          placeholder={isDataSourcesLoading ? "Loading data sources..." : "Select data source (optional)"}
          options={dataSources.map((source) => ({
            id: source.id,
            label: source.name,
            value: String(source.id),
          }))}
          isLoading={isDataSourcesLoading}
          isEmpty={!isDataSourcesLoading && dataSources.length === 0}
          entityName="Data Source"
          canCreate={true}
          modalForm={DataSourceModalForm}
          error={!!errors.data_source_id}
        />
        {getError("data_source_id") && (
          <p className="text-sm text-destructive">{getError("data_source_id")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert_sensitivity">Alert Sensitivity <span className="text-red-500">*</span></Label>
        <Select
          key={`alert_sensitivity-${formData.alert_sensitivity || "none"}`}
          value={formData.alert_sensitivity}
          onValueChange={(value) => handleInputChange("alert_sensitivity", value)}
        >
          <SelectTrigger className={`w-full ${errors.alert_sensitivity ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AlertSeverity.LOW}>Low</SelectItem>
            <SelectItem value={AlertSeverity.MEDIUM}>Medium</SelectItem>
            <SelectItem value={AlertSeverity.HIGH}>High</SelectItem>
            <SelectItem value={AlertSeverity.CRITICAL}>Critical</SelectItem>
          </SelectContent>
        </Select>
        {getError("alert_sensitivity") && (
          <p className="text-sm text-destructive">{getError("alert_sensitivity")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="context">Context <span className="text-red-500">*</span></Label>
        <Textarea
          id="context"
          value={formData.context || ""}
          onChange={(e) => handleInputChange("context", e.target.value)}
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

