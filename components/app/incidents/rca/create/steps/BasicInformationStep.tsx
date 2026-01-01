"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAiIncidentsQuery, type AiIncident } from "@/app/lib/features/aiIncidentsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiIncidentModalForm from "@/components/app/incidents/create/AiIncidentModalForm";
import type { IncidentRootCauseAnalysisFormData } from "@/lib/schemas/incidentRootCauseAnalysis.schema";
import { RcaMethod } from "@/app/lib/features/incidentRootCauseAnalysesApi";

const RCA_METHOD_OPTIONS = [
  { value: RcaMethod.FIVE_WHYS, label: "5 Whys" },
  { value: RcaMethod.FISHBONE, label: "Fishbone" },
  { value: RcaMethod.FAULT_TREE, label: "Fault Tree" },
  { value: RcaMethod.EVENT_CAUSAL, label: "Event Causal" },
  { value: RcaMethod.CHANGE, label: "Change" },
  { value: RcaMethod.TIMELINE, label: "Timeline" },
  { value: RcaMethod.BARRIER, label: "Barrier" },
  { value: RcaMethod.COMBINED, label: "Combined" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentRootCauseAnalysisFormData>();

  const aiIncidentId = watch("ai_incident_id");
  const rcaMethod = watch("rca_method");
  const analysisDate = watch("analysis_date");

  const { data: incidentsData, isLoading: isIncidentsLoading } =
    useGetAiIncidentsQuery({ per_page: 100 });

  const incidents: AiIncident[] = incidentsData?.data || [];

  const hasError = (
    fieldName: keyof IncidentRootCauseAnalysisFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentRootCauseAnalysisFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  // Format date for input field
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Basic Information <span className="text-red-500">*</span>
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

        {/* RCA Method */}
        <div className="space-y-2">
          <Label htmlFor="rca_method">
            RCA Method <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`rca_method-${rcaMethod || "none"}`}
            value={rcaMethod || ""}
            onValueChange={(value) =>
              setValue("rca_method", value as RcaMethod, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("rca_method")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select RCA method" />
            </SelectTrigger>
            <SelectContent>
              {RCA_METHOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("rca_method") && (
            <p className="text-sm text-red-500">{getError("rca_method")}</p>
          )}
        </div>

        {/* Analysis Date */}
        <div className="space-y-2">
          <Label htmlFor="analysis_date">Analysis Date</Label>
          <Input
            id="analysis_date"
            type="date"
            value={formatDateForInput(analysisDate)}
            onChange={(e) =>
              setValue("analysis_date", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={hasError("analysis_date") ? "border-red-500" : ""}
          />
          {hasError("analysis_date") && (
            <p className="text-sm text-red-500">{getError("analysis_date")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

