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
    roi_classification: "",
    priority: "",
    risk_level: "medium",
    data_sensitivity: "internal",
    expected_roi_percentage: null,
    budget_allocated: null,
    target_go_live_date: null,
    status: "draft",
    created_by: "",
    updated_by: null,
    roi_assessment: false,
    risk_assessment: false,
    data_assessment: false,
    estimated_implementation_cost: null,
    estimated_reduction_in_time: null,
    estimated_reduction_in_cost: null,
    estimated_revenue_increase: null,
    estimated_fte_capacity_saving: null,
    data_availability_status: "",
    data_readiness: "",
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
        <h3 className="font-bold text-base text-[#039855]">Ownership & Contacts</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StakeholderSelectorWithInline
            label="Business Owner"
            value={formData.business_owner_id}
            onValueChange={(value) => handleInputChange("business_owner_id", value)}
            placeholder="Select Business Owner"
            description="Business stakeholder responsible"
            filterType="all"
            error={hasError("business_owner_id") ? getError("business_owner_id") : undefined}
          />

          <StakeholderSelectorWithInline
            label="Technical Owner"
            value={formData.technical_owner_id}
            onValueChange={(value) => handleInputChange("technical_owner_id", value)}
            placeholder="Select Technical Owner"
            description="Technical stakeholder responsible"
            filterType="all"
            error={hasError("technical_owner_id") ? getError("technical_owner_id") : undefined}
          />

          <div className="space-y-2">
            <Label htmlFor="data_sensitivity">
              Data Sensitivity
            </Label>
            <Select
              value={formData.data_sensitivity}
              onValueChange={(value) => handleInputChange("data_sensitivity", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_go_live_date">
              Target Go Live Date
            </Label>
            <Input
              id="target_go_live_date"
              type="date"
              value={formData.target_go_live_date || ""}
              onChange={(e) => handleInputChange("target_go_live_date", e.target.value || null)}
              className={hasError("target_go_live_date") ? "border-destructive" : ""}
            />
            {hasError("target_go_live_date") && (
              <p className="text-sm text-destructive">{getError("target_go_live_date")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-[#039855]">Financial Metrics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expected_roi_percentage">
              Expected ROI (%)
            </Label>
            <Input
              id="expected_roi_percentage"
              type="number"
              step="0.01"
              min="0"
              max="999.99"
              value={formData.expected_roi_percentage ?? ""}
              onChange={(e) => handleInputChange("expected_roi_percentage", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("expected_roi_percentage") ? "border-destructive" : ""}
            />
            {hasError("expected_roi_percentage") && (
              <p className="text-sm text-destructive">{getError("expected_roi_percentage")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_implementation_cost">
              Implementation Cost ($)
            </Label>
            <Input
              id="estimated_implementation_cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.estimated_implementation_cost ?? ""}
              onChange={(e) => handleInputChange("estimated_implementation_cost", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("estimated_implementation_cost") ? "border-destructive" : ""}
            />
            {hasError("estimated_implementation_cost") && (
              <p className="text-sm text-destructive">{getError("estimated_implementation_cost")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_revenue_increase">
              Increase in Revenue ($)
            </Label>
            <Input
              id="estimated_revenue_increase"
              type="number"
              step="0.01"
              min="0"
              value={formData.estimated_revenue_increase ?? ""}
              onChange={(e) => handleInputChange("estimated_revenue_increase", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("estimated_revenue_increase") ? "border-destructive" : ""}
            />
            {hasError("estimated_revenue_increase") && (
              <p className="text-sm text-destructive">{getError("estimated_revenue_increase")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_reduction_in_time">
              Reduction in Time (hrs)
            </Label>
            <Input
              id="estimated_reduction_in_time"
              type="number"
              step="0.01"
              min="0"
              value={formData.estimated_reduction_in_time ?? ""}
              onChange={(e) => handleInputChange("estimated_reduction_in_time", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("estimated_reduction_in_time") ? "border-destructive" : ""}
            />
            {hasError("estimated_reduction_in_time") && (
              <p className="text-sm text-destructive">{getError("estimated_reduction_in_time")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_reduction_in_cost">
              Reduction in Cost ($)
            </Label>
            <Input
              id="estimated_reduction_in_cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.estimated_reduction_in_cost ?? ""}
              onChange={(e) => handleInputChange("estimated_reduction_in_cost", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("estimated_reduction_in_cost") ? "border-destructive" : ""}
            />
            {hasError("estimated_reduction_in_cost") && (
              <p className="text-sm text-destructive">{getError("estimated_reduction_in_cost")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_fte_capacity_saving">
              FTE Capacity Saved
            </Label>
            <Input
              id="estimated_fte_capacity_saving"
              type="number"
              step="0.01"
              min="0"
              value={formData.estimated_fte_capacity_saving ?? ""}
              onChange={(e) => handleInputChange("estimated_fte_capacity_saving", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("estimated_fte_capacity_saving") ? "border-destructive" : ""}
            />
            {hasError("estimated_fte_capacity_saving") && (
              <p className="text-sm text-destructive">{getError("estimated_fte_capacity_saving")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget_allocated">
              Budget Allocated ($)
            </Label>
            <Input
              id="budget_allocated"
              type="number"
              step="0.01"
              min="0"
              value={formData.budget_allocated ?? ""}
              onChange={(e) => handleInputChange("budget_allocated", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.00"
              className={hasError("budget_allocated") ? "border-destructive" : ""}
            />
            {hasError("budget_allocated") && (
              <p className="text-sm text-destructive">{getError("budget_allocated")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Risk & Governance */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-[#039855]">Risk & Governance</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="risk_level">
              Risk Level
            </Label>
            <Select
              value={formData.risk_level}
              onValueChange={(value) => handleInputChange("risk_level", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roi_classification">
              ROI Classification
            </Label>
            <Select
              value={formData.roi_classification}
              onValueChange={(value) => handleInputChange("roi_classification", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roi_assessment">
              ROI Assessment Completed
            </Label>
            <Select
              value={formData.roi_assessment ? "true" : "false"}
              onValueChange={(value) => handleInputChange("roi_assessment", value === "true")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk_assessment">
              Risk Assessment Completed
            </Label>
            <Select
              value={formData.risk_assessment ? "true" : "false"}
              onValueChange={(value) => handleInputChange("risk_assessment", value === "true")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_assessment">
              Data Assessment Completed
            </Label>
            <Select
              value={formData.data_assessment ? "true" : "false"}
              onValueChange={(value) => handleInputChange("data_assessment", value === "true")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Assessment */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-[#039855]">Data Assessment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_availability_status">
              Data Availability Status
            </Label>
            <Select
              value={formData.data_availability_status}
              onValueChange={(value) => handleInputChange("data_availability_status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="partially_available">Partially Available</SelectItem>
                <SelectItem value="not_available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_readiness">
              Data Readiness Level
            </Label>
            <Select
              value={formData.data_readiness}
              onValueChange={(value) => handleInputChange("data_readiness", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="D1">D1</SelectItem>
                <SelectItem value="D2">D2</SelectItem>
                <SelectItem value="D3">D3</SelectItem>
                <SelectItem value="D4">D4</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

