"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await createNotification(formData).unwrap();
      router.push("/governance/incidents/notifications");
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
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
            <IncidentNotificationForm formData={formData} setFormData={setFormData} errors={errors} />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default CreateIncidentNotification;

