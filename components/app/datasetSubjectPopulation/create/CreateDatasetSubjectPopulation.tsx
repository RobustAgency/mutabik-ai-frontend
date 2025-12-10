"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateDatasetSubjectPopulationMutation, CreateDatasetSubjectPopulationData } from "@/app/lib/features/datasetSubjectPopulationApi";
import DatasetSubjectPopulationForm from "./DatasetSubjectPopulationForm";
import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";

const CreateDatasetSubjectPopulation = () => {
  const router = useRouter();
  const [createPopulation, { isLoading }] = useCreateDatasetSubjectPopulationMutation();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const initialFormData: CreateDatasetSubjectPopulationData = {
    dataset_id: "",
    snapshot_id: "",
    subject_realm: "",
    jurisdiction: "",
    subjects_total: 0,
    as_of: "",
  };

  const [formData, setFormData] = useState<CreateDatasetSubjectPopulationData>(initialFormData);

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      dataset_id: validateTextField(formData.dataset_id, {
        required: true,
        messages: { required: "Dataset is required" },
      }),
      subject_realm: validateTextField(formData.subject_realm, {
        required: true,
        messages: { required: "Subject realm is required" },
      }),
      jurisdiction: validateTextField(formData.jurisdiction, {
        required: true,
        messages: { required: "Jurisdiction is required" },
      }),
      as_of: validateTextField(formData.as_of, {
        required: true,
        messages: { required: "As of date is required" },
      }),
    };

    const subjectsTotalErrors = validateNumericField(formData.subjects_total, {
      min: 0,
      messages: { min: "Total subjects must be non-negative" },
    });
    if (subjectsTotalErrors.length) {
      fieldErrors.subjects_total = subjectsTotalErrors;
    }

    const errors = createValidationErrors(fieldErrors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await createPopulation(formData).unwrap();
      router.push("/core-assets/data/subject-population");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSave}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Add Dataset Subject Population</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Create a new subject population record for denominator tracking
              </p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Population"}
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

            <DatasetSubjectPopulationForm formData={formData} setFormData={setFormData} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateDatasetSubjectPopulation;

