"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import IncidentNotificationForm from "./IncidentNotificationForm";
import { CreateIncidentNotificationData, useCreateIncidentNotificationMutation } from "@/app/lib/features/incidentNotificationsApi";

const CreateIncidentNotification: React.FC = () => {
  const router = useRouter();
  const [createNotification, { isLoading }] = useCreateIncidentNotificationMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateIncidentNotificationData>({
    ai_incident_id: 0,
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createNotification(formData).unwrap();
      router.push("/governance/incidents/notifications");
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                {isExternalAudience ? "Submit Notification for Approval" : "Send Notification"}
              </h1>
              <p className="font-sans text-sm text-[#667085]">
                {isExternalAudience ? "Submit a notification for approval" : "Send a notification to the audience"}
              </p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Sending..." : isExternalAudience ? "Submit for Approval" : "Send Notification"}
            </Button>
          </div>
          <CardContent>
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="mb-6">
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
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentNotification;

