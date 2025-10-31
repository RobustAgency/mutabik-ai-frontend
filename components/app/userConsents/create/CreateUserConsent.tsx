"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateUserConsentMutation, CreateUserConsentData } from "@/app/lib/features/userConsentsApi";
import UserConsentForm from "./UserConsentForm";

const CreateUserConsent: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserConsentData>({
    subject_key: "",
    subject_realm: "",
    jurisdiction: "",
    consent_purpose: [],
    consent_status: "",
    legal_basis: "",
    source_system: "",
    evidence_ref: "",
    effective_from: "",
    effective_to: "",
    scope: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [createConsent, { isLoading }] = useCreateUserConsentMutation();

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.subject_key?.trim()) errors.subject_key = ["Subject key is required"];
    if (!formData.subject_realm?.trim()) errors.subject_realm = ["Subject realm is required"];
    if (!formData.jurisdiction?.trim()) errors.jurisdiction = ["Jurisdiction is required"];
    if (!formData.consent_purpose || formData.consent_purpose.length === 0) errors.consent_purpose = ["At least one consent purpose is required"];
    if (!formData.consent_status?.trim()) errors.consent_status = ["Consent status is required"];
    if (!formData.legal_basis?.trim()) errors.legal_basis = ["Legal basis is required"];
    if (!formData.source_system?.trim()) errors.source_system = ["Source system is required"];
    if (!formData.evidence_ref?.trim()) errors.evidence_ref = ["Evidence reference is required"];
    if (!formData.effective_from?.trim()) errors.effective_from = ["Effective from date is required"];

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
      await createConsent(formData).unwrap();
      router.push("/privacy/consent/consents");
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Create User Consent</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Record new subject-level consent (GDPR/PDPL compliance)</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Consent"}
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

            <UserConsentForm formData={formData} setFormData={setFormData} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateUserConsent;

