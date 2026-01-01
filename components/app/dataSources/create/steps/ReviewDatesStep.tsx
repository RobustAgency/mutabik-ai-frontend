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
import type { DataSourceFormData } from "@/lib/schemas/dataSource.schema";
import { DataSourceStatus } from "@/app/lib/features/dataSourcesApi";

const STATUS_OPTIONS = [
  { value: DataSourceStatus.DRAFT, label: "Draft" },
  { value: DataSourceStatus.ACTIVE, label: "Active" },
  { value: DataSourceStatus.UNDER_REVIEW, label: "Under Review" },
  { value: DataSourceStatus.DEPRECATED, label: "Deprecated" },
  { value: DataSourceStatus.ARCHIVED, label: "Archived" },
];

export const ReviewDatesStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataSourceFormData>();

  const lastReviewDate = watch("last_review_date");
  const nextReviewDate = watch("next_review_date");
  const status = watch("status");

  const hasError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName]?.message as string;

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
          Review Schedule
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-6">
        {/* Last Review Date */}
        <div className="space-y-2">
          <Label htmlFor="last_review_date">Last Review Date</Label>
          <Input
            id="last_review_date"
            type="date"
            value={formatDateForInput(lastReviewDate)}
            onChange={(e) => {
              const value = e.target.value || null;
              setValue("last_review_date", value, { shouldValidate: true });
            }}
            className={hasError("last_review_date") ? "border-red-500" : ""}
          />
          {hasError("last_review_date") && (
            <p className="text-sm text-red-500">{getError("last_review_date")}</p>
          )}
        </div>

        {/* Next Review Due */}
        <div className="space-y-2">
          <Label htmlFor="next_review_date">Next Review Due</Label>
          <Input
            id="next_review_date"
            type="date"
            value={formatDateForInput(nextReviewDate)}
            onChange={(e) => {
              const value = e.target.value || null;
              setValue("next_review_date", value, { shouldValidate: true });
            }}
            className={hasError("next_review_date") ? "border-red-500" : ""}
          />
          {hasError("next_review_date") && (
            <p className="text-sm text-red-500">{getError("next_review_date")}</p>
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
            onValueChange={(value) => setValue("status", value as DataSourceStatus, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select..." />
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
