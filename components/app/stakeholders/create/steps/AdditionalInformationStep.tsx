"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
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
import type { StakeholderFormData } from "@/lib/schemas/stakeholder.schema";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "in_active", label: "In Active" },
  { value: "on_leave", label: "On Leave" },
  { value: "off_boarded", label: "Off Boarded" },
];

export const AdditionalInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StakeholderFormData>();

  const status = watch("status");
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Helper to format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    const datePart = dateString.split("T")[0];
    return datePart || "";
  };

  const hasError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 5: Additional Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={status || ""}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger
              className={`w-full ${hasError("status") ? "border-red-500" : ""}`}
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

        {/* External Reference */}
        <div className="space-y-2">
          <Label htmlFor="external_ref">External Reference</Label>
          <Input
            id="external_ref"
            {...register("external_ref")}
            placeholder="Enter external reference (optional)"
            className={hasError("external_ref") ? "border-red-500" : ""}
          />
          {hasError("external_ref") && (
            <p className="text-sm text-red-500">{getError("external_ref")}</p>
          )}
        </div>

        {/* Employee ID */}
        <div className="space-y-2">
          <Label htmlFor="employee_id">Employee ID</Label>
          <Input
            id="employee_id"
            {...register("employee_id")}
            placeholder="Enter employee ID (optional)"
            className={hasError("employee_id") ? "border-red-500" : ""}
          />
          {hasError("employee_id") && (
            <p className="text-sm text-red-500">{getError("employee_id")}</p>
          )}
        </div>

        {/* Cost Center */}
        <div className="space-y-2">
          <Label htmlFor="cost_center">Cost Center</Label>
          <Input
            id="cost_center"
            {...register("cost_center")}
            placeholder="Enter cost center (optional)"
            className={hasError("cost_center") ? "border-red-500" : ""}
          />
          {hasError("cost_center") && (
            <p className="text-sm text-red-500">{getError("cost_center")}</p>
          )}
        </div>

        {/* Manager */}
        <div className="space-y-2">
          <Label htmlFor="manager">Manager</Label>
          <Input
            id="manager"
            {...register("manager")}
            placeholder="Enter manager name (optional)"
            className={hasError("manager") ? "border-red-500" : ""}
          />
          {hasError("manager") && (
            <p className="text-sm text-red-500">{getError("manager")}</p>
          )}
        </div>

        {/* Delegate */}
        <div className="space-y-2">
          <Label htmlFor="delegate">Delegate</Label>
          <Input
            id="delegate"
            {...register("delegate")}
            placeholder="Enter delegate name (optional)"
            className={hasError("delegate") ? "border-red-500" : ""}
          />
          {hasError("delegate") && (
            <p className="text-sm text-red-500">{getError("delegate")}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formatDateForInput(startDate || "")}
            onChange={(e) =>
              setValue("start_date", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={hasError("start_date") ? "border-red-500" : ""}
          />
          {hasError("start_date") && (
            <p className="text-sm text-red-500">{getError("start_date")}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formatDateForInput(endDate || "")}
            onChange={(e) =>
              setValue("end_date", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={hasError("end_date") ? "border-red-500" : ""}
          />
          {hasError("end_date") && (
            <p className="text-sm text-red-500">{getError("end_date")}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Must be after or equal to start date
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Enter additional notes (optional)"
            className={`min-h-24 resize-none ${hasError("notes") ? "border-red-500" : ""}`}
          />
          {hasError("notes") && (
            <p className="text-sm text-red-500">{getError("notes")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

