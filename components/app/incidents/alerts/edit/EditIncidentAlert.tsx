"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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

  const validateForm = (): boolean => {
    if (!formData) return false;
    const validationErrors: Record<string, string[]> = {};

    if (!formData.ai_incident_id) validationErrors.ai_incident_id = ["Incident is required"];
    if (!formData.source_type?.trim()) validationErrors.source_type = ["Source type is required"];
    if (!formData.first_seen_at?.trim()) validationErrors.first_seen_at = ["First seen at is required"];

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
      await updateAlert({ id: idNum, data: formData }).unwrap();
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
            <h2 className="font-sans font-medium text-sm text-black">Edit Incident Alert</h2>
            <p className="font-sans text-sm text-[#667085]">Update alert details</p>
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
            <IncidentAlertForm formData={formData} setFormData={setFormData as React.Dispatch<React.SetStateAction<CreateIncidentAlertData>>} errors={errors} />
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

export default EditIncidentAlert;


