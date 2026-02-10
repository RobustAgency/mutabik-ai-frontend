"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AiIncident } from "@/app/lib/features/aiIncidentsApi";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AiIncidentFormReadOnlyProps {
  incident: AiIncident;
}

const ReadOnlyField: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
  <div className="space-y-2">
    <Label className="text-[#667085]">{label}</Label>
    <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
      {value !== null && value !== undefined ? value : "—"}
    </div>
  </div>
);

const formatEnumValue = (value: string | undefined | null): string => {
  if (!value) return "—";
  return value.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const AiIncidentFormReadOnly: React.FC<AiIncidentFormReadOnlyProps> = ({ incident }) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information & Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incident.display_id && <ReadOnlyField label="Display ID" value={incident.display_id} />}
          <ReadOnlyField label="Title" value={incident.title} />
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[#667085]">Summary</Label>
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB] min-h-32">
              {incident.summary}
            </div>
          </div>
          <ReadOnlyField label="Incident Type" value={formatEnumValue(incident.incident_type)} />
          <ReadOnlyField label="Domain" value={formatEnumValue(incident.domain)} />
          <div className="space-y-2">
            <Label className="text-[#667085]">Severity</Label>
            <Badge variant="filled" color={incident.severity === "sev1_critical" ? "error" : incident.severity === "sev2_high" ? "warning" : "info"}>
              {formatEnumValue(incident.severity)}
            </Badge>
          </div>
          <div className="space-y-2">
            <Label className="text-[#667085]">Status</Label>
            <Badge variant="outlined" color={incident.status === "resolved" ? "success" : incident.status === "open" ? "error" : "default"}>
              {formatEnumValue(incident.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Response & Governance */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Response & Governance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Incident Commander" value={incident.incident_commander} />
          <ReadOnlyField label="Response Team" value={formatEnumValue(incident.response_team)} />
          <ReadOnlyField label="Primary Regulatory Framework" value={formatEnumValue(incident.primary_regulatory_framework)} />
          <ReadOnlyField label="Notification Requirement" value={formatEnumValue(incident.notification_requirement)} />
          {incident.data_residency_affected && (
            <ReadOnlyField label="Data Residency Affected" value={formatEnumValue(incident.data_residency_affected)} />
          )}
          {incident.regulatory_reference && (
            <ReadOnlyField label="Regulatory Reference" value={incident.regulatory_reference} />
          )}
        </div>
      </div>

      {/* Impact Assessment */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Impact Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incident.estimated_impacted_users !== null && incident.estimated_impacted_users !== undefined && (
            <ReadOnlyField label="Estimated Impacted Users" value={incident.estimated_impacted_users?.toLocaleString()} />
          )}
          <ReadOnlyField label="Estimated Impacted Records" value={incident.estimated_impacted_records?.toLocaleString()} />
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[#667085]">Data Types Impacted</Label>
            <div className="flex flex-wrap gap-2">
              {incident.data_types_impacted && incident.data_types_impacted.length > 0 ? (
                incident.data_types_impacted.map((type) => (
                  <Badge key={type} variant="light" color="info">
                    {formatEnumValue(type)}
                  </Badge>
                ))
              ) : (
                <span className="text-[#667085]">—</span>
              )}
            </div>
          </div>
          {incident.affected_business_units && incident.affected_business_units.length > 0 && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[#667085]">Affected Business Units</Label>
              <div className="flex flex-wrap gap-2">
                {incident.affected_business_units.map((unit) => (
                  <Badge key={unit} variant="light" color="default">
                    {formatEnumValue(unit)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {incident.external_parties_involved && incident.external_parties_involved.length > 0 && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[#667085]">External Parties Involved</Label>
              <div className="flex flex-wrap gap-2">
                {incident.external_parties_involved.map((party) => (
                  <Badge key={party} variant="light" color="default">
                    {formatEnumValue(party)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {incident.business_impact_description && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[#667085]">Business Impact Description</Label>
              <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB] min-h-32">
                {incident.business_impact_description}
              </div>
            </div>
          )}
          {incident.impacted_systems && (
            <ReadOnlyField label="Impacted Systems" value={incident.impacted_systems} />
          )}
        </div>
      </div>

      {/* Links & Evidence */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Links & Evidence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incident.ai_model ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#667085]">AI Model</Label>
                <Link
                  href={`/core-assets/ai-models/${incident.ai_model.id}`}
                  target="_blank"
                  className="text-xs text-[#039855] hover:underline flex items-center gap-1"
                >
                  View <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                {incident.ai_model.name}
              </div>
            </div>
          ) : incident.ai_model_id ? (
            <ReadOnlyField label="AI Model ID" value={incident.ai_model_id} />
          ) : null}
          {incident.dataset ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[#667085]">Dataset</Label>
                <Link
                  href={`/core-assets/data/registry/${incident.dataset.id}`}
                  target="_blank"
                  className="text-xs text-[#039855] hover:underline flex items-center gap-1"
                >
                  View <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                {incident.dataset.name}
              </div>
            </div>
          ) : incident.linked_dataset_id ? (
            <ReadOnlyField label="Dataset ID" value={incident.linked_dataset_id} />
          ) : null}
          {incident.linked_risk_id && (
            <ReadOnlyField label="Linked Risk ID" value={incident.linked_risk_id} />
          )}
          {incident.evidence_link && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[#667085]">Evidence Link</Label>
              <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] p-3 border border-[#E4E7EC] rounded-md bg-[#F9FAFB]">
                <a href={incident.evidence_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {incident.evidence_link}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReadOnlyField label="Created At" value={incident.created_at ? new Date(incident.created_at).toLocaleString() : null} />
          <ReadOnlyField label="Updated At" value={incident.updated_at ? new Date(incident.updated_at).toLocaleString() : null} />
        </div>
      </div>
    </div>
  );
};

export default AiIncidentFormReadOnly;


