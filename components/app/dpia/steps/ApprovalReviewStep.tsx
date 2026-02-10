"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";
import MultiStakeholderSelector from "@/components/app/useCases/create/MultiStakeholderSelector";
import type { DPIAFormData } from "@/lib/schemas/dpia.schema";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "in_progress", label: "In Progress" },
  { value: "dpo_review", label: "DPO Review" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const finalDecisionOptions = [
  { value: "approved", label: "Approved" },
  { value: "approved_with_conditions", label: "Approved with Conditions" },
  { value: "rejected", label: "Rejected" },
  { value: "deferred", label: "Deferred" },
];

const jurisdictionOptions = [
  { value: "eu", label: "EU" },
  { value: "uae", label: "UAE" },
  { value: "uk", label: "UK" },
  { value: "ksa", label: "KSA" },
  { value: "difc", label: "DIFC" },
];

export const ApprovalReviewStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DPIAFormData>();

  const { data: usersResponse, isLoading: isLoadingUsers } =
    useGetOrganizationUsersQuery({
      per_page: 100,
    });
  const users = usersResponse?.data ?? [];

  const stakeholders = watch("stakeholders_consulted") || [];
  const jurisdictions = watch("applicable_jurisdictions") || [];
  const stage = watch("stage");
  const finalDecision = watch("final_decision");
  const approvedBy = watch("approved_by");

  const isApprovalStage = stage === "approval";

  const userOptions = useMemo(() => {
    const base =
      users?.map((user: any) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    // Ensure currently selected user is present in options
    if (approvedBy) {
      const exists = base.some(
        (opt) => opt.value === approvedBy.toString()
      );
      if (!exists) {
        base.unshift({
          value: approvedBy.toString(),
          label: `User #${approvedBy}`,
        });
      }
    }

    return base;
  }, [users, approvedBy]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`status-${watch("status") || "none"}`}
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
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

        <div className="space-y-2">
          <Label htmlFor="review_frequency_months">
            Review Frequency (months) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="review_frequency_months"
            type="number"
            min={1}
            {...register("review_frequency_months", { valueAsNumber: true })}
            className={`w-full ${
              errors.review_frequency_months ? "border-red-500" : ""
            }`}
          />
          {errors.review_frequency_months && (
            <p className="text-sm text-red-500">
              {errors.review_frequency_months.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Applicable Jurisdictions <span className="text-red-500">*</span>
          </Label>
          <CustomMultiSelect
            options={jurisdictionOptions}
            value={jurisdictions}
            onChange={(value) =>
              setValue("applicable_jurisdictions", value as any)
            }
            placeholder="Select jurisdictions"
            className={`w-full ${
              errors.applicable_jurisdictions ? "border-red-500" : ""
            }`}
          />
          {errors.applicable_jurisdictions && (
            <p className="text-sm text-red-500">
              {errors.applicable_jurisdictions.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <MultiStakeholderSelector
          label="Stakeholders Consulted"
          value={stakeholders}
          onValueChange={(ids) => setValue("stakeholders_consulted", ids)}
          placeholder="Select stakeholders"
          description="Optional: stakeholders consulted during the DPIA"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stakeholder_feedback">Stakeholder Feedback</Label>
        <Textarea
          id="stakeholder_feedback"
          {...register("stakeholder_feedback")}
          className="w-full min-h-[100px] resize-none"
          placeholder="Feedback from consulted stakeholders"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="final_decision">
            Final Decision{" "}
            {isApprovalStage && <span className="text-red-500">*</span>}
          </Label>
          <Select
            key={`final_decision-${watch("final_decision") || "none"}`}
            value={watch("final_decision") || ""}
            onValueChange={(value) =>
              setValue("final_decision", (value || null) as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select final decision" />
            </SelectTrigger>
            <SelectContent>
              {finalDecisionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.final_decision && (
            <p className="text-sm text-red-500">
              {errors.final_decision.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approval_date">
            Approval Date{" "}
            {isApprovalStage && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="approval_date"
            type="date"
            {...register("approval_date")}
            className={`w-full ${
              errors.approval_date ? "border-red-500" : ""
            }`}
          />
          {errors.approval_date && (
            <p className="text-sm text-red-500">
              {errors.approval_date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="approved_by">
            Approved By{" "}
            {isApprovalStage && <span className="text-red-500">*</span>}
          </Label>
          <Select
            key={`approved-by-${approvedBy || "none"}-${userOptions.length}`}
            value={approvedBy ? approvedBy.toString() : ""}
            onValueChange={(value) =>
              setValue("approved_by", Number(value) as any)
            }
            disabled={isLoadingUsers}
          >
            <SelectTrigger
              className={`w-full ${
                errors.approved_by ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {userOptions.length > 0 ? (
                userOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-users" disabled>
                  {isLoadingUsers ? "Loading users..." : "No users found"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.approved_by && (
            <p className="text-sm text-red-500">
              {errors.approved_by.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="conditions">
          Conditions{" "}
          {finalDecision === "approved_with_conditions" && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Textarea
          id="conditions"
          {...register("conditions")}
          className={`w-full min-h-[100px] resize-none ${
            errors.conditions ? "border-red-500" : ""
          }`}
          placeholder="Conditions for approval (if applicable)"
          rows={4}
        />
        {errors.conditions && (
          <p className="text-sm text-red-500">{errors.conditions.message}</p>
        )}
      </div>
    </div>
  );
};


