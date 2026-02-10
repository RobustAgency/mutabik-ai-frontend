"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CorrectivePreventiveActionFormData } from "@/lib/schemas/correctivePreventiveAction.schema";
import {
  OwnerTeam,
  Status,
} from "@/app/lib/features/correctivePreventiveActionsApi";

const OWNER_TEAM_OPTIONS = [
  { value: OwnerTeam.AI_GOVERNANCE, label: "AI Governance" },
  { value: OwnerTeam.DATA_PRIVACY_OFFICE, label: "Data Privacy Office" },
  { value: OwnerTeam.DATA_GOVERNANCE, label: "Data Governance" },
  { value: OwnerTeam.ML_ENGINEERING, label: "ML Engineering" },
  { value: OwnerTeam.DATA_ENGINEERING, label: "Data Engineering" },
  { value: OwnerTeam.INFORMATION_SECURITY, label: "Information Security" },
  { value: OwnerTeam.LEGAL, label: "Legal" },
  { value: OwnerTeam.COMPLIANCE, label: "Compliance" },
  { value: OwnerTeam.EXECUTIVE_LEADERSHIP, label: "Executive Leadership" },
  { value: OwnerTeam.PRODUCT, label: "Product" },
  { value: OwnerTeam.CUSTOMER_SUCCESS, label: "Customer Success" },
];

const STATUS_OPTIONS = [
  { value: Status.NEW, label: "New" },
  { value: Status.IN_PROGRESS, label: "In Progress" },
  { value: Status.BLOCKED, label: "Blocked" },
  { value: Status.PENDING_VERIFICATION, label: "Pending Verification" },
  { value: Status.CLOSED, label: "Closed" },
  { value: Status.OVERDUE, label: "Overdue" },
];

export const AssignmentStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CorrectivePreventiveActionFormData>();

  const ownerTeam = watch("owner_team");
  const assignee = watch("assignee");
  const dueDate = watch("due_date");
  const status = watch("status");

  const hasError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  // Format date for input field
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Assignment & Timeline <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Team */}
        <div className="space-y-2">
          <Label htmlFor="owner_team">
            Owner Team <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`owner_team-${ownerTeam || "none"}`}
            value={ownerTeam || ""}
            onValueChange={(value) =>
              setValue("owner_team", value as OwnerTeam, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("owner_team")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select owner team" />
            </SelectTrigger>
            <SelectContent>
              {OWNER_TEAM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("owner_team") && (
            <p className="text-sm text-red-500">{getError("owner_team")}</p>
          )}
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            value={assignee || ""}
            onChange={(e) =>
              setValue("assignee", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Name of assignee"
            className={hasError("assignee") ? "border-red-500" : ""}
          />
          {hasError("assignee") && (
            <p className="text-sm text-red-500">{getError("assignee")}</p>
          )}
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="due_date">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="due_date"
            type="date"
            value={formatDateForInput(dueDate)}
            onChange={(e) =>
              setValue("due_date", e.target.value, { shouldValidate: true })
            }
            className={hasError("due_date") ? "border-red-500" : ""}
          />
          {hasError("due_date") && (
            <p className="text-sm text-red-500">{getError("due_date")}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`status-${status || "none"}`}
            value={status || ""}
            onValueChange={(value) =>
              setValue("status", value as Status, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("status")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("status") && (
            <p className="text-sm text-red-500">{getError("status")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

