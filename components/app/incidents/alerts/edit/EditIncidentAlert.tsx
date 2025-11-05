"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetIncidentAlertQuery,
  useUpdateIncidentAlertMutation,
  CreateIncidentAlertData,
} from "@/app/lib/features/incidentAlertsApi";
import IncidentAlertForm from "@/components/app/incidents/alerts/create/IncidentAlertForm";

interface EditIncidentAlertProps {
  alertId: string;
}

const EditIncidentAlert: React.FC<EditIncidentAlertProps> = ({ alertId }) => {
  const idNum = Number(alertId);
  const { data, isLoading } = useGetIncidentAlertQuery(idNum, { skip: !idNum });
  const [updateAlert, { isLoading: isSubmitting }] = useUpdateIncidentAlertMutation();

  const [formData, setFormData] = React.useState<CreateIncidentAlertData | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (data) {
      setFormData({
        ai_incident_id: data.ai_incident_id,
        source_type: data.source_type,
        source_ref: data.source_ref ?? null,
        rule_version: data.rule_version ?? null,
        context: data.context ?? null,
        first_seen_at: data.first_seen_at,
        last_seen_at: data.last_seen_at ?? null,
        evidence_link: data.evidence_link ?? null,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!formData) return;
    setErrors({});
    try {
      await updateAlert({ id: idNum, data: formData }).unwrap();
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
            <h2 className="font-sans font-medium text-sm text-[#000]">Edit Incident Alert</h2>
            <p className="font-sans text-sm text-[#667085]">Update alert details</p>
          </div>
        </div>

        {isLoading || !formData ? (
          <div className="text-sm text-[#667085]">Loading...</div>
        ) : (
          <div className="space-y-6">
            <IncidentAlertForm formData={formData} setFormData={setFormData} errors={errors} />
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

export default EditIncidentAlert;


