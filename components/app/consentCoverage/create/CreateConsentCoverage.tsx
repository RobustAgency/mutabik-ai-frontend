"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateConsentCoverageMutation, CreateConsentCoverageData } from "@/app/lib/features/consentCoverageApi";
import ConsentCoverageForm from "./ConsentCoverageForm";
import {
  validateTextField,
  validateArrayField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";

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
    const fieldErrors: Record<string, string[]> = {
      dataset_id: validateTextField(formData.dataset_id, {
        required: true,
        messages: { required: "Dataset ID is required" },
      }),
      purpose: validateArrayField(formData.purpose, {
        required: true,
        messages: { required: "At least one purpose is required" },
      }),
      jurisdiction: validateTextField(formData.jurisdiction, {
        required: true,
        messages: { required: "Jurisdiction is required" },
      }),
      source_created_at: validateTextField(formData.source_created_at, {
        required: true,
        messages: { required: "Created at is required" },
      }),
      as_of: validateTextField(formData.as_of, {
        required: true,
        messages: { required: "As of date is required" },
      }),
      evidence_ref: validateTextField(formData.evidence_ref, {
        required: true,
        messages: { required: "Evidence reference is required" },
      }),
    };

    const subjectsTotalErrors = validateNumericField(formData.subjects_total, {
      min: 1,
      messages: { min: "Total subjects must be greater than 0" },
    });
    if (subjectsTotalErrors.length) {
      fieldErrors.subjects_total = subjectsTotalErrors;
    }

    const subjectsConsentErrors = validateNumericField(formData.subjects_with_valid_consent, {
      min: 0,
      messages: { min: "Subjects with consent cannot be negative" },
    });
    if (subjectsConsentErrors.length) {
      fieldErrors.subjects_with_valid_consent = subjectsConsentErrors;
    }

    const coverageErrors = validateNumericField(formData.coverage_pct, {
      min: 0,
      max: 100,
      messages: { min: "Coverage % must be between 0 and 100", max: "Coverage % must be between 0 and 100" },
    });
    if (coverageErrors.length) {
      fieldErrors.coverage_pct = coverageErrors;
    }

    const errors = createValidationErrors(fieldErrors);
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

