"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateIncidentNotificationData } from "@/app/lib/features/incidentNotificationsApi";
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

  const isExternalAudience = ["customers", "regulator", "vendor", "media"].includes(formData.audience_type);

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
        <Select key={`audience_type-${formData.audience_type || "none"}`} value={formData.audience_type} onValueChange={(value) => handleInputChange("audience_type", value)}>
          <SelectTrigger className={`w-full ${errors.audience_type ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal_exec">Internal Executive</SelectItem>
            <SelectItem value="internal_staff">Internal Staff</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="regulator">Regulator</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Channel <span className="text-red-500">*</span></Label>
        <Select key={`channel-${formData.channel || "none"}`} value={formData.channel} onValueChange={(value) => handleInputChange("channel", value)}>
          <SelectTrigger className={`w-full ${errors.channel ? "border-destructive" : ""}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="portal">Portal</SelectItem>
            <SelectItem value="status_page">Status Page</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="legal_letter">Legal Letter</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notice Summary <span className="text-red-500">*</span></Label>
        <Textarea required value={formData.notice_summary} onChange={(e) => handleInputChange("notice_summary", e.target.value)} className="min-h-32 resize-none" />
      </div>

      <div className="space-y-2">
        <Label>Notice Link</Label>
        <Input type="url" value={formData.notice_link || ""} onChange={(e) => handleInputChange("notice_link", e.target.value || null)} />
      </div>

      <div className="space-y-2">
        <Label>Notified At <span className="text-red-500">*</span></Label>
        <Input type="datetime-local" value={formData.notified_at} onChange={(e) => handleInputChange("notified_at", e.target.value)} />
      </div>

      {isExternalAudience && (
        <div className="space-y-2">
          <Label>Approved By <span className="text-red-500">*</span></Label>
          <Input value={formData.approved_by || ""} onChange={(e) => handleInputChange("approved_by", e.target.value || null)} />
        </div>
      )}

      <div className="space-y-2">
        <Label>Approval Reference</Label>
        <Input value={formData.approval_ref || ""} onChange={(e) => handleInputChange("approval_ref", e.target.value || null)} />
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

