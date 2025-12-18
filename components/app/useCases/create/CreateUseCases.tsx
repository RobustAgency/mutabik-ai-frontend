"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BasicInfo from "./BasicInfo";
import Roi from "./Roi";
import UseCaseClassification from "./UseCaseClassification";
import GovernanceRisk from "./GovernanceRisk";
import DataAssesment from "./DataAssesment";
import { MultiStepWizard } from "./MultiStepWizard";
import { FormDataType } from "../types/useCaseTypes";
import { useCreateUseCaseMutation } from "@/app/lib/features/useCasesApi";
import { CreateUseCaseData } from "@/service/app/useCases";

const WIZARD_STEPS = [
  { id: 1, title: "Basic Information", description: "Core details" },
  { id: 2, title: "ROI & Business Impact", description: "Financial metrics" },
  { id: 3, title: "Use Case Classification", description: "Priority & ROI" },
  { id: 4, title: "Governance & Risk", description: "Risk assessment" },
  { id: 5, title: "Data Assessment", description: "Data readiness" },
];

const initialFormData: FormDataType = {
  // Step 1: Basic Information
  name: "",
  description: null,
  problem_statement: "",
  expected_business_value: "",
  stakeholder_ids: [],
  business_domain: "",
  business_owner_id: null,
  technical_owner_id: null,
  status: "draft",
  target_deployment_date: null,

  // Step 2: ROI & Business Impact
  expected_roi: null,
  budget_allocated: null,
  estimated_implementation_cost: null,
  estimated_time_savings: null,
  estimated_cost_savings: null,
  estimated_revenue_impact: null,
  estimated_fte_saving: null,
  success_metrics: "",

  // Step 3: Use Case Classification
  roi_classification: "",
  priority: "",

  // Step 4: Governance & Risk
  preliminary_risk_level: "medium",
  regulatory_impact: false,
  potential_harm: "",
  human_oversight_mode: "",

  // Step 5: Data Assessment
  data_sensitivity: "public",
  data_availability_status: "",
  data_readiness: "",
  dependencies: "",
};

const CreateUseCases: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [createUseCase, { isLoading }] = useCreateUseCaseMutation();

  // Validate specific step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string[]> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.name?.trim()) {
          errors.name = ["Use case name is required"];
        } else if (formData.name.trim().length < 5 || formData.name.trim().length > 255) {
          errors.name = ["Use case name must be between 5-255 characters"];
        }

        if (!formData.problem_statement?.trim()) {
          errors.problem_statement = ["Problem statement is required"];
        } else if (formData.problem_statement.trim().length < 50 || formData.problem_statement.trim().length > 2000) {
          errors.problem_statement = ["Problem statement must be between 50-2000 characters"];
        }

        if (!formData.expected_business_value?.trim()) {
          errors.expected_business_value = ["Expected business value is required"];
        } else if (formData.expected_business_value.trim().length < 50 || formData.expected_business_value.trim().length > 2000) {
          errors.expected_business_value = ["Expected business value must be between 50-2000 characters"];
        }

        if (formData.description && formData.description.trim().length > 0) {
          if (formData.description.trim().length < 100 || formData.description.trim().length > 5000) {
            errors.description = ["Description must be between 100-5000 characters if provided"];
          }
        }

        if (!formData.stakeholder_ids || formData.stakeholder_ids.length === 0) {
          errors.stakeholder_ids = ["At least one stakeholder is required"];
        }
        break;

      case 2: // ROI & Business Impact
        if (formData.expected_roi === null || formData.expected_roi === undefined) {
          errors.expected_roi = ["Estimated ROI is required"];
        } else if (formData.expected_roi < 0 || formData.expected_roi > 999.99) {
          errors.expected_roi = ["Estimated ROI must be between 0.00-999.99"];
        }

        if (formData.estimated_time_savings === null || formData.estimated_time_savings === undefined) {
          errors.estimated_time_savings = ["Estimated time savings is required"];
        } else if (formData.estimated_time_savings < 0) {
          errors.estimated_time_savings = ["Estimated time savings must be 0 or greater"];
        }

        if (formData.estimated_cost_savings === null || formData.estimated_cost_savings === undefined) {
          errors.estimated_cost_savings = ["Estimated cost savings is required"];
        } else if (formData.estimated_cost_savings < 0) {
          errors.estimated_cost_savings = ["Estimated cost savings must be 0 or greater"];
        }

        if (formData.estimated_revenue_impact === null || formData.estimated_revenue_impact === undefined) {
          errors.estimated_revenue_impact = ["Estimated revenue impact is required"];
        } else if (formData.estimated_revenue_impact < 0) {
          errors.estimated_revenue_impact = ["Estimated revenue impact must be 0 or greater"];
        }

        if (formData.estimated_fte_saving === null || formData.estimated_fte_saving === undefined) {
          errors.estimated_fte_saving = ["Estimated FTE savings is required"];
        } else if (formData.estimated_fte_saving < 0 || !Number.isInteger(formData.estimated_fte_saving)) {
          errors.estimated_fte_saving = ["Estimated FTE savings must be a non-negative integer"];
        }

        if (!formData.success_metrics?.trim()) {
          errors.success_metrics = ["Success metrics (KPIs) are required"];
        } else if (formData.success_metrics.trim().length < 50 || formData.success_metrics.trim().length > 2000) {
          errors.success_metrics = ["Success metrics must be between 50-2000 characters"];
        }
        break;

      case 3: // Use Case Classification
        // Optional fields - no validation needed
        break;

      case 4: // Governance & Risk
        if (!formData.preliminary_risk_level) {
          errors.preliminary_risk_level = ["Preliminary risk level is required"];
        }

        if (!formData.potential_harm?.trim()) {
          errors.potential_harm = ["Potential harm description is required"];
        } else if (formData.potential_harm.trim().length < 50 || formData.potential_harm.trim().length > 2000) {
          errors.potential_harm = ["Potential harm description must be between 50-2000 characters"];
        }

        if (!formData.human_oversight_mode) {
          errors.human_oversight_mode = ["Human oversight mode is required"];
        }
        break;

      case 5: // Data Assessment
        if (!formData.data_sensitivity) {
          errors.data_sensitivity = ["Data sensitivity is required"];
        }

        if (!formData.data_availability_status) {
          errors.data_availability_status = ["Data availability status is required"];
        }

        if (!formData.dependencies?.trim()) {
          errors.dependencies = ["Dependencies description is required"];
        } else if (formData.dependencies.trim().length > 2000) {
          errors.dependencies = ["Dependencies description must be 2000 characters or less"];
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate entire form
  const validateForm = (): boolean => {
    let isValid = true;
    for (let step = 1; step <= 5; step++) {
      if (!validateStep(step)) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
      setValidationErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setValidationErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle final submit
  const handleSubmit = async () => {
    setValidationErrors({});

    // Validate entire form
    if (!validateForm()) {
      // Find first step with errors
      for (let step = 1; step <= 5; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }
      return;
    }

    try {
      const payload: CreateUseCaseData = {
        // Step 1
        name: formData.name.trim(),
        problem_statement: formData.problem_statement.trim(),
        expected_business_value: formData.expected_business_value.trim(),
        stakeholder_ids: formData.stakeholder_ids,
        description: formData.description?.trim() || null,
        business_domain: formData.business_domain || null,
        business_owner_id: formData.business_owner_id,
        technical_owner_id: formData.technical_owner_id,
        status: formData.status,
        target_deployment_date: formData.target_deployment_date,

        // Step 2
        expected_roi: formData.expected_roi!,
        budget_allocated: formData.budget_allocated,
        estimated_implementation_cost: formData.estimated_implementation_cost,
        estimated_time_savings: formData.estimated_time_savings!,
        estimated_cost_savings: formData.estimated_cost_savings!,
        estimated_revenue_impact: formData.estimated_revenue_impact!,
        estimated_fte_saving: formData.estimated_fte_saving!,
        success_metrics: formData.success_metrics.trim(),

        // Step 3
        roi_classification: formData.roi_classification || null,
        priority: formData.priority || null,

        // Step 4
        preliminary_risk_level: formData.preliminary_risk_level,
        regulatory_impact: formData.regulatory_impact ? "yes" : "no",
        potential_harm: formData.potential_harm.trim(),
        human_oversight_mode: formData.human_oversight_mode as any,

        // Step 5
        data_sensitivity: formData.data_sensitivity,
        data_availability_status: formData.data_availability_status as any,
        data_readiness: formData.data_readiness || null,
        dependencies: formData.dependencies.trim(),
      };

      await createUseCase(payload).unwrap();

      // Reset form on success
      setFormData(initialFormData);
      setValidationErrors({});
      setCurrentStep(1);
      router.push("/core-assets/ai-use-cases");
    } catch (err: any) {
      // Handle backend validation errors
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        // Navigate to first step with errors
        for (let step = 1; step <= 5; step++) {
          const stepErrors = Object.keys(err.data.errors);
          if (stepErrors.length > 0) {
            setCurrentStep(step);
            break;
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfo
            formData={formData}
            setFormData={setFormData}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <Roi formData={formData} setFormData={setFormData} errors={validationErrors} />
        );
      case 3:
        return (
          <UseCaseClassification
            formData={formData}
            setFormData={setFormData}
            errors={validationErrors}
          />
        );
      case 4:
        return (
          <GovernanceRisk
            formData={formData}
            setFormData={setFormData}
            errors={validationErrors}
          />
        );
      case 5:
        return (
          <DataAssesment
            formData={formData}
            setFormData={setFormData}
            errors={validationErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Use Case
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your AI Model Use Case
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
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

          {/* Multi-Step Wizard */}
          <MultiStepWizard
            currentStep={currentStep}
            steps={WIZARD_STEPS}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            canProceed={true}
            submitLabel="Submit Use Case"
          >
            {renderStepContent()}
          </MultiStepWizard>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUseCases;