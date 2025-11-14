"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  useGetIncidentActionQuery,
  useUpdateIncidentActionMutation,
  CreateIncidentActionData,
} from "@/app/lib/features/incidentActionsApi";
import IncidentActionForm from "@/components/app/incidents/actions/create/IncidentActionForm";

interface EditIncidentActionProps {
  actionId: string;
}

const EditIncidentAction: React.FC<EditIncidentActionProps> = ({ actionId }) => {
  const idNum = Number(actionId);
  const { data, isLoading } = useGetIncidentActionQuery(idNum, { skip: !idNum });
  const [updateAction, { isLoading: isSubmitting }] = useUpdateIncidentActionMutation();

  const [formData, setFormData] = React.useState<CreateIncidentActionData | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (data) {
      setFormData({
        ai_incident_id: data.ai_incident_id,
        action_type: data.action_type,
        description: data.description,
        performed_by: data.performed_by,
        started_at: data.started_at,
        completed_at: data.completed_at ?? null,
        validation_result: data.validation_result,
        validation_notes: data.validation_notes ?? null,
        linked_release_id: data.linked_release_id ?? null,
        evidence_link: data.evidence_link ?? null,
      });
    }
  }, [data]);

  const validateForm = (): boolean => {
    if (!formData) return false;
    const validationErrors: Record<string, string[]> = {};

    if (!formData.ai_incident_id) validationErrors.ai_incident_id = ["Incident is required"];
    if (!formData.action_type?.trim()) validationErrors.action_type = ["Action type is required"];
    if (!formData.description?.trim()) validationErrors.description = ["Description is required"];
    if (!formData.performed_by?.trim()) validationErrors.performed_by = ["Performed by is required"];
    if (!formData.started_at?.trim()) validationErrors.started_at = ["Started at is required"];
    if (!formData.validation_result?.trim()) validationErrors.validation_result = ["Validation result is required"];

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
      await updateAction({ id: idNum, data: formData }).unwrap();
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
            <h2 className="font-sans font-medium text-sm text-black">Edit Incident Action</h2>
            <p className="font-sans text-sm text-[#667085]">Update response action details</p>
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
            <IncidentActionForm
              formData={formData}
              setFormData={setFormData as React.Dispatch<React.SetStateAction<CreateIncidentActionData>>}
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

export default EditIncidentAction;


