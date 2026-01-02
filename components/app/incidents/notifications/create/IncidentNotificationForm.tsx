"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreateIncidentNotificationData,
  AudienceType,
  Channel,
  DeliveryStatus
} from "@/app/lib/features/incidentNotificationsApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiIncidentModalForm from "@/components/app/incidents/create/AiIncidentModalForm";

interface IncidentNotificationFormProps {
  formData: CreateIncidentNotificationData;
  setFormData: React.Dispatch<React.SetStateAction<CreateIncidentNotificationData>>;
  errors: Record<string, string[]>;
}

const IncidentNotificationForm: React.FC<IncidentNotificationFormProps> = ({ formData, setFormData, errors }) => {
  const { data: incidentsData, isLoading: isIncidentsLoading } = useGetAiIncidentsQuery({ per_page: 100 });
  const incidents = incidentsData?.data || [];

  const handleInputChange = (field: keyof CreateIncidentNotificationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isExternalAudience = [
    AudienceType.DATA_PROTECTION_AUTHORITY,
    AudienceType.AFFECTED_DATA_SUBJECTS,
    AudienceType.EXTERNAL_PARTNERS,
    AudienceType.MEDIA_PUBLIC,
  ].includes(formData.audience_type);

  return (
    <div className="space-y-4">
      {isExternalAudience && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
          <strong>External Communication:</strong> This notification requires approval before sending.
        </div>
      )}

      <div className="space-y-2">
        <Label>Incident <span className="text-red-500">*</span></Label>
        <SelectWithInlineCreate
          key={`ai_incident_id-${formData.ai_incident_id || "none"}`}
          value={formData.ai_incident_id ? String(formData.ai_incident_id) : ""}
          onValueChange={(value) => handleInputChange("ai_incident_id", Number(value))}
          placeholder={isIncidentsLoading ? "Loading incidents..." : "Select incident"}
          options={incidents.map((incident: any) => ({ id: incident.id, label: `#${incident.id} - ${incident.title}`, value: String(incident.id) }))}
          isLoading={isIncidentsLoading}
          isEmpty={!isIncidentsLoading && incidents.length === 0}
          entityName="Incident"
          canCreate={true}
          modalForm={AiIncidentModalForm}
          error={!!errors.ai_incident_id}
        />
        {errors.ai_incident_id && (
          <p className="text-sm text-destructive">{errors.ai_incident_id[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Audience Type <span className="text-red-500">*</span></Label>
        <Select key={`audience_type-${formData.audience_type || "none"}`} value={formData.audience_type} onValueChange={(value) => handleInputChange("audience_type", value as AudienceType)}>
          <SelectTrigger className={`w-full ${errors.audience_type ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AudienceType.INTERNAL_EXECUTIVE}>Internal Executive</SelectItem>
            <SelectItem value={AudienceType.INTERNAL_TECHNICAL}>Internal Technical</SelectItem>
            <SelectItem value={AudienceType.DATA_PROTECTION_AUTHORITY}>Data Protection Authority</SelectItem>
            <SelectItem value={AudienceType.AFFECTED_DATA_SUBJECTS}>Affected Data Subjects</SelectItem>
            <SelectItem value={AudienceType.EXTERNAL_PARTNERS}>External Partners</SelectItem>
            <SelectItem value={AudienceType.MEDIA_PUBLIC}>Media/Public</SelectItem>
            <SelectItem value={AudienceType.BOARD_AUDIT_COMMITTEE}>Board/Audit Committee</SelectItem>
            <SelectItem value={AudienceType.LEGAL_COMPLIANCE}>Legal/Compliance</SelectItem>
          </SelectContent>
        </Select>
        {errors.audience_type && (
          <p className="text-sm text-destructive">{errors.audience_type[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Channel <span className="text-red-500">*</span></Label>
        <Select key={`channel-${formData.channel || "none"}`} value={formData.channel} onValueChange={(value) => handleInputChange("channel", value as Channel)}>
          <SelectTrigger className={`w-full ${errors.channel ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Channel.EMAIL}>Email</SelectItem>
            <SelectItem value={Channel.SMS}>SMS</SelectItem>
            <SelectItem value={Channel.PORTAL_NOTIFICATION}>Portal Notification</SelectItem>
            <SelectItem value={Channel.SLACK_TEAMS}>Slack/Teams</SelectItem>
            <SelectItem value={Channel.FORMAL_LETTER}>Formal Letter</SelectItem>
            <SelectItem value={Channel.PRESS_RELEASE}>Press Release</SelectItem>
            <SelectItem value={Channel.REGULATORY_FILING}>Regulatory Filing</SelectItem>
          </SelectContent>
        </Select>
        {errors.channel && (
          <p className="text-sm text-destructive">{errors.channel[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Notice Summary <span className="text-red-500">*</span></Label>
        <Textarea required value={formData.notice_summary} onChange={(e) => handleInputChange("notice_summary", e.target.value)} className="min-h-32 resize-none" />
        {errors.notice_summary && (
          <p className="text-sm text-destructive">{errors.notice_summary[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Notice Link</Label>
        <Input type="url" value={formData.notice_link || ""} onChange={(e) => handleInputChange("notice_link", e.target.value || null)} />
      </div>

      <div className="space-y-2">
        <Label>Sent At <span className="text-red-500">*</span></Label>
        <Input type="datetime-local" value={formData.sent_at} onChange={(e) => handleInputChange("sent_at", e.target.value)} />
        {errors.sent_at && (
          <p className="text-sm text-destructive">{errors.sent_at[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Sent By</Label>
        <Input value={formData.sent_by || ""} onChange={(e) => handleInputChange("sent_by", e.target.value || null)} />
      </div>

      <div className="space-y-2">
        <Label>Delivery Status <span className="text-red-500">*</span></Label>
        <Select key={`delivery_status-${formData.delivery_status || "none"}`} value={formData.delivery_status} onValueChange={(value) => handleInputChange("delivery_status", value as DeliveryStatus)}>
          <SelectTrigger className={`w-full ${errors.delivery_status ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DeliveryStatus.DRAFT}>Draft</SelectItem>
            <SelectItem value={DeliveryStatus.SENT}>Sent</SelectItem>
            <SelectItem value={DeliveryStatus.DELIVERED}>Delivered</SelectItem>
            <SelectItem value={DeliveryStatus.ACKNOWLEDGED}>Acknowledged</SelectItem>
            <SelectItem value={DeliveryStatus.FAILED}>Failed</SelectItem>
          </SelectContent>
        </Select>
        {errors.delivery_status && (
          <p className="text-sm text-destructive">{errors.delivery_status[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Follow-up Required <span className="text-red-500">*</span></Label>
        <Select key={`follow_up_required-${formData.follow_up_required ? "true" : "false"}`} value={formData.follow_up_required ? "true" : "false"} onValueChange={(value) => handleInputChange("follow_up_required", value === "true")}>
          <SelectTrigger className={`w-full ${errors.follow_up_required ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IncidentNotificationForm;

