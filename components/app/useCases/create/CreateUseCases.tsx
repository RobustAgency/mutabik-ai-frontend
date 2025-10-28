"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BasicInfo from "./BasicInfo";
import Roi from "./Roi";
import UseCaseClassification from "./UseCaseClassification";
import GovernanceRisk from "./GovernanceRisk";
import DataAssesment from "./DataAssesment";
import { FormDataType } from "../types/useCaseTypes";
import { useCreateUseCaseMutation } from "@/app/lib/features/useCasesApi";

const initialFormData: FormDataType = {
  title: "",
  description: null,
  status: "draft",
  business_domain: "",
  business_objective: "",
  business_owner_email: "",
  technical_owner_email: "",
  regulatory_scope: [],
  data_sensitivity: "public",
  go_live_date: null,

  expected_roi: null,
  implementation_cost: null,
  reduction_in_time: null,
  reduction_in_cost: null,
  increase_in_revenue: null,
  risk_avoidance: null,
  fte_capacity_saved: null,

  use_case_type: "",
  value_driver: "",

  overall_risk_score: null,
  risk_level: "medium",
  human_oversight_mode: "",
  dpia: false,
  aia: false,

  data_availability_status: "",
  data_readiness_level: "",
  data_freshness: "",
};

const CreateUseCases: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [createUseCase, { isLoading }] = useCreateUseCaseMutation();

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields
    if (!formData.title?.trim()) {
      errors.title = ["Title is required"];
    }

    if (!formData.business_owner_email?.trim()) {
      errors.business_owner_email = ["Business owner email is required"];
    } else if (!isValidEmail(formData.business_owner_email)) {
      errors.business_owner_email = ["Please enter a valid email address"];
    }

    if (!formData.technical_owner_email?.trim()) {
      errors.technical_owner_email = ["Technical owner email is required"];
    } else if (!isValidEmail(formData.technical_owner_email)) {
      errors.technical_owner_email = ["Please enter a valid email address"];
    }

    if (!formData.regulatory_scope || formData.regulatory_scope.length === 0) {
      errors.regulatory_scope = ["Please select at least one regulatory scope"];
    }

    if (!formData.business_domain?.trim()) {
      errors.business_domain = ["Business domain is required"];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side validation
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const payload = {
        ...formData,
        regulatory_scope: formData.regulatory_scope
          .map((x) => x.trim())
          .filter((x) => x !== ""),
      };

      await createUseCase(payload).unwrap();

      // Reset form on success
      setFormData(initialFormData);
      setValidationErrors({});
    } catch (err: any) {
      // Handle backend validation errors
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                New use case
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Fill all the details below of your AI Model Use Case
              </p>
            </div>
            <Button
              type="submit"
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save new use case"}
            </Button>
          </div>

          <CardContent className="space-y-10 w-full">
            {/* Show validation errors */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {errors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <BasicInfo
              formData={formData}
              setFormData={setFormData}
              errors={validationErrors}
            />
            <Roi formData={formData} setFormData={setFormData} />
            <UseCaseClassification formData={formData} setFormData={setFormData} />
            <GovernanceRisk formData={formData} setFormData={setFormData} />
            <DataAssesment formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateUseCases;