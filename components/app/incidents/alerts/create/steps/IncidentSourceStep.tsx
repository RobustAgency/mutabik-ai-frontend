"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAiIncidentsQuery,
  type AiIncident,
} from "@/app/lib/features/aiIncidentsApi";
import {
  useGetDataSourcesQuery,
  type DataSource,
} from "@/app/lib/features/dataSourcesApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiIncidentModalForm from "@/components/app/incidents/create/AiIncidentModalForm";
import DataSourceModalForm from "@/components/app/dataSources/create/DataSourceModalForm";
import type { IncidentAlertFormData } from "@/lib/schemas/incidentAlert.schema";
import { AlertSourceType } from "@/app/lib/features/incidentAlertsApi";

const SOURCE_TYPE_OPTIONS = [
  { value: AlertSourceType.MONITORING_RULE, label: "Monitoring Rule" },
  { value: AlertSourceType.KRI_THRESHOLD, label: "KRI Threshold" },
  { value: AlertSourceType.MANUAL_REPORT, label: "Manual Report" },
  { value: AlertSourceType.AUTOMATED_SCAN, label: "Automated Scan" },
  { value: AlertSourceType.USER_COMPLAINT, label: "User Complaint" },
  { value: AlertSourceType.EXTERNAL_REPORT, label: "External Report" },
];

export const IncidentSourceStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentAlertFormData>();

  const aiIncidentId = watch("ai_incident_id");
  const sourceType = watch("source_type");
  const dataSourceId = watch("data_source_id");

  const { data: incidentsData, isLoading: isIncidentsLoading } =
    useGetAiIncidentsQuery({ per_page: 100 });
  const { data: dataSourcesData, isLoading: isDataSourcesLoading } =
    useGetDataSourcesQuery({ per_page: 100 });

  const incidents: AiIncident[] = incidentsData?.data || [];
  const dataSources: DataSource[] = dataSourcesData?.data || [];

  const hasError = (fieldName: keyof IncidentAlertFormData): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentAlertFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Incident & Source Information <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Incident */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="ai_incident_id">
            Incident <span className="text-red-500">*</span>
          </Label>
          <SelectWithInlineCreate
            key={`ai_incident_id-${aiIncidentId || "none"}`}
            value={aiIncidentId ? String(aiIncidentId) : ""}
            onValueChange={(value) =>
              setValue("ai_incident_id", Number(value), {
                shouldValidate: true,
              })
            }
            placeholder={
              isIncidentsLoading ? "Loading incidents..." : "Select incident"
            }
            options={incidents.map((incident: AiIncident) => ({
              id: incident.id,
              label: `#${incident.id} - ${incident.title}`,
              value: String(incident.id),
            }))}
            isLoading={isIncidentsLoading}
            isEmpty={!isIncidentsLoading && incidents.length === 0}
            entityName="Incident"
            canCreate={true}
            modalForm={AiIncidentModalForm}
            error={hasError("ai_incident_id")}
          />
          {hasError("ai_incident_id") && (
            <p className="text-sm text-red-500">{getError("ai_incident_id")}</p>
          )}
        </div>

        {/* Source Type */}
        <div className="space-y-2">
          <Label htmlFor="source_type">
            Source Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`source_type-${sourceType || "none"}`}
            value={sourceType || ""}
            onValueChange={(value) =>
              setValue("source_type", value as AlertSourceType, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("source_type")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("source_type") && (
            <p className="text-sm text-red-500">{getError("source_type")}</p>
          )}
        </div>

        {/* Data Source */}
        <div className="space-y-2">
          <Label htmlFor="data_source_id">Data Source</Label>
          <SelectWithInlineCreate
            key={`data_source_id-${dataSourceId || "none"}`}
            value={dataSourceId ? String(dataSourceId) : ""}
            onValueChange={(value) => {
              // Empty string means no selection (null)
              setValue("data_source_id", value === "" ? null : Number(value), {
                shouldValidate: true,
              });
            }}
            placeholder={
              isDataSourcesLoading
                ? "Loading data sources..."
                : "Select data source (optional)"
            }
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
            error={hasError("data_source_id")}
          />
          {hasError("data_source_id") && (
            <p className="text-sm text-red-500">{getError("data_source_id")}</p>
          )}
        </div>
      </div>
    </div>
  );
};
