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
import { CreateUseCaseData } from "@/service/app/useCases";

const initialFormData: FormDataType = {
  // Core fields
  name: "",
  description: null,
  business_objective: "",
  business_owner_id: null,
  technical_owner_id: null,
  business_domain: "",

  // Classification and Priority
  roi_classification: "",
  priority: "",
  risk_level: "medium",
  data_sensitivity: "public",

  // Financial and Timeline
  expected_roi_percentage: null,
  budget_allocated: null,
  target_go_live_date: null,

  // Status and Tracking
  status: "draft",
  created_by: "", // This should be populated with current user email
  updated_by: null,

  // Assessment Flags
  roi_assessment: false,
  risk_assessment: false,
  data_assessment: false,

  // Estimated Values
  estimated_implementation_cost: null,
  estimated_reduction_in_time: null,
  estimated_reduction_in_cost: null,
  estimated_revenue_increase: null,
  estimated_fte_capacity_saving: null,

  // Data Status
  data_availability_status: "",
  data_readiness: "",
};

const CreateUseCases: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [createUseCase, { isLoading }] = useCreateUseCaseMutation();

  // Email validation helper (keeping for potential future use)
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields based on new schema
    if (!formData.name?.trim()) {
      errors.name = ["Use case name is required (5-255 characters)"];
    } else if (formData.name.trim().length < 5 || formData.name.trim().length > 255) {
      errors.name = ["Use case name must be between 5-255 characters"];
    }

    if (!formData.description?.trim()) {
      errors.description = ["Use case description is required (100-5000 characters)"];
    } else if (formData.description.trim().length < 100 || formData.description.trim().length > 5000) {
      errors.description = ["Use case description must be between 100-5000 characters"];
    }

    if (!formData.business_objective?.trim()) {
      errors.business_objective = ["Business objective is required (50-2000 characters)"];
    } else if (formData.business_objective.trim().length < 50 || formData.business_objective.trim().length > 2000) {
      errors.business_objective = ["Business objective must be between 50-2000 characters"];
    }

    if (!formData.business_domain?.trim()) {
      errors.business_domain = ["Business domain is required"];
    }

    if (!formData.created_by?.trim()) {
      errors.created_by = ["Creator email is required"];
    } else if (!isValidEmail(formData.created_by)) {
      errors.created_by = ["Please enter a valid creator email address"];
    }

    // Optional stakeholder validation - can be added if needed
    // if (!formData.business_owner_id) {
    //   errors.business_owner_id = ["Business owner is required"];
    // }
    // if (!formData.technical_owner_id) {
    //   errors.technical_owner_id = ["Technical owner is required"];
    // }

    // Validate ROI percentage if provided
    if (formData.expected_roi_percentage !== null &&
      (formData.expected_roi_percentage < 0 || formData.expected_roi_percentage > 999.99)) {
      errors.expected_roi_percentage = ["Expected ROI percentage must be between 0.00-999.99"];
    }

    // Validate budget if provided
    if (formData.budget_allocated !== null && formData.budget_allocated < 0) {
      errors.budget_allocated = ["Budget allocated must be greater than or equal to 0"];
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
        // Ensure required fields are properly formatted
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        business_objective: formData.business_objective.trim(),
        business_domain: formData.business_domain.trim() as CreateUseCaseData["business_domain"],
        created_by: formData.created_by.trim(),
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