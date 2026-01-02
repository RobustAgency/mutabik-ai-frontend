"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { IncidentAlertFormData } from "@/lib/schemas/incidentAlert.schema";

export const TimelineEvidenceStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentAlertFormData>();

  const firstSeenAt = watch("first_seen_at");
  const lastSeenAt = watch("last_seen_at");
  const evidenceLink = watch("evidence_link");
  const autoPromote = watch("auto_promote_incident");

  const hasError = (fieldName: keyof IncidentAlertFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof IncidentAlertFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Timeline & Evidence
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Seen At */}
        <div className="space-y-2">
          <Label htmlFor="first_seen_at">
            First Seen At <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_seen_at"
            type="datetime-local"
            value={firstSeenAt || ""}
            onChange={(e) => setValue("first_seen_at", e.target.value, { shouldValidate: true })}
            className={hasError("first_seen_at") ? "border-red-500" : ""}
          />
          {hasError("first_seen_at") && (
            <p className="text-sm text-red-500">{getError("first_seen_at")}</p>
          )}
        </div>

        {/* Last Seen At */}
        <div className="space-y-2">
          <Label htmlFor="last_seen_at">Last Seen At</Label>
          <Input
            id="last_seen_at"
            type="datetime-local"
            value={lastSeenAt || ""}
            onChange={(e) =>
              setValue("last_seen_at", e.target.value || null, { shouldValidate: true })
            }
            className={hasError("last_seen_at") ? "border-red-500" : ""}
          />
          <p className="text-xs text-[#667085]">Last occurrence before containment</p>
          {hasError("last_seen_at") && (
            <p className="text-sm text-red-500">{getError("last_seen_at")}</p>
          )}
        </div>

        {/* Evidence Link */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="evidence_link">Evidence Link</Label>
          <Input
            id="evidence_link"
            type="url"
            value={evidenceLink || ""}
            onChange={(e) =>
              setValue("evidence_link", e.target.value || null, { shouldValidate: true })
            }
            placeholder="https://example.com/logs"
            className={hasError("evidence_link") ? "border-red-500" : ""}
          />
          {hasError("evidence_link") && (
            <p className="text-sm text-red-500">{getError("evidence_link")}</p>
          )}
        </div>

        {/* Auto Promote */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
            <Checkbox
              id="auto_promote_incident"
              checked={autoPromote || false}
              onCheckedChange={(checked) =>
                setValue("auto_promote_incident", checked as boolean, { shouldValidate: true })
              }
            />
            <Label
              htmlFor="auto_promote_incident"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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

