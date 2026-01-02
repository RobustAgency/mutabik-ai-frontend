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
import type { IncidentNotificationFormData } from "@/lib/schemas/incidentNotification.schema";
import {
  Template,
  Language,
  RegulatoryBasis,
} from "@/app/lib/features/incidentNotificationsApi";

const TEMPLATE_OPTIONS = [
  { value: Template.DPA_BREACH_NOTIFICATION, label: "DPA Breach Notification" },
  { value: Template.DATA_SUBJECT_NOTIFICATION, label: "Data Subject Notification (GDPR Art. 34)" },
  { value: Template.UAE_PDPL_BREACH_NOTIFICATION, label: "UAE PDPL Breach Notification" },
  { value: Template.EXECUTIVE_SUMMARY_TEMPLATE, label: "Executive Summary Template" },
  { value: Template.CUSTOMER_NOTICE_TEMPLATE, label: "Customer Notice Template" },
  { value: Template.PRESS_RELEASE_TEMPLATE, label: "Press Release Template" },
  { value: Template.INTERNAL_ALL_HANDS_TEMPLATE, label: "Internal All Hands Template" },
  { value: Template.CUSTOM_OTHER, label: "Custom/Other" },
];

const LANGUAGE_OPTIONS = [
  { value: Language.ENGLISH, label: "English" },
  { value: Language.ARABIC, label: "Arabic" },
  { value: Language.FRENCH, label: "French" },
  { value: Language.GERMAN, label: "German" },
  { value: Language.SPANISH, label: "Spanish" },
  { value: Language.MULTIPLE, label: "Multiple" },
];

const REGULATORY_BASIS_OPTIONS = [
  { value: RegulatoryBasis.GDPR_ART_33, label: "GDPR Art. 33" },
  { value: RegulatoryBasis.GDPR_ART_34, label: "GDPR Art. 34" },
  { value: RegulatoryBasis.UAE_PDPL, label: "UAE PDPL" },
  { value: RegulatoryBasis.CONTRACTUAL, label: "Contractual" },
  { value: RegulatoryBasis.INTERNAL_POLICY, label: "Internal Policy" },
  { value: RegulatoryBasis.NA, label: "N/A" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentNotificationFormData>();

  const aiIncidentId = watch("ai_incident_id");
  const template = watch("template");
  const language = watch("language");
  const regulatoryBasis = watch("regulatory_basis");
  const notificationDeadline = watch("notification_deadline");

  const { data: incidentsData, isLoading: isIncidentsLoading } =
    useGetAiIncidentsQuery({ per_page: 100 });

  const incidents: AiIncident[] = incidentsData?.data || [];

  const hasError = (
    fieldName: keyof IncidentNotificationFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentNotificationFormData
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

        {/* Template */}
        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select
            key={`template-${template || "none"}`}
            value={template || undefined}
            onValueChange={(value) =>
              setValue(
                "template",
                value === "__none__" ? null : (value as Template),
                { shouldValidate: true }
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {TEMPLATE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("template") && (
            <p className="text-sm text-red-500">{getError("template")}</p>
          )}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            key={`language-${language || "none"}`}
            value={language || undefined}
            onValueChange={(value) =>
              setValue(
                "language",
                value === "__none__" ? null : (value as Language),
                { shouldValidate: true }
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("language") && (
            <p className="text-sm text-red-500">{getError("language")}</p>
          )}
        </div>

        {/* Regulatory Basis */}
        <div className="space-y-2">
          <Label htmlFor="regulatory_basis">Regulatory Basis</Label>
          <Select
            key={`regulatory_basis-${regulatoryBasis || "none"}`}
            value={regulatoryBasis || undefined}
            onValueChange={(value) =>
              setValue(
                "regulatory_basis",
                value === "__none__" ? null : (value as RegulatoryBasis),
                { shouldValidate: true }
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select regulatory basis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {REGULATORY_BASIS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("regulatory_basis") && (
            <p className="text-sm text-red-500">
              {getError("regulatory_basis")}
            </p>
          )}
        </div>

        {/* Notification Deadline */}
        <div className="space-y-2">
          <Label htmlFor="notification_deadline">Notification Deadline</Label>
          <Input
            id="notification_deadline"
            type="date"
            value={formatDateForInput(notificationDeadline)}
            onChange={(e) =>
              setValue("notification_deadline", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={hasError("notification_deadline") ? "border-red-500" : ""}
          />
          {hasError("notification_deadline") && (
            <p className="text-sm text-red-500">
              {getError("notification_deadline")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

