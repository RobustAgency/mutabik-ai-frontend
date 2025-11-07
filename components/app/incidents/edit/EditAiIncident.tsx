"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import AiIncidentForm from "../create/AiIncidentForm";
import {
  CreateAiIncidentData,
  useGetAiIncidentQuery,
  useUpdateAiIncidentMutation,
} from "@/app/lib/features/aiIncidentsApi";

interface EditAiIncidentProps {
  incidentId: string;
}

const EditAiIncident: React.FC<EditAiIncidentProps> = ({ incidentId }) => {
  const router = useRouter();
  const idNum = Number(incidentId);
  const { data: incident, isLoading: isLoadingIncident } = useGetAiIncidentQuery(idNum, {
    skip: Number.isNaN(idNum),
  });
  const [updateIncident, { isLoading }] = useUpdateAiIncidentMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateAiIncidentData>({
    title: "",
    summary: "",
    category: "safety",
    severity: "sev3_medium",
    status: "open",
    stage: "prod",
    ic_owner: "",
    model_id: null,
    model_version_id: null,
    use_case_id: null,
    first_seen_at: "",
    declared_at: "",
    resolved_at: null,
    closed_at: null,
    impacted_users: null,
    impacted_data: [],
    impacted_systems: null,
    linked_release_id: null,
    linked_risk_id: null,
    linked_assessment_id: null,
    linked_capa_id: null,
    evidence_link: null,
  });

  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title,
        summary: incident.summary,
        category: incident.category,
        severity: incident.severity,
        status: incident.status,
        stage: incident.stage,
        ic_owner: incident.ic_owner,
        model_id: incident.model_id || null,
        model_version_id: incident.model_version_id || null,
        use_case_id: incident.use_case_id || null,
        first_seen_at: incident.first_seen_at ? incident.first_seen_at.slice(0, 16) : "",
        declared_at: incident.declared_at ? incident.declared_at.slice(0, 16) : "",
        resolved_at: incident.resolved_at ? incident.resolved_at.slice(0, 16) : null,
        closed_at: incident.closed_at ? incident.closed_at.slice(0, 16) : null,
        impacted_users: incident.impacted_users || null,
        impacted_data: incident.impacted_data || [],
        impacted_systems: incident.impacted_systems || null,
        linked_release_id: incident.linked_release_id || null,
        linked_risk_id: incident.linked_risk_id || null,
        linked_assessment_id: incident.linked_assessment_id || null,
        linked_capa_id: incident.linked_capa_id || null,
        evidence_link: incident.evidence_link || null,
      });
    }
  }, [incident]);

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string[]> = {};

    if (!formData.title?.trim()) validationErrors.title = ["Title is required"];
    if (!formData.summary?.trim()) validationErrors.summary = ["Summary is required"];
    if (!formData.category?.trim()) validationErrors.category = ["Category is required"];
    if (!formData.severity?.trim()) validationErrors.severity = ["Severity is required"];
    if (!formData.status?.trim()) validationErrors.status = ["Status is required"];
    if (!formData.stage?.trim()) validationErrors.stage = ["Stage is required"];
    if (!formData.ic_owner?.trim()) validationErrors.ic_owner = ["Incident commander is required"];
    if (!formData.first_seen_at?.trim()) validationErrors.first_seen_at = ["First seen at is required"];
    if (!formData.declared_at?.trim()) validationErrors.declared_at = ["Declared at is required"];
    if (!formData.impacted_data || formData.impacted_data.length === 0) {
      validationErrors.impacted_data = ["At least one impacted data type is required"];
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
      await updateIncident({ id: idNum, data: formData }).unwrap();
      router.push(`/governance/incidents/${incidentId}/details`);
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid incident ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingIncident) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading incident...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Incident not found</p>
            <Button onClick={() => router.push("/governance/incidents")}>
              Back to Incidents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-10">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Edit AI Incident
              </h1>
              <p className="font-sans text-sm text-[#667085]">{incident.title}</p>
            </div>
            <Button type="submit" disabled={isLoading} className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100">
              {isLoading ? "Updating..." : "Update Incident"}
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
            <AiIncidentForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default EditAiIncident;

