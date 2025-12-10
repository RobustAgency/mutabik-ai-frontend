"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetConsentScopeQuery, useUpdateConsentScopeMutation, CreateConsentScopeData } from "@/app/lib/features/consentScopesApi";
import ConsentScopeForm from "../create/ConsentScopeForm";
import {
  validateTextField,
  validateArrayField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface EditConsentScopeProps {
  scopeId: string;
}

const EditConsentScope: React.FC<EditConsentScopeProps> = ({ scopeId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateConsentScopeData>({
    dataset_id: "",
    purpose: [],
    subject_realm: "",
    jurisdiction: "",
    source_created_at: "",
    effective_from: "",
    effective_to: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const { data: scope, isLoading: isLoadingScope } = useGetConsentScopeQuery(scopeId);
  const [updateScope, { isLoading: isUpdating }] = useUpdateConsentScopeMutation();

  useEffect(() => {
    if (scope) {
      setFormData({
        dataset_id: String(scope.dataset_id),
        purpose: scope.purpose,
        subject_realm: scope.subject_realm,
        jurisdiction: scope.jurisdiction,
        source_created_at: scope.source_created_at,
        effective_from: scope.effective_from,
        effective_to: scope.effective_to || "",
      });
    }
  }, [scope]);

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      dataset_id: validateTextField(formData.dataset_id, {
        required: true,
        messages: { required: "Dataset is required" },
      }),
      purpose: validateArrayField(formData.purpose, {
        required: true,
        messages: { required: "At least one purpose is required" },
      }),
      subject_realm: validateTextField(formData.subject_realm, {
        required: true,
        messages: { required: "Subject realm is required" },
      }),
      jurisdiction: validateTextField(formData.jurisdiction, {
        required: true,
        messages: { required: "Jurisdiction is required" },
      }),
      source_created_at: validateTextField(formData.source_created_at, {
        required: true,
        messages: { required: "Created at is required" },
      }),
      effective_from: validateTextField(formData.effective_from, {
        required: true,
        messages: { required: "Effective from date is required" },
      }),
    };

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
      await updateScope({ id: scopeId, data: formData }).unwrap();
      router.push("/privacy/consent/scopes");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoadingScope) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading consent scope...</p>
        </Card>
      </div>
    );
  }

  if (!scope) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Consent scope not found</p>
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit Consent Scope</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update consent scope definition</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Scope"}
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

            <ConsentScopeForm formData={formData} setFormData={setFormData} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditConsentScope;

