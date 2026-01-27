"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ModelDatasetLinkFormData } from "@/lib/schemas/modelDatasetLink.schema";
import { CreatedBy, LinkageStatus } from "@/app/lib/features/modelDatasetLinksApi";

const CREATED_BY_OPTIONS = [
  { value: CreatedBy.DATA_ENGINEERING_TEAM, label: "Data Engineering Team" },
  { value: CreatedBy.ML_PLATFORM_TEAM, label: "ML Platform Team" },
  { value: CreatedBy.PRIVACY_OFFICE, label: "Privacy Office" },
  { value: CreatedBy.AI_GOVERNANCE_BOARD, label: "AI Governance Board" },
];

const LINKAGE_STATUS_OPTIONS = [
  { value: LinkageStatus.PENDING_APPROVAL, label: "Pending Approval" },
  { value: LinkageStatus.APPROVED, label: "Approved" },
  { value: LinkageStatus.ACTIVE, label: "Active" },
  { value: LinkageStatus.DEPRECATED, label: "Deprecated" },
  { value: LinkageStatus.ARCHIVED, label: "Archived" },
];

export const GovernanceStatusStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ModelDatasetLinkFormData>();

  const createdBySystem = watch("created_by_system");
  const linkageStatus = watch("linkage_status");

  const hasError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Governance & Status <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Created By System */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="created_by_system">
                Created By System <span className="text-red-500">*</span>
              </Label>
              {/* <Link
                href="/core-assets/stakeholders"
                className="text-sm text-[#4FD58F] hover:underline flex items-center gap-1"
              >
                Manage
                <ExternalLink className="h-3 w-3" />
              </Link> */}
            </div>
            <Select
              key={`created_by_system-${createdBySystem || "none"}`}
              value={createdBySystem || ""}
              onValueChange={(value) =>
                setValue("created_by_system", value as CreatedBy, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("created_by_system") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {CREATED_BY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("created_by_system") && (
              <p className="text-sm text-red-500">{getError("created_by_system")}</p>
            )}
          </div>

          {/* Linkage Status */}
          <div className="space-y-2">
            <Label htmlFor="linkage_status">
              Linkage Status <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`linkage_status-${linkageStatus || "none"}`}
              value={linkageStatus || ""}
              onValueChange={(value) =>
                setValue("linkage_status", value as LinkageStatus, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("linkage_status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {LINKAGE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("linkage_status") && (
              <p className="text-sm text-red-500">{getError("linkage_status")}</p>
            )}
          </div>

          {/* Business Justification */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="business_justification">Business Justification</Label>
            <Textarea
              id="business_justification"
              {...register("business_justification")}
              placeholder="Explain the business rationale for this model-dataset link..."
              className="min-h-32 resize-none w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

