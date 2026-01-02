"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { type IncidentAlert, AlertSourceType, AlertSeverity } from "@/app/lib/features/incidentAlertsApi";
import { useGetAiIncidentQuery } from "@/app/lib/features/aiIncidentsApi";
import { useGetDataSourceQuery } from "@/app/lib/features/dataSourcesApi";

interface IncidentAlertFormReadOnlyProps {
  alert: IncidentAlert;
}

const SOURCE_TYPE_LABELS: Record<AlertSourceType, string> = {
  [AlertSourceType.MONITORING_RULE]: "Monitoring Rule",
  [AlertSourceType.KRI_THRESHOLD]: "KRI Threshold",
  [AlertSourceType.MANUAL_REPORT]: "Manual Report",
  [AlertSourceType.AUTOMATED_SCAN]: "Automated Scan",
  [AlertSourceType.USER_COMPLAINT]: "User Complaint",
  [AlertSourceType.EXTERNAL_REPORT]: "External Report",
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: "Low",
  [AlertSeverity.MEDIUM]: "Medium",
  [AlertSeverity.HIGH]: "High",
  [AlertSeverity.CRITICAL]: "Critical",
};

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: "bg-blue-100 text-blue-800",
  [AlertSeverity.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [AlertSeverity.HIGH]: "bg-orange-100 text-orange-800",
  [AlertSeverity.CRITICAL]: "bg-red-100 text-red-800",
};

const IncidentAlertFormReadOnly: React.FC<IncidentAlertFormReadOnlyProps> = ({ alert }) => {
  const { data: incident } = useGetAiIncidentQuery(alert.ai_incident_id, { skip: !alert.ai_incident_id });
  const { data: dataSource } = useGetDataSourceQuery(alert.data_source_id!, { skip: !alert.data_source_id });

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Incident & Source */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Incident & Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Incident</Label>
            <p className="font-medium text-sm mt-1">
              {incident ? `#${incident.id} - ${incident.title}` : `#${alert.ai_incident_id}`}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Source Type</Label>
            <p className="font-medium text-sm mt-1">
              {SOURCE_TYPE_LABELS[alert.source_type] || alert.source_type}
            </p>
          </div>
          {alert.data_source_id && (
            <div>
              <Label className="text-xs text-gray-500">Data Source</Label>
              <p className="font-medium text-sm mt-1">
                {dataSource ? dataSource.name : `ID: ${alert.data_source_id}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Details */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Alert Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Alert Sensitivity</Label>
            <div className="mt-1">
              <Badge className={SEVERITY_COLORS[alert.alert_sensitivity]}>
                {SEVERITY_LABELS[alert.alert_sensitivity]}
              </Badge>
            </div>
          </div>
          {alert.source_ref && (
            <div>
              <Label className="text-xs text-gray-500">Source Reference</Label>
              <p className="font-medium text-sm mt-1">{alert.source_ref}</p>
            </div>
          )}
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Context</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">{alert.context}</p>
          </div>
        </div>
      </div>

      {/* Timeline & Evidence */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Timeline & Evidence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">First Seen At</Label>
            <p className="font-medium text-sm mt-1">{formatDateTime(alert.first_seen_at)}</p>
          </div>
          {alert.last_seen_at && (
            <div>
              <Label className="text-xs text-gray-500">Last Seen At</Label>
              <p className="font-medium text-sm mt-1">{formatDateTime(alert.last_seen_at)}</p>
            </div>
          )}
          {alert.evidence_link && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Evidence Link</Label>
              <div className="mt-1">
                <a
                  href={alert.evidence_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                >
                  {alert.evidence_link}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
          <div>
            <Label className="text-xs text-gray-500">Auto Promote Incident</Label>
            <p className="font-medium text-sm mt-1">{alert.auto_promote_incident ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Created At</Label>
            <p className="font-medium text-sm mt-1">{formatDateTime(alert.created_at)}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Alert ID</Label>
            <p className="font-medium text-sm mt-1">#{alert.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentAlertFormReadOnly;

