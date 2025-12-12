"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "../types/useCaseTypes";
import StakeholderSelectorWithInline from "./StakeholderSelectorWithInline";
import MultiStakeholderSelector from "./MultiStakeholderSelector";

interface BasicInfoProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}


const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData, errors = {} }) => {
  const [nameInput, setNameInput] = useState(formData.name);
  const [descriptionInput, setDescriptionInput] = useState(formData.description || "");
  const [problemStatementInput, setProblemStatementInput] = useState(formData.problem_statement || "");
  const [expectedBusinessValueInput, setExpectedBusinessValueInput] = useState(formData.expected_business_value || "");

  useEffect(() => {
    setNameInput(formData.name);
    setDescriptionInput(formData.description || "");
    setProblemStatementInput(formData.problem_statement || "");
    setExpectedBusinessValueInput(formData.expected_business_value || "");
  }, [formData]);

  // Business domain options based on backend enums
  const businessDomainOptions = [
    { value: "operations", label: "Operations" },
    { value: "finance", label: "Finance" },
    { value: "risk", label: "Risk" },
    { value: "compliance", label: "Compliance" },
    { value: "customer_service", label: "Customer Service" },
    { value: "hr", label: "HR" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "it", label: "IT" },
    { value: "procurement", label: "Procurement" },
    { value: "supply_chain", label: "Supply Chain" },
    { value: "legal", label: "Legal" },
    { value: "strategy", label: "Strategy" },
    { value: "other", label: "Other" },
  ];

  // Status options based on backend enums
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "staging", label: "Staging" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "on_hold", label: "On Hold" },
    { value: "in_production", label: "In Production" },
    { value: "retired", label: "Retired" },
  ];


  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6 w-full">
      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 1: Basic Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="gap-6 w-full flex flex-col">
        {/* Use Case Name */}
        <div className="flex flex-col gap-2 w-full">
          <Label>
            Use Case Name <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => setFormData((prev) => ({ ...prev, name: nameInput }))}
            placeholder="e.g., Retail Credit Risk Scoring"
            className={`h-11 w-full px-4 rounded-lg border ${
              hasError("name") ? "border-red-500" : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {hasError("name") && (
            <p className="text-sm text-red-500">{getError("name")}</p>
          )}
        </div>

        {/* Problem Statement */}
        <div className="flex flex-col gap-2 w-full">
          <Label>
            Problem Statement <span className="text-red-500">*</span>
          </Label>
          <Textarea
            required
            value={problemStatementInput}
            onChange={(e) => setProblemStatementInput(e.target.value)}
            onBlur={() =>
              setFormData((prev) => ({ ...prev, problem_statement: problemStatementInput }))
            }
            placeholder="Describe the problem this use case will solve (minimum 50 characters)..."
            className={`min-h-24 resize-none ${
              hasError("problem_statement") ? "border-red-500" : ""
            }`}
          />
          {hasError("problem_statement") && (
            <p className="text-sm text-red-500">{getError("problem_statement")}</p>
          )}
          <p className="text-xs text-gray-500">
            {problemStatementInput.length} / 2000 characters (minimum 50)
          </p>
        </div>

        {/* Description (optional) */}
        <div className="flex flex-col gap-2 w-full">
          <Label>Description</Label>
          <Textarea
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            onBlur={() => setFormData((prev) => ({ ...prev, description: descriptionInput }))}
            placeholder="Enter detailed description (optional, 100-5000 characters if provided)..."
            className={`min-h-24 resize-none ${hasError("description") ? "border-red-500" : ""}`}
          />
          {hasError("description") && (
            <p className="text-sm text-red-500">{getError("description")}</p>
          )}
          <p className="text-xs text-gray-500">
            {descriptionInput.length} / 5000 characters {descriptionInput.length > 0 && descriptionInput.length < 100 ? "(minimum 100 if provided)" : ""}
          </p>
        </div>

        {/* Expected Business Value */}
        <div className="flex flex-col gap-2 w-full">
          <Label>
            Expected Business Value <span className="text-red-500">*</span>
          </Label>
          <Textarea
            required
            value={expectedBusinessValueInput}
            onChange={(e) => setExpectedBusinessValueInput(e.target.value)}
            onBlur={() =>
              setFormData((prev) => ({
                ...prev,
                expected_business_value: expectedBusinessValueInput,
              }))
            }
            placeholder="Describe the expected business value and outcomes (minimum 50 characters)..."
            className={`min-h-24 resize-none ${
              hasError("expected_business_value") ? "border-red-500" : ""
            }`}
          />
          {hasError("expected_business_value") && (
            <p className="text-sm text-red-500">{getError("expected_business_value")}</p>
          )}
          <p className="text-xs text-gray-500">
            {expectedBusinessValueInput.length} / 2000 characters (minimum 50)
          </p>
        </div>

        {/* Business Function/Domain */}
        <div className="flex flex-col gap-2 w-full">
          <Label>Business Function / Domain</Label>
          <Select
            key={`business_domain-${formData.business_domain || "none"}`}
            value={formData.business_domain}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                business_domain: value as FormDataType["business_domain"],
              }))
            }
          >
            <SelectTrigger
              className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${
                hasError("business_domain") ? "border-red-500" : "border-[#D0D5DD]"
              } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}
            >
              <SelectValue placeholder="Select Business Domain" />
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
            <p className="text-sm text-red-500">{getError("business_domain")}</p>
          )}
        </div>

        {/* Stakeholders (Multi-select) */}
        <MultiStakeholderSelector
          label="Stakeholders"
          value={formData.stakeholder_ids}
          onValueChange={(values) =>
            setFormData((prev) => ({ ...prev, stakeholder_ids: values }))
          }
          placeholder="Select stakeholders"
          description="Select all stakeholders involved in this use case"
          filterType="all"
          required
          error={hasError("stakeholder_ids") ? getError("stakeholder_ids") : undefined}
        />

        {/* Business Owner + Technical Owner */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <StakeholderSelectorWithInline
            label="Business Owner"
            value={formData.business_owner_id}
            onValueChange={(value) =>
              setFormData((prev) => ({ 
                ...prev, 
                business_owner_id: typeof value === 'string' ? parseInt(value, 10) : value 
              }))
            }
            placeholder="Select Business Owner"
            description="Select the business stakeholder responsible for this use case"
            filterType="all"
            error={hasError("business_owner_id") ? getError("business_owner_id") : undefined}
          />

          <StakeholderSelectorWithInline
            label="Technical Owner"
            value={formData.technical_owner_id}
            onValueChange={(value) =>
              setFormData((prev) => ({ 
                ...prev, 
                technical_owner_id: typeof value === 'string' ? parseInt(value, 10) : value 
              }))
            }
            placeholder="Select Technical Owner"
            description="Select the technical stakeholder responsible for this use case"
            filterType="all"
            error={hasError("technical_owner_id") ? getError("technical_owner_id") : undefined}
          />
        </div>

        {/* Use Case Status + Target Deployment Date */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>Use Case Status</Label>
            <Select
              key={`status-${formData.status || "none"}`}
              value={formData.status}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, status: val as FormDataType["status"] }))
              }
            >
              <SelectTrigger className="gap-2 w-full px-4 py-[22px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0">
                <SelectValue placeholder="Draft" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Target Deployment Date</Label>
            <Input
              type="date"
              value={formData.target_deployment_date || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, target_deployment_date: e.target.value }))
              }
              className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;