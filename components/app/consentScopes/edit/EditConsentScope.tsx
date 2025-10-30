"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetConsentScopeQuery, useUpdateConsentScopeMutation, CreateConsentScopeData } from "@/app/lib/features/consentScopesApi";
import ConsentScopeForm from "../create/ConsentScopeForm";

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
        effective_from: scope.effective_from,
        effective_to: scope.effective_to || "",
      });
    }
  }, [scope]);

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.dataset_id?.trim()) errors.dataset_id = ["Dataset is required"];
    if (!formData.purpose || formData.purpose.length === 0) errors.purpose = ["At least one purpose is required"];
    if (!formData.subject_realm?.trim()) errors.subject_realm = ["Subject realm is required"];
    if (!formData.jurisdiction?.trim()) errors.jurisdiction = ["Jurisdiction is required"];
    if (!formData.effective_from?.trim()) errors.effective_from = ["Effective from date is required"];

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

