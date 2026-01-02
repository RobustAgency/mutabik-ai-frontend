"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import IncidentNotificationForm from "./create/IncidentNotificationForm";
import { 
  CreateIncidentNotificationData, 
  useCreateIncidentNotificationMutation,
  AudienceType,
  Channel,
  DeliveryStatus
} from "@/app/lib/features/incidentNotificationsApi";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

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
    template: null,
    language: null,
    regulatory_basis: null,
    notification_deadline: null,
    audience_type: AudienceType.INTERNAL_EXECUTIVE,
    channel: Channel.EMAIL,
    notice_summary: "",
    notice_link: null,
    sent_at: "",
    sent_by: null,
    delivery_status: DeliveryStatus.DRAFT,
    response_summary: null,
    follow_up_required: false,
    follow_up_date: null,
    follow_up_notes: null,
  });

  const isExternalAudience = [
    AudienceType.DATA_PROTECTION_AUTHORITY,
    AudienceType.AFFECTED_DATA_SUBJECTS,
    AudienceType.EXTERNAL_PARTNERS,
    AudienceType.MEDIA_PUBLIC,
  ].includes(formData.audience_type);

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      ai_incident_id: validateTextField(formData.ai_incident_id ? String(formData.ai_incident_id) : "", {
        required: true,
        messages: { required: "Incident is required" },
      }),
      audience_type: validateTextField(formData.audience_type, {
        required: true,
        messages: { required: "Audience type is required" },
      }),
      channel: validateTextField(formData.channel, {
        required: true,
        messages: { required: "Channel is required" },
      }),
      notice_summary: validateTextField(formData.notice_summary, {
        required: true,
        messages: { required: "Notice summary is required" },
      }),
      sent_at: validateTextField(formData.sent_at, {
        required: true,
        messages: { required: "Sent at is required" },
      }),
      delivery_status: validateTextField(formData.delivery_status, {
        required: true,
        messages: { required: "Delivery status is required" },
      }),
    };

    const validationErrors = createValidationErrors(fieldErrors);
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
              {isLoading ? "Creating..." : "Create Notification"}
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

