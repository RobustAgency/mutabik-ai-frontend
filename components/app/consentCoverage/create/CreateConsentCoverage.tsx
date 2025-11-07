"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateConsentCoverageMutation, CreateConsentCoverageData } from "@/app/lib/features/consentCoverageApi";
import ConsentCoverageForm from "./ConsentCoverageForm";

const CreateConsentCoverage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateConsentCoverageData>({
    dataset_id: "",
    snapshot_id: "",
    purpose: [],
    jurisdiction: "",
    source_created_at: "",
    as_of: "",
    subjects_total: 0,
    subjects_with_valid_consent: 0,
    coverage_pct: 0,
    evidence_ref: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [createCoverage, { isLoading }] = useCreateConsentCoverageMutation();

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.dataset_id?.trim()) errors.dataset_id = ["Dataset ID is required"];
    if (!formData.purpose || formData.purpose.length === 0) errors.purpose = ["At least one purpose is required"];
    if (!formData.jurisdiction?.trim()) errors.jurisdiction = ["Jurisdiction is required"];
    if (!formData.source_created_at?.trim()) errors.source_created_at = ["Created at is required"];
    if (!formData.as_of?.trim()) errors.as_of = ["As of date is required"];
    if (!formData.subjects_total || formData.subjects_total <= 0) errors.subjects_total = ["Total subjects must be greater than 0"];
    if (formData.subjects_with_valid_consent < 0) errors.subjects_with_valid_consent = ["Subjects with consent cannot be negative"];
    if (!formData.coverage_pct || formData.coverage_pct < 0 || formData.coverage_pct > 100) errors.coverage_pct = ["Coverage % must be between 0 and 100"];
    if (!formData.evidence_ref?.trim()) errors.evidence_ref = ["Evidence reference is required"];

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createCoverage(formData).unwrap();
      router.push("/privacy/consent/coverage");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Create Consent Coverage</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Record aggregated consent metrics for gate checks (AC-06)</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Coverage"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <ConsentCoverageForm formData={formData} setFormData={setFormData} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateConsentCoverage;

