"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetIncidentNotificationQuery,
  useUpdateIncidentNotificationMutation,
  CreateIncidentNotificationData,
} from "@/app/lib/features/incidentNotificationsApi";
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

  const handleSubmit = async () => {
    if (!formData) return;
    setErrors({});
    try {
      await updateNotification({ id: idNum, data: formData }).unwrap();
    } catch (e: any) {
      const apiErrors = e?.error?.data?.errors as Record<string, string[]> | undefined;
      if (apiErrors) setErrors(apiErrors);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-medium text-sm text-[#000]">Edit Incident Notification</h2>
            <p className="font-sans text-sm text-[#667085]">Update notification details</p>
          </div>
        </div>

        {isLoading || !formData ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="space-y-6">
            <IncidentNotificationForm formData={formData} setFormData={setFormData} errors={errors} />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4">
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


