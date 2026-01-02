"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";
import { ApprovedBy, Status } from "@/app/lib/features/datasetSnapshotsApi";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const APPROVED_BY_OPTIONS = [
  { value: ApprovedBy.DATA_ENGINEERING_TEAM, label: "Data Engineering Team" },
  { value: ApprovedBy.ML_PLATFORM_TEAM, label: "ML Platform Team" },
  { value: ApprovedBy.PRIVACY_OFFICE, label: "Privacy Office" },
  { value: ApprovedBy.AI_GOVERNANCE_BOARD, label: "AI Governance Board" },
];

export const GovernanceStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetSnapshotFormData>();

  const createdBySystem = watch("created_by_system");
  const expirationDate = watch("expiration_date");
  const approvedBy = watch("approved_by");
  const status = watch("status");

  const hasError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName]?.message as string;

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert date input value to ISO string
  const handleDateChange = (field: "expiration_date", value: string) => {
    if (value) {
      const date = new Date(value);
      setValue(field, date.toISOString().split('T')[0], { shouldValidate: true });
    } else {
      setValue(field, null, { shouldValidate: true });
    }
  };

  // Note: created_by_system is boolean in backend, but UI shows text input
  // We'll use a text input and store it as a local state, then convert to boolean on submit
  // For now, we'll just store true/false based on whether text is entered
  const [createdByText, setCreatedByText] = React.useState(createdBySystem ? "System" : "");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Governance <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Created By (System/Pipeline) */}
          <div className="space-y-2">
            <Label htmlFor="created_by_system">
              Created By (System/Pipeline) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="created_by_system"
              value={createdByText}
              onChange={(e) => {
                setCreatedByText(e.target.value);
                // Store as boolean: true if text is provided
                setValue("created_by_system", e.target.value.length > 0 ? true : null, {
                  shouldValidate: true,
                });
              }}
              placeholder="e.g., ML Pipeline, ETL Job"
              className={`w-full ${hasError("created_by_system") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("created_by_system") && (
              <p className="text-sm text-red-500">{getError("created_by_system")}</p>
            )}
          </div>

          {/* Approved By */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="approved_by">Approved By</Label>
            </div>
            <Select
              key={`approved_by-${approvedBy || "none"}`}
              value={approvedBy || "null"}
              onValueChange={(value) =>
                setValue("approved_by", value === "null" ? null : (value as ApprovedBy), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {APPROVED_BY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expiration_date">Expiration Date</Label>
            <Input
              id="expiration_date"
              type="date"
              value={formatDateForInput(expirationDate)}
              onChange={(e) => handleDateChange("expiration_date", e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-[#667085]">When this snapshot should be reviewed/archived</p>
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
                setValue("status", value as Status, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                <SelectItem value={Status.DEPRECATED}>Deprecated</SelectItem>
                <SelectItem value={Status.ARCHIVED}>Archived</SelectItem>
              </SelectContent>
            </Select>
            {hasError("status") && (
              <p className="text-sm text-red-500">{getError("status")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

