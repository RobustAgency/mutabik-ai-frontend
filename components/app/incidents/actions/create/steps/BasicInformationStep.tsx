"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type { IncidentActionFormData } from "@/lib/schemas/incidentAction.schema";
import { ActionType } from "@/app/lib/features/incidentActionsApi";

const ACTION_TYPE_OPTIONS = [
  { value: ActionType.KILL_SWITCH, label: "Kill Switch" },
  { value: ActionType.MODEL_ROLLBACK, label: "Model Rollback" },
  { value: ActionType.DATA_ISOLATION, label: "Data Isolation" },
  { value: ActionType.ACCESS_REVOCATION, label: "Access Revocation" },
  { value: ActionType.SYSTEM_PATCH, label: "System Patch" },
  { value: ActionType.CONFIGURATION_CHANGE, label: "Configuration Change" },
  { value: ActionType.COMMUNICATION_NOTIFICATION, label: "Communication/Notification" },
  { value: ActionType.INVESTIGATION, label: "Investigation" },
  { value: ActionType.CONTAINMENT, label: "Containment" },
  { value: ActionType.ERADICATION, label: "Eradication" },
  { value: ActionType.RECOVERY, label: "Recovery" },
  { value: ActionType.DOCUMENTATION, label: "Documentation" },
  { value: ActionType.OTHER, label: "Other" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentActionFormData>();

  const aiIncidentId = watch("ai_incident_id");
  const actionType = watch("action_type");
  const description = watch("description");

  const { data: incidentsData, isLoading: isIncidentsLoading } =
    useGetAiIncidentsQuery({ per_page: 100 });

  const incidents: AiIncident[] = incidentsData?.data || [];

  const hasError = (fieldName: keyof IncidentActionFormData): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
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

        {/* Action Type */}
        <div className="space-y-2">
          <Label htmlFor="action_type">
            Action Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`action_type-${actionType || "none"}`}
            value={actionType || ""}
            onValueChange={(value) =>
              setValue("action_type", value as ActionType, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("action_type")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent>
              {ACTION_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("action_type") && (
            <p className="text-sm text-red-500">{getError("action_type")}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={description || ""}
            onChange={(e) =>
              setValue("description", e.target.value, { shouldValidate: true })
            }
            placeholder="Detailed description of the action taken"
            className={`min-h-32 resize-none ${
              hasError("description") ? "border-red-500" : ""
            }`}
          />
          {hasError("description") && (
            <p className="text-sm text-red-500">{getError("description")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

