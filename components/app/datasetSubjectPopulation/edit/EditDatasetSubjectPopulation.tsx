"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetDatasetSubjectPopulationQuery, useUpdateDatasetSubjectPopulationMutation, CreateDatasetSubjectPopulationData } from "@/app/lib/features/datasetSubjectPopulationApi";
import DatasetSubjectPopulationForm from "../create/DatasetSubjectPopulationForm";
import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface EditDatasetSubjectPopulationProps {
  populationId: string;
}

const EditDatasetSubjectPopulation: React.FC<EditDatasetSubjectPopulationProps> = ({ populationId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateDatasetSubjectPopulationData>({
    dataset_id: "",
    snapshot_id: "",
    subject_realm: "",
    jurisdiction: "",
    subjects_total: 0,
    as_of: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const { data: population, isLoading: isLoadingPopulation } = useGetDatasetSubjectPopulationQuery(populationId);
  const [updatePopulation, { isLoading: isUpdating }] = useUpdateDatasetSubjectPopulationMutation();

  useEffect(() => {
    if (population) {
      setFormData({
        dataset_id: String(population.dataset_id),
        snapshot_id: population.snapshot_id ? String(population.snapshot_id) : "",
        subject_realm: population.subject_realm,
        jurisdiction: population.jurisdiction,
        subjects_total: population.subjects_total,
        as_of: population.as_of,
      });
    }
  }, [population]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await updatePopulation({ id: populationId, data: formData }).unwrap();
      router.push("/core-assets/data/subject-population");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoadingPopulation) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading subject population...</p>
        </Card>
      </div>
    );
  }

  if (!population) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Subject population not found</p>
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit Dataset Subject Population</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update subject population record</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Population"}
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

export default EditDatasetSubjectPopulation;

