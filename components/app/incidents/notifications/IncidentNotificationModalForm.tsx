"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import IncidentNotificationForm from "./create/IncidentNotificationForm";
import { CreateIncidentNotificationData, useCreateIncidentNotificationMutation } from "@/app/lib/features/incidentNotificationsApi";

interface IncidentNotificationModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: number;
}

const IncidentNotificationModalForm: React.FC<IncidentNotificationModalFormProps> = ({ isOpen, onClose, incidentId }) => {
  const [createNotification, { isLoading }] = useCreateIncidentNotificationMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentNotificationData>({
    ai_incident_id: incidentId || 0,
    audience_type: "internal_exec",
    channel: "email",
    notice_summary: "",
    notice_link: null,
    notified_at: "",
    approved_by: null,
    approval_ref: null,
    follow_up_required: false,
  });

  const isExternalAudience = ["customers", "regulator", "vendor", "media"].includes(formData.audience_type);

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string[]> = {};

    if (!formData.ai_incident_id) validationErrors.ai_incident_id = ["Incident is required"];
    if (!formData.audience_type?.trim()) validationErrors.audience_type = ["Audience type is required"];
    if (!formData.channel?.trim()) validationErrors.channel = ["Channel is required"];
    if (!formData.notice_summary?.trim()) validationErrors.notice_summary = ["Notice summary is required"];
    if (!formData.notified_at?.trim()) validationErrors.notified_at = ["Notified at is required"];
    if (isExternalAudience && !formData.approved_by?.trim()) {
      validationErrors.approved_by = ["Approved by is required for external communications"];
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await createNotification(formData).unwrap();
      onClose();
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, fieldErrors]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {fieldErrors[0]}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <IncidentNotificationForm formData={formData} setFormData={setFormData} errors={errors} />
          <div className="flex gap-3 mt-6">
            <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
              {isLoading ? "Sending..." : isExternalAudience ? "Submit for Approval" : "Send Notification"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentNotificationModalForm;

