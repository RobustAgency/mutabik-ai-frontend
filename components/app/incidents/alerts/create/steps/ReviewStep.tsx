"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { IncidentAlertFormData } from "@/lib/schemas/incidentAlert.schema";
import { AlertSourceType, AlertSeverity } from "@/app/lib/features/incidentAlertsApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";

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

export const ReviewStep: React.FC = () => {
  const {
    watch,
    setValue,
  } = useFormContext<IncidentAlertFormData>();

  const formData = watch();
  const autoPromote = watch("auto_promote_incident");

  const { data: incidentsData } = useGetAiIncidentsQuery({ per_page: 100 });
  const { data: dataSourcesData } = useGetDataSourcesQuery({ per_page: 100 });

  const incidents = incidentsData?.data || [];
  const dataSources = dataSourcesData?.data || [];

  const selectedIncident = incidents.find((inc: any) => inc.id === formData.ai_incident_id);
  const selectedDataSource = dataSources.find((ds) => ds.id === formData.data_source_id);

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Review & Submit
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-6">
        {/* Incident & Source */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-sm text-gray-700">Incident & Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Incident:</span>
              <p className="font-medium">
                {selectedIncident ? `#${selectedIncident.id} - ${selectedIncident.title}` : "Not selected"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Source Type:</span>
              <p className="font-medium">
                {formData.source_type ? SOURCE_TYPE_LABELS[formData.source_type] : "Not selected"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Data Source:</span>
              <p className="font-medium">
                {selectedDataSource ? selectedDataSource.name : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Details */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-sm text-gray-700">Alert Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Alert Sensitivity:</span>
              <p className="font-medium">
                {formData.alert_sensitivity
                  ? SEVERITY_LABELS[formData.alert_sensitivity]
                  : "Not selected"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Source Reference:</span>
              <p className="font-medium">{formData.source_ref || "Not specified"}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500">Context:</span>
              <p className="font-medium mt-1 whitespace-pre-wrap">{formData.context || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* Timeline & Evidence */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-sm text-gray-700">Timeline & Evidence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">First Seen At:</span>
              <p className="font-medium">{formatDateTime(formData.first_seen_at)}</p>
            </div>
            <div>
              <span className="text-gray-500">Last Seen At:</span>
              <p className="font-medium">{formatDateTime(formData.last_seen_at)}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500">Evidence Link:</span>
              <p className="font-medium break-all">
                {formData.evidence_link || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Auto Promote */}
        <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto_promote_incident"
              checked={autoPromote || false}
              onCheckedChange={(checked) =>
                setValue("auto_promote_incident", checked as boolean, { shouldValidate: true })
              }
            />
            <Label
              htmlFor="auto_promote_incident"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Auto Promote Incident
            </Label>
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Automatically promote this alert to an incident if certain conditions are met
          </p>
        </div>
      </div>
    </div>
  );
};

