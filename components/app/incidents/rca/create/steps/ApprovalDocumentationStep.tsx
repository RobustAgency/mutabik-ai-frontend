"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IncidentRootCauseAnalysisFormData } from "@/lib/schemas/incidentRootCauseAnalysis.schema";

export const ApprovalDocumentationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentRootCauseAnalysisFormData>();

  const leadAnalyst = watch("lead_analyst");
  const reviewCommittee = watch("review_committee");
  const approvedAt = watch("approved_at");
  const reportLink = watch("report_link");

  const hasError = (
    fieldName: keyof IncidentRootCauseAnalysisFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentRootCauseAnalysisFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  // Format datetime for input field
  const formatDateTimeForInput = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Approval & Documentation <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Analyst */}
        <div className="space-y-2">
          <Label htmlFor="lead_analyst">
            Lead Analyst <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lead_analyst"
            value={leadAnalyst || ""}
            onChange={(e) =>
              setValue("lead_analyst", e.target.value, { shouldValidate: true })
            }
            placeholder="Name of the lead analyst"
            className={hasError("lead_analyst") ? "border-red-500" : ""}
          />
          {hasError("lead_analyst") && (
            <p className="text-sm text-red-500">{getError("lead_analyst")}</p>
          )}
        </div>

        {/* Review Committee */}
        <div className="space-y-2">
          <Label htmlFor="review_committee">Review Committee</Label>
          <Input
            id="review_committee"
            value={reviewCommittee || ""}
            onChange={(e) =>
              setValue("review_committee", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Review committee name or members"
            className={hasError("review_committee") ? "border-red-500" : ""}
          />
          {hasError("review_committee") && (
            <p className="text-sm text-red-500">
              {getError("review_committee")}
            </p>
          )}
        </div>

        {/* Approved At */}
        <div className="space-y-2">
          <Label htmlFor="approved_at">Approved At</Label>
          <Input
            id="approved_at"
            type="datetime-local"
            value={formatDateTimeForInput(approvedAt)}
            onChange={(e) =>
              setValue("approved_at", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={hasError("approved_at") ? "border-red-500" : ""}
          />
          {hasError("approved_at") && (
            <p className="text-sm text-red-500">{getError("approved_at")}</p>
          )}
        </div>

        {/* Report Link */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="report_link">Report Link</Label>
          <Input
            id="report_link"
            type="url"
            value={reportLink || ""}
            onChange={(e) =>
              setValue("report_link", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="https://example.com/report"
            className={hasError("report_link") ? "border-red-500" : ""}
          />
          {hasError("report_link") && (
            <p className="text-sm text-red-500">{getError("report_link")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

