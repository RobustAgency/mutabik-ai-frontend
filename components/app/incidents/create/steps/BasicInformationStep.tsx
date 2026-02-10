"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiIncidentFormData } from "@/lib/schemas/aiIncident.schema";
import {
  IncidentType,
  Domain,
  IncidentSeverity,
  IncidentStatus,
  ResponseTeam,
} from "@/app/lib/features/aiIncidentsApi";

const INCIDENT_TYPE_OPTIONS = [
  { value: IncidentType.AI_MODEL_FAILURE, label: "AI Model Failure" },
  { value: IncidentType.AI_BIAS_FAIRNESS_ISSUE, label: "AI Bias/Fairness Issue" },
  { value: IncidentType.AI_SAFETY_VIOLATION, label: "AI Safety Violation" },
  { value: IncidentType.AI_HALLUCINATION_MISINFORMATION, label: "AI Hallucination/Misinformation" },
  { value: IncidentType.DATA_BREACH, label: "Data Breach" },
  { value: IncidentType.PRIVACY_VIOLATION, label: "Privacy Violation" },
  { value: IncidentType.CONSENT_VIOLATION, label: "Consent Violation" },
  { value: IncidentType.DATA_QUALITY_ISSUE, label: "Data Quality Issue" },
  { value: IncidentType.UNAUTHORIZED_ACCESS, label: "Unauthorized Access" },
  { value: IncidentType.DATA_LOSS, label: "Data Loss" },
  { value: IncidentType.CROSS_BORDER_TRANSFER_VIOLATION, label: "Cross-Border Transfer Violation" },
  { value: IncidentType.REGULATORY_NON_COMPLIANCE, label: "Regulatory Non-Compliance" },
  { value: IncidentType.SYSTEM_OUTAGE, label: "System Outage" },
  { value: IncidentType.PERFORMANCE_DEGRADATION, label: "Performance Degradation" },
  { value: IncidentType.SECURITY_INCIDENT, label: "Security Incident" },
  { value: IncidentType.THIRD_PARTY_VENDOR_ISSUE, label: "Third Party Vendor Issue" },
  { value: IncidentType.OTHER, label: "Other" },
];

const DOMAIN_OPTIONS = [
  { value: Domain.AI_GOVERNANCE, label: "AI Governance" },
  { value: Domain.DATA_PRIVACY, label: "Data Privacy" },
  { value: Domain.DATA_GOVERNANCE, label: "Data Governance" },
  { value: Domain.INFORMATION_SECURITY, label: "Information Security" },
  { value: Domain.MULTIPLE_DOMAINS, label: "Multiple Domains" },
];

const SEVERITY_OPTIONS = [
  { value: IncidentSeverity.SEV1_CRITICAL, label: "Sev1 Critical" },
  { value: IncidentSeverity.SEV2_HIGH, label: "Sev2 High" },
  { value: IncidentSeverity.SEV3_MEDIUM, label: "Sev3 Medium" },
  { value: IncidentSeverity.SEV4_LOW, label: "Sev4 Low" },
];

const STATUS_OPTIONS = [
  { value: IncidentStatus.OPEN, label: "Open" },
  { value: IncidentStatus.INVESTIGATING, label: "Investigating" },
  { value: IncidentStatus.CONTAINED, label: "Contained" },
  { value: IncidentStatus.MITIGATED, label: "Mitigated" },
  { value: IncidentStatus.RESOLVED, label: "Resolved" },
  { value: IncidentStatus.CLOSED, label: "Closed" },
  { value: IncidentStatus.REOPENED, label: "Reopened" },
];

const RESPONSE_TEAM_OPTIONS = [
  { value: ResponseTeam.AI_GOVERNANCE, label: "AI Governance" },
  { value: ResponseTeam.DATA_PRIVACY_OFFICE, label: "Data Privacy Office" },
  { value: ResponseTeam.DATA_GOVERNANCE, label: "Data Governance" },
  { value: ResponseTeam.ML_ENGINEERING, label: "ML Engineering" },
  { value: ResponseTeam.DATA_ENGINEERING, label: "Data Engineering" },
  { value: ResponseTeam.INFORMATION_SECURITY, label: "Information Security" },
  { value: ResponseTeam.LEGAL, label: "Legal" },
  { value: ResponseTeam.COMPLIANCE, label: "Compliance" },
  { value: ResponseTeam.EXECUTIVE_LEADERSHIP, label: "Executive Leadership" },
  { value: ResponseTeam.PRODUCT, label: "Product" },
  { value: ResponseTeam.CUSTOMER_SUCCESS, label: "Customer Success" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AiIncidentFormData>();

  const hasError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              className={hasError("title") ? "border-destructive" : ""}
              placeholder="Short, descriptive incident name"
            />
            {getError("title") && (
              <p className="text-sm text-destructive">{getError("title")}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">
              Summary <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="summary"
              {...register("summary")}
              className={`min-h-32 resize-none ${hasError("summary") ? "border-destructive" : ""}`}
              placeholder="Brief narrative of what happened and current impact"
            />
            {getError("summary") && (
              <p className="text-sm text-destructive">{getError("summary")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident_type">
              Incident Type <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`incident_type-${watch("incident_type") || "none"}`}
              value={watch("incident_type")}
              onValueChange={(value) => setValue("incident_type", value as IncidentType)}
            >
              <SelectTrigger className={`w-full ${hasError("incident_type") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("incident_type") && (
              <p className="text-sm text-destructive">{getError("incident_type")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">
              Domain <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`domain-${watch("domain") || "none"}`}
              value={watch("domain")}
              onValueChange={(value) => setValue("domain", value as Domain)}
            >
              <SelectTrigger className={`w-full ${hasError("domain") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("domain") && (
              <p className="text-sm text-destructive">{getError("domain")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">
              Severity <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`severity-${watch("severity") || "none"}`}
              value={watch("severity")}
              onValueChange={(value) => setValue("severity", value as IncidentSeverity)}
            >
              <SelectTrigger className={`w-full ${hasError("severity") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("severity") && (
              <p className="text-sm text-destructive">{getError("severity")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`status-${watch("status") || "none"}`}
              value={watch("status")}
              onValueChange={(value) => setValue("status", value as IncidentStatus)}
            >
              <SelectTrigger className={`w-full ${hasError("status") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("status") && (
              <p className="text-sm text-destructive">{getError("status")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident_commander">
              Incident Commander <span className="text-red-500">*</span>
            </Label>
            <Input
              id="incident_commander"
              {...register("incident_commander")}
              className={hasError("incident_commander") ? "border-destructive" : ""}
              placeholder="Name of assigned commander"
            />
            {getError("incident_commander") && (
              <p className="text-sm text-destructive">{getError("incident_commander")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="response_team">
              Response Team <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`response_team-${watch("response_team") || "none"}`}
              value={watch("response_team")}
              onValueChange={(value) => setValue("response_team", value as ResponseTeam)}
            >
              <SelectTrigger className={`w-full ${hasError("response_team") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("response_team") && (
              <p className="text-sm text-destructive">{getError("response_team")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

