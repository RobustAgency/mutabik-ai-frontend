"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IncidentNotificationFormData } from "@/lib/schemas/incidentNotification.schema";
import {
  AudienceType,
  Channel,
} from "@/app/lib/features/incidentNotificationsApi";

const AUDIENCE_TYPE_OPTIONS = [
  { value: AudienceType.INTERNAL_EXECUTIVE, label: "Internal Executive" },
  { value: AudienceType.INTERNAL_TECHNICAL, label: "Internal Technical" },
  { value: AudienceType.DATA_PROTECTION_AUTHORITY, label: "Data Protection Authority" },
  { value: AudienceType.AFFECTED_DATA_SUBJECTS, label: "Affected Data Subjects" },
  { value: AudienceType.EXTERNAL_PARTNERS, label: "External Partners" },
  { value: AudienceType.MEDIA_PUBLIC, label: "Media/Public" },
  { value: AudienceType.BOARD_AUDIT_COMMITTEE, label: "Board/Audit Committee" },
  { value: AudienceType.LEGAL_COMPLIANCE, label: "Legal/Compliance" },
];

const CHANNEL_OPTIONS = [
  { value: Channel.EMAIL, label: "Email" },
  { value: Channel.SMS, label: "SMS" },
  { value: Channel.PORTAL_NOTIFICATION, label: "Portal Notification" },
  { value: Channel.SLACK_TEAMS, label: "Slack/Teams" },
  { value: Channel.FORMAL_LETTER, label: "Formal Letter" },
  { value: Channel.PRESS_RELEASE, label: "Press Release" },
  { value: Channel.REGULATORY_FILING, label: "Regulatory Filing" },
];

export const NotificationDetailsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentNotificationFormData>();

  const audienceType = watch("audience_type");
  const channel = watch("channel");
  const noticeSummary = watch("notice_summary");
  const noticeLink = watch("notice_link");

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

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Notification Details <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audience Type */}
        <div className="space-y-2">
          <Label htmlFor="audience_type">
            Audience Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`audience_type-${audienceType || "none"}`}
            value={audienceType || ""}
            onValueChange={(value) =>
              setValue("audience_type", value as AudienceType, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("audience_type")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select audience type" />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("audience_type") && (
            <p className="text-sm text-red-500">{getError("audience_type")}</p>
          )}
        </div>

        {/* Channel */}
        <div className="space-y-2">
          <Label htmlFor="channel">
            Channel <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`channel-${channel || "none"}`}
            value={channel || ""}
            onValueChange={(value) =>
              setValue("channel", value as Channel, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("channel")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {CHANNEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("channel") && (
            <p className="text-sm text-red-500">{getError("channel")}</p>
          )}
        </div>

        {/* Notice Summary */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notice_summary">
            Notice Summary <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="notice_summary"
            value={noticeSummary || ""}
            onChange={(e) =>
              setValue("notice_summary", e.target.value, {
                shouldValidate: true,
              })
            }
            placeholder="Summary of the notification content"
            className={`min-h-32 resize-none ${
              hasError("notice_summary") ? "border-red-500" : ""
            }`}
          />
          {hasError("notice_summary") && (
            <p className="text-sm text-red-500">{getError("notice_summary")}</p>
          )}
        </div>

        {/* Notice Link */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notice_link">Notice Link</Label>
          <Input
            id="notice_link"
            type="url"
            value={noticeLink || ""}
            onChange={(e) =>
              setValue("notice_link", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="https://example.com/notice"
            className={hasError("notice_link") ? "border-red-500" : ""}
          />
          {hasError("notice_link") && (
            <p className="text-sm text-red-500">{getError("notice_link")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

