"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  useGetIncidentNotificationQuery,
  useUpdateIncidentNotificationMutation,
  CreateIncidentNotificationData,
} from "@/app/lib/features/incidentNotificationsApi";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";
import IncidentNotificationForm from "@/components/app/incidents/notifications/create/IncidentNotificationForm";

interface EditIncidentNotificationProps {
  notificationId: string;
}

const EditIncidentNotification: React.FC<EditIncidentNotificationProps> = ({ notificationId }) => {
  const idNum = Number(notificationId);
  const { data, isLoading } = useGetIncidentNotificationQuery(idNum, { skip: !idNum });
  const [updateNotification, { isLoading: isSubmitting }] = useUpdateIncidentNotificationMutation();

  const [formData, setFormData] = React.useState<CreateIncidentNotificationData | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (data) {
      setFormData({
        ai_incident_id: data.ai_incident_id,
        audience_type: data.audience_type,
        channel: data.channel,
        notice_summary: data.notice_summary,
        notice_link: data.notice_link ?? null,
        notified_at: data.notified_at,
        approved_by: data.approved_by ?? null,
        approval_ref: data.approval_ref ?? null,
        follow_up_required: data.follow_up_required,
      });
    }
  }, [data]);

  const validateForm = (): boolean => {
    if (!formData) return false;
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
      notified_at: validateTextField(formData.notified_at, {
        required: true,
        messages: { required: "Notified at is required" },
      }),
    };

    const isExternalAudience = ["customers", "regulator", "vendor", "media"].includes(formData.audience_type);
    if (isExternalAudience && !formData.approved_by?.trim()) {
      fieldErrors.approved_by = ["Approved by is required for external communications"];
    }

    const validationErrors = createValidationErrors(fieldErrors);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await updateNotification({ id: idNum, data: formData }).unwrap();
    } catch (e: any) {
      const apiErrors = e?.error?.data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) {
        setErrors(apiErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-medium text-sm text-black">Edit Incident Notification</h2>
            <p className="font-sans text-sm text-[#667085]">Update notification details</p>
          </div>
        </div>

        {isLoading || !formData ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="space-y-6">
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
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
            <IncidentNotificationForm
              formData={formData}
              setFormData={setFormData as React.Dispatch<React.SetStateAction<CreateIncidentNotificationData>>}
              errors={errors}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditIncidentNotification;


