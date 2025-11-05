"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateUseCaseMutation } from "@/app/lib/features/useCasesApi";
import { CreateUseCaseData } from "@/service/app/useCases";
import StakeholderSelectorWithInline from "./StakeholderSelectorWithInline";

interface UseCaseModalFormProps {
  onSuccess?: (useCase: any) => void;
  onCancel?: () => void;
}

const UseCaseModalForm: React.FC<UseCaseModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createUseCase, { isLoading }] = useCreateUseCaseMutation();

  const [formData, setFormData] = useState<CreateUseCaseData>({
    name: "",
    description: "",
    business_objective: "",
    business_owner_id: null,
    technical_owner_id: null,
    business_domain: "",
    use_case_type: "predictive_model",
    priority: "medium",
    status: "draft",
    data_sensitivity: "internal",
    created_by: "",
    target_go_live_date: null,
    estimated_budget: null,
    funding_status: "not_funded",
    ai_techniques_used: [],
    ml_lifecycle_stage: "business_understanding",
    expected_annual_volume: null,
    expected_users_count: null,
    risk_profile: "low",
    regulatory_scope_gdpr: false,
    regulatory_scope_ccpa: false,
    regulatory_scope_other: [],
    requires_human_oversight: true,
    appeals_mechanism: false,
    third_party_dependencies: [],
    integration_points: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const businessDomainOptions = [
    { value: "customer_service", label: "Customer Service" },
    { value: "fraud_detection", label: "Fraud Detection" },
    { value: "marketing", label: "Marketing" },
    { value: "operations", label: "Operations" },
    { value: "risk_management", label: "Risk Management" },
    { value: "hr", label: "HR" },
    { value: "finance", label: "Finance" },
    { value: "legal", label: "Legal" },
    { value: "product_development", label: "Product Development" },
    { value: "supply_chain", label: "Supply Chain" },
  ];

  const handleInputChange = (field: keyof CreateUseCaseData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasError = (fieldName: string) => validationErrors[fieldName] && validationErrors[fieldName].length > 0;
  const getError = (fieldName: string) => validationErrors[fieldName]?.[0];

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Name validation (5-255 characters)
    if (!formData.name?.trim()) {
      errors.name = ["Use case name is required"];
    } else if (formData.name.trim().length < 5 || formData.name.trim().length > 255) {
      errors.name = ["Use case name must be between 5-255 characters"];
    }

    // Description validation (100-5000 characters)
    if (!formData.description?.trim()) {
      errors.description = ["Description is required"];
    } else if (formData.description.trim().length < 100) {
      errors.description = ["The description field must be at least 100 characters"];
    } else if (formData.description.trim().length > 5000) {
      errors.description = ["Description must not exceed 5000 characters"];
    }

    // Business objective validation (50-2000 characters)
    if (!formData.business_objective?.trim()) {
      errors.business_objective = ["Business objective is required"];
    } else if (formData.business_objective.trim().length < 50) {
      errors.business_objective = ["The business objective field must be at least 50 characters"];
    } else if (formData.business_objective.trim().length > 2000) {
      errors.business_objective = ["Business objective must not exceed 2000 characters"];
    }

    // Business domain validation
    if (!formData.business_domain?.trim()) {
      errors.business_domain = ["Business domain is required"];
    }

    // Created by validation
    if (!formData.created_by?.trim()) {
      errors.created_by = ["Creator email is required"];
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.created_by)) {
        errors.created_by = ["Please enter a valid email address"];
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationErrors({});

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createUseCase(formData).unwrap();

      if (onSuccess && result) {
        onSuccess(result);
      }
    } catch (error: any) {
      if (error?.data?.errors) {
        setValidationErrors(error.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
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

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-[#039855]">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">
              Use Case Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Retail Credit Risk Scoring"
              className={hasError("name") ? "border-destructive" : ""}
            />
            {hasError("name") && (
              <p className="text-sm text-destructive">{getError("name")}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed description of the use case (minimum 100 characters)"
              rows={3}
              className={hasError("description") ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              <div>
                {hasError("description") && (
                  <p className="text-sm text-destructive">{getError("description")}</p>
                )}
              </div>
              <p className={`text-xs ${(formData.description?.length || 0) < 100 ? "text-amber-600" : "text-[#667085]"}`}>
                {formData.description?.length || 0} / 100 min
              </p>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="business_objective">
              Business Objective <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="business_objective"
              value={formData.business_objective}
              onChange={(e) => handleInputChange("business_objective", e.target.value)}
              placeholder="Expected business outcomes (minimum 50 characters)"
              rows={2}
              className={hasError("business_objective") ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              <div>
                {hasError("business_objective") && (
                  <p className="text-sm text-destructive">{getError("business_objective")}</p>
                )}
              </div>
              <p className={`text-xs ${(formData.business_objective?.length || 0) < 50 ? "text-amber-600" : "text-[#667085]"}`}>
                {formData.business_objective?.length || 0} / 50 min
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_domain">
              Business Domain <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.business_domain}
              onValueChange={(value) => handleInputChange("business_domain", value)}
            >
              <SelectTrigger className={`w-full ${hasError("business_domain") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {businessDomainOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("business_domain") && (
              <p className="text-sm text-destructive">{getError("business_domain")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_development">In Development</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="created_by">
              Created By <span className="text-red-500">*</span>
            </Label>
            <Input
              id="created_by"
              type="email"
              value={formData.created_by}
              onChange={(e) => handleInputChange("created_by", e.target.value)}
              placeholder="creator@example.com"
              className={hasError("created_by") ? "border-destructive" : ""}
            />
            {hasError("created_by") && (
              <p className="text-sm text-destructive">{getError("created_by")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ownership */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-[#039855]">Ownership</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StakeholderSelectorWithInline
            label="Business Owner"
            value={formData.business_owner_id}
            onValueChange={(value) => handleInputChange("business_owner_id", value)}
            placeholder="Select Business Owner"
            description="Business stakeholder responsible"
            filterType="person"
            error={hasError("business_owner_id") ? getError("business_owner_id") : undefined}
          />

          <StakeholderSelectorWithInline
            label="Technical Owner"
            value={formData.technical_owner_id}
            onValueChange={(value) => handleInputChange("technical_owner_id", value)}
            placeholder="Select Technical Owner"
            description="Technical stakeholder responsible"
            filterType="person"
            error={hasError("technical_owner_id") ? getError("technical_owner_id") : undefined}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#4FD58F] hover:bg-[#3fc77f]"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Use Case"}
        </Button>
      </div>
    </form>
  );
};

export default UseCaseModalForm;

