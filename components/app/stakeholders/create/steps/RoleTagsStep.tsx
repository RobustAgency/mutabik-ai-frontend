"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle } from "lucide-react";
import type { StakeholderFormData } from "@/lib/schemas/stakeholder.schema";

const ROLE_OPTIONS = [
  // AI/ML Governance Roles
  { value: "model_owner", label: "Model Owner", category: "AI/ML" },
  { value: "data_scientist", label: "Data Scientist", category: "AI/ML" },
  { value: "ml_engineer", label: "ML Engineer", category: "AI/ML" },
  { value: "ai_governance", label: "AI Governance Lead", category: "AI/ML" },
  // Data Governance Roles
  { value: "data_owner", label: "Data Owner", category: "Data" },
  { value: "data_steward", label: "Data Steward", category: "Data" },
  { value: "data_custodian", label: "Data Custodian", category: "Data" },
  { value: "data_engineer", label: "Data Engineer", category: "Data" },
  // Privacy & Compliance Roles
  { value: "dpo", label: "Data Protection Officer (DPO)", category: "Privacy" },
  { value: "privacy_officer", label: "Privacy Officer", category: "Privacy" },
  { value: "compliance_officer", label: "Compliance Officer", category: "Privacy" },
  // Risk & Security Roles
  { value: "risk_analyst", label: "Risk Analyst", category: "Risk" },
  { value: "security_ir", label: "Security IR", category: "Risk" },
  { value: "ciso", label: "CISO", category: "Risk" },
  // Business Roles
  { value: "business_owner", label: "Business Owner", category: "Business" },
  { value: "product_owner", label: "Product Owner", category: "Business" },
  { value: "individual_contributor", label: "Individual Contributor", category: "Business" },
  // Approval Authority
  { value: "approver_l1", label: "Approver - Level 1", category: "Approval" },
  { value: "approver_l2", label: "Approver - Level 2", category: "Approval" },
  { value: "executive_sponsor", label: "Executive Sponsor", category: "Approval" },
];

const ROLE_CATEGORIES = ["AI/ML", "Data", "Privacy", "Risk", "Business", "Approval"];

export const RoleTagsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StakeholderFormData>();

  const roleTags = watch("role_tags") || [];

  const handleRoleToggle = (roleValue: string) => {
    const newRoleTags = roleTags.includes(roleValue)
      ? roleTags.filter((r) => r !== roleValue)
      : [...roleTags, roleValue];
    setValue("role_tags", newRoleTags, { shouldValidate: true });
  };

  const removeRole = (roleValue: string) => {
    setValue(
      "role_tags",
      roleTags.filter((r) => r !== roleValue),
      { shouldValidate: true }
    );
  };

  const getRoleLabel = (value: string): string => {
    const role = ROLE_OPTIONS.find((r) => r.value === value);
    return role ? role.label : value;
  };

  const hasError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 4: Role Tags
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="role_tags">
            Select role tags <span className="text-red-500">*</span>
          </Label>
          {hasError("role_tags") && (
            <p className="text-sm text-red-500 mt-1">{getError("role_tags")}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Click on roles to select or deselect them. At least one role tag is required.
          </p>

          {/* Role Categories */}
          <div className="border border-gray-200 rounded-lg divide-y">
            {ROLE_CATEGORIES.map((category) => (
              <div key={category} className="p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.filter((r) => r.category === category).map((role) => {
                    const isSelected = roleTags.includes(role.value);
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleToggle(role.value)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors flex items-center gap-1 ${
                          isSelected
                            ? "bg-green-50 border-[#039855] text-[#039855]"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3 h-3" />}
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Roles Display */}
        {roleTags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected roles ({roleTags.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {roleTags.map((roleValue) => (
                <Badge
                  key={roleValue}
                  variant="light"
                  color="success"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {getRoleLabel(roleValue)}
                  <button
                    type="button"
                    onClick={() => removeRole(roleValue)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

