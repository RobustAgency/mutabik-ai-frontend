"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  type IncidentNotification,
  Template,
  Language,
  RegulatoryBasis,
  AudienceType,
  Channel,
  DeliveryStatus,
} from "@/app/lib/features/incidentNotificationsApi";
import { useGetAiIncidentQuery } from "@/app/lib/features/aiIncidentsApi";

interface IncidentNotificationFormReadOnlyProps {
  notification: IncidentNotification;
}

const TEMPLATE_LABELS: Record<Template, string> = {
  [Template.DPA_BREACH_NOTIFICATION]: "DPA Breach Notification",
  [Template.DATA_SUBJECT_NOTIFICATION]: "Data Subject Notification (GDPR Art. 34)",
  [Template.UAE_PDPL_BREACH_NOTIFICATION]: "UAE PDPL Breach Notification",
  [Template.EXECUTIVE_SUMMARY_TEMPLATE]: "Executive Summary Template",
  [Template.CUSTOMER_NOTICE_TEMPLATE]: "Customer Notice Template",
  [Template.PRESS_RELEASE_TEMPLATE]: "Press Release Template",
  [Template.INTERNAL_ALL_HANDS_TEMPLATE]: "Internal All Hands Template",
  [Template.CUSTOM_OTHER]: "Custom/Other",
};

const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.ENGLISH]: "English",
  [Language.ARABIC]: "Arabic",
  [Language.FRENCH]: "French",
  [Language.GERMAN]: "German",
  [Language.SPANISH]: "Spanish",
  [Language.MULTIPLE]: "Multiple",
};

const REGULATORY_BASIS_LABELS: Record<RegulatoryBasis, string> = {
  [RegulatoryBasis.GDPR_ART_33]: "GDPR Art. 33",
  [RegulatoryBasis.GDPR_ART_34]: "GDPR Art. 34",
  [RegulatoryBasis.UAE_PDPL]: "UAE PDPL",
  [RegulatoryBasis.CONTRACTUAL]: "Contractual",
  [RegulatoryBasis.INTERNAL_POLICY]: "Internal Policy",
  [RegulatoryBasis.NA]: "N/A",
};

const AUDIENCE_TYPE_LABELS: Record<AudienceType, string> = {
  [AudienceType.INTERNAL_EXECUTIVE]: "Internal Executive",
  [AudienceType.INTERNAL_TECHNICAL]: "Internal Technical",
  [AudienceType.DATA_PROTECTION_AUTHORITY]: "Data Protection Authority",
  [AudienceType.AFFECTED_DATA_SUBJECTS]: "Affected Data Subjects",
  [AudienceType.EXTERNAL_PARTNERS]: "External Partners",
  [AudienceType.MEDIA_PUBLIC]: "Media/Public",
  [AudienceType.BOARD_AUDIT_COMMITTEE]: "Board/Audit Committee",
  [AudienceType.LEGAL_COMPLIANCE]: "Legal/Compliance",
};

const CHANNEL_LABELS: Record<Channel, string> = {
  [Channel.EMAIL]: "Email",
  [Channel.SMS]: "SMS",
  [Channel.PORTAL_NOTIFICATION]: "Portal Notification",
  [Channel.SLACK_TEAMS]: "Slack/Teams",
  [Channel.FORMAL_LETTER]: "Formal Letter",
  [Channel.PRESS_RELEASE]: "Press Release",
  [Channel.REGULATORY_FILING]: "Regulatory Filing",
};

const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  [DeliveryStatus.DRAFT]: "Draft",
  [DeliveryStatus.SENT]: "Sent",
  [DeliveryStatus.DELIVERED]: "Delivered",
  [DeliveryStatus.ACKNOWLEDGED]: "Acknowledged",
  [DeliveryStatus.FAILED]: "Failed",
};

const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  [DeliveryStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [DeliveryStatus.SENT]: "bg-blue-100 text-blue-800",
  [DeliveryStatus.DELIVERED]: "bg-green-100 text-green-800",
  [DeliveryStatus.ACKNOWLEDGED]: "bg-purple-100 text-purple-800",
  [DeliveryStatus.FAILED]: "bg-red-100 text-red-800",
};

const IncidentNotificationFormReadOnly: React.FC<
  IncidentNotificationFormReadOnlyProps
> = ({ notification }) => {
  const { data: incident } = useGetAiIncidentQuery(notification.ai_incident_id, {
    skip: !notification.ai_incident_id,
  });

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Incident</Label>
            <p className="font-medium text-sm mt-1">
              {incident ? (
                <Link
                  href={`/governance/incidents/${incident.id}/details`}
                  className="text-[#4FD58F] hover:underline"
                >
                  #{incident.id} - {incident.title}
                </Link>
              ) : (
                `#${notification.ai_incident_id}`
              )}
            </p>
          </div>
          {notification.template && (
            <div>
              <Label className="text-xs text-gray-500">Template</Label>
              <p className="font-medium text-sm mt-1">
                {TEMPLATE_LABELS[notification.template]}
              </p>
            </div>
          )}
          {notification.language && (
            <div>
              <Label className="text-xs text-gray-500">Language</Label>
              <p className="font-medium text-sm mt-1">
                {LANGUAGE_LABELS[notification.language]}
              </p>
            </div>
          )}
          {notification.regulatory_basis && (
            <div>
              <Label className="text-xs text-gray-500">Regulatory Basis</Label>
              <p className="font-medium text-sm mt-1">
                {REGULATORY_BASIS_LABELS[notification.regulatory_basis]}
              </p>
            </div>
          )}
          {notification.notification_deadline && (
            <div>
              <Label className="text-xs text-gray-500">Notification Deadline</Label>
              <p className="font-medium text-sm mt-1">
                {formatDate(notification.notification_deadline)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Details */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Notification Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Audience Type</Label>
            <p className="font-medium text-sm mt-1">
              {AUDIENCE_TYPE_LABELS[notification.audience_type]}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Channel</Label>
            <p className="font-medium text-sm mt-1">
              {CHANNEL_LABELS[notification.channel]}
            </p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs text-gray-500">Notice Summary</Label>
            <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
              {notification.notice_summary}
            </p>
          </div>
          {notification.notice_link && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Notice Link</Label>
              <div className="mt-1">
                <a
                  href={notification.notice_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
                >
                  {notification.notice_link}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delivery & Status */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Delivery & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Sent At</Label>
            <p className="font-medium text-sm mt-1">
              {formatDateTime(notification.sent_at)}
            </p>
          </div>
          {notification.sent_by && (
            <div>
              <Label className="text-xs text-gray-500">Sent By</Label>
              <p className="font-medium text-sm mt-1">{notification.sent_by}</p>
            </div>
          )}
          <div>
            <Label className="text-xs text-gray-500">Delivery Status</Label>
            <div className="mt-1">
              <Badge className={DELIVERY_STATUS_COLORS[notification.delivery_status]}>
                {DELIVERY_STATUS_LABELS[notification.delivery_status]}
              </Badge>
            </div>
          </div>
          {notification.response_summary && (
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-500">Response Summary</Label>
              <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                {notification.response_summary}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Follow Up */}
      {notification.follow_up_required && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-sm text-gray-700">Follow Up</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Follow Up Required</Label>
              <p className="font-medium text-sm mt-1">Yes</p>
            </div>
            {notification.follow_up_date && (
              <div>
                <Label className="text-xs text-gray-500">Follow Up Date</Label>
                <p className="font-medium text-sm mt-1">
                  {formatDate(notification.follow_up_date)}
                </p>
              </div>
            )}
            {notification.follow_up_notes && (
              <div className="md:col-span-2">
                <Label className="text-xs text-gray-500">Follow Up Notes</Label>
                <p className="font-medium text-sm mt-1 whitespace-pre-wrap">
                  {notification.follow_up_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-gray-500">Notification ID</Label>
            <p className="font-medium text-sm mt-1">
              {notification.display_id || `#${notification.id}`}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Created At</Label>
            <p className="font-medium text-sm mt-1">
              {formatDateTime(notification.created_at)}
            </p>
          </div>
          {notification.updated_at && (
            <div>
              <Label className="text-xs text-gray-500">Updated At</Label>
              <p className="font-medium text-sm mt-1">
                {formatDateTime(notification.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentNotificationFormReadOnly;

