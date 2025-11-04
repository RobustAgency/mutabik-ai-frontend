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

interface BasicInfoProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}


const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData, errors = {} }) => {
  const [nameInput, setNameInput] = useState(formData.name);
  const [descriptionInput, setDescriptionInput] = useState(formData.description || "");
  const [businessObjectiveInput, setBusinessObjectiveInput] = useState(formData.business_objective || "");
  const [createdByInput, setCreatedByInput] = useState(formData.created_by || "");

  // No need to fetch stakeholders here - StakeholderSelector handles it

  useEffect(() => {
    setNameInput(formData.name);
    setDescriptionInput(formData.description || "");
    setBusinessObjectiveInput(formData.business_objective || "");
    setCreatedByInput(formData.created_by || "");
  }, [formData]);

  // Business domain options based on new schema
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

  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6 w-full">
      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Basic Info
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="gap-6 w-full flex flex-col">
        {/* Name + Status */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Use Case Name <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, name: nameInput }))}
              placeholder="Retail Credit Risk Scoring"
              className={`h-[44px] w-full px-4 rounded-lg border ${hasError("name") ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("name") && (
              <p className="text-sm text-red-500">{getError("name")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status <span className="text-red-500">*</span></Label>
            <Select
              required
              value={formData.status}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, status: val as FormDataType["status"] }))
              }
            >
              <SelectTrigger className="gap-2 w-full px-4 py-[22px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0">
                <SelectValue placeholder="Draft" />
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
        </div>

        {/* Description + Business Objective */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full min-w-0">
            <Label>
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              required
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, description: descriptionInput }))}
              placeholder="Enter detailed scope (100-5000 characters)..."
              className={`placeholder:text-muted-foreground border dark:bg-input/30 flex min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[74px] resize-none focus:outline-none focus:ring-0 focus:border-transparent ${hasError("description") ? "border-red-500" : ""}`}
            />
            {hasError("description") && (
              <p className="text-sm text-red-500">{getError("description")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full min-w-0">
            <Label>
              Business Objective <span className="text-red-500">*</span>
            </Label>
            <Textarea
              required
              value={businessObjectiveInput}
              onChange={(e) => setBusinessObjectiveInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, business_objective: businessObjectiveInput }))}
              placeholder="Enter expected outcomes (50-2000 characters)..."
              className={`h-[74px] resize-none ${hasError("business_objective") ? "border-red-500" : ""}`}
            />
            {hasError("business_objective") && (
              <p className="text-sm text-red-500">{getError("business_objective")}</p>
            )}
          </div>
        </div>

        {/* Domain + Stakeholder IDs */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Business Domain <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.business_domain}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, business_domain: value as FormDataType["business_domain"] }))}
            >
              <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("business_domain") ? "border-red-500" : "border-[#D0D5DD]"
                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
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

          <StakeholderSelectorWithInline
            label="Business Owner"
            value={formData.business_owner_id}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, business_owner_id: value }))}
            placeholder="Select Business Owner"
            description="Select the business stakeholder responsible for this use case"
            filterType="person"
            error={hasError("business_owner_id") ? getError("business_owner_id") : undefined}
          />

          <StakeholderSelectorWithInline
            label="Technical Owner"
            value={formData.technical_owner_id}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, technical_owner_id: value }))}
            placeholder="Select Technical Owner"
            description="Select the technical stakeholder responsible for this use case"
            filterType="person"
            error={hasError("technical_owner_id") ? getError("technical_owner_id") : undefined}
          />
        </div>

        {/* Data Sensitivity + Target Go Live Date + Created By */}
        <div className="flex flex-col md:flex-row w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <Label>Data Sensitivity</Label>
            <Select
              value={formData.data_sensitivity}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, data_sensitivity: value as FormDataType["data_sensitivity"] }))
              }
            >
              <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0">
                <SelectValue placeholder="Public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>Target Go Live Date</Label>
            <Input
              type="date"
              value={formData.target_go_live_date || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, target_go_live_date: e.target.value }))}
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Label>
              Created By <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="email"
              value={createdByInput}
              onChange={(e) => setCreatedByInput(e.target.value)}
              onBlur={() => setFormData((prev) => ({ ...prev, created_by: createdByInput }))}
              placeholder="creator@example.com"
              className={`h-[44px] w-full px-4 rounded-lg border ${hasError("created_by") ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("created_by") && (
              <p className="text-sm text-red-500">{getError("created_by")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;