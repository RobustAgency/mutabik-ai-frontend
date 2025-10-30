"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetConsentCoverageQuery, useUpdateConsentCoverageMutation, CreateConsentCoverageData } from "@/app/lib/features/consentCoverageApi";
import ConsentCoverageForm from "../create/ConsentCoverageForm";

interface EditConsentCoverageProps {
  coverageId: string;
}

const EditConsentCoverage: React.FC<EditConsentCoverageProps> = ({ coverageId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateConsentCoverageData>({
    dataset_id: "",
    snapshot_id: "",
    purpose: [],
    jurisdiction: "",
    as_of: "",
    subjects_total: 0,
    subjects_with_valid_consent: 0,
    coverage_pct: 0,
    evidence_ref: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const { data: coverage, isLoading: isLoadingCoverage } = useGetConsentCoverageQuery(coverageId);
  const [updateCoverage, { isLoading: isUpdating }] = useUpdateConsentCoverageMutation();

  useEffect(() => {
    if (coverage) {
      setFormData({
        dataset_id: String(coverage.dataset_id),
        snapshot_id: coverage.snapshot_id ? String(coverage.snapshot_id) : "",
        purpose: coverage.purpose,
        jurisdiction: coverage.jurisdiction,
        as_of: coverage.as_of,
        subjects_total: coverage.subjects_total,
        subjects_with_valid_consent: coverage.subjects_with_valid_consent,
        coverage_pct: coverage.coverage_pct,
        evidence_ref: coverage.evidence_ref,
      });
    }
  }, [coverage]);

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.dataset_id?.trim()) errors.dataset_id = ["Dataset is required"];
    if (!formData.purpose || formData.purpose.length === 0) errors.purpose = ["At least one purpose is required"];
    if (!formData.jurisdiction?.trim()) errors.jurisdiction = ["Jurisdiction is required"];
    if (!formData.as_of?.trim()) errors.as_of = ["As of date is required"];
    if (formData.subjects_total < 0) errors.subjects_total = ["Subjects total must be non-negative"];
    if (formData.subjects_with_valid_consent < 0) errors.subjects_with_valid_consent = ["Subjects with valid consent must be non-negative"];
    if (formData.coverage_pct < 0 || formData.coverage_pct > 100) errors.coverage_pct = ["Coverage percentage must be between 0 and 100"];
    if (!formData.evidence_ref?.trim()) errors.evidence_ref = ["Evidence reference is required"];

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await updateCoverage({ id: coverageId, data: formData }).unwrap();
      router.push("/privacy/consent/coverage");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoadingCoverage) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading consent coverage...</p>
        </Card>
      </div>
    );
  }

  if (!coverage) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Consent coverage not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleUpdate}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit Consent Coverage</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update consent coverage metrics</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Coverage"}
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

export default EditConsentCoverage;

