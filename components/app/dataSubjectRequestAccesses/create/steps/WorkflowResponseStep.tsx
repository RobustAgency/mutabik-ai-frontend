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
import type { DataSubjectRequestAccessFormData } from "@/lib/schemas/dataSubjectRequestAccess.schema";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "pending_verification", label: "Pending Verification" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "ready_for_response", label: "Ready for Response" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const responseMethodOptions = [
  { value: "email", label: "Email" },
  { value: "secure_portal", label: "Secure Portal" },
  { value: "encrypted_file", label: "Encrypted File" },
  { value: "physical_mail", label: "Physical Mail" },
  { value: "in_person", label: "In Person" },
];

const responseFormatOptions = [
  { value: "pdf", label: "PDF" },
  { value: "json", label: "JSON" },
  { value: "csv", label: "CSV" },
  { value: "excel", label: "Excel" },
  { value: "portal_access", label: "Portal Access" },
  { value: "physical_copy", label: "Physical Copy" },
];

export const WorkflowResponseStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DataSubjectRequestAccessFormData>();

  const { data: usersResponse, isLoading: isLoadingUsers } =
    useGetOrganizationUsersQuery({
      per_page: 100,
    });
  const users = usersResponse?.data ?? [];

  const status = watch("status");
  const isOverdue = watch("is_overdue");
  const assignedTo = watch("assigned_to");

  const showResponseFields = status === "ready_for_response";
  const showCompletionFields = status === "completed";
  const showRejectionFields = status === "rejected";

  const userOptions = useMemo(() => {
    const base =
      users?.map((user: any) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    // Ensure currently selected assignee is present in options
    if (assignedTo) {
      const exists = base.some((opt) => opt.value === assignedTo);
      if (!exists) {
        base.unshift({
          value: assignedTo,
          label: `User #${assignedTo}`,
        });
      }
    }

    return base;
  }, [users, assignedTo]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={status}
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
          <Label htmlFor="priority">
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("priority")}
            onValueChange={(value) => setValue("priority", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assigned_to">
            Assigned To (User ID) <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`assigned-to-${assignedTo || "none"}-${
              userOptions.length
            }`}
            value={assignedTo || ""}
            onValueChange={(value) => setValue("assigned_to", value)}
            disabled={isLoadingUsers}
          >
            <SelectTrigger
              className={`w-full ${
                errors.assigned_to ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select assignee" />
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
          {errors.assigned_to && (
            <p className="text-sm text-red-500">
              {errors.assigned_to.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assigned_date">
            Assigned Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="assigned_date"
            type="date"
            {...register("assigned_date")}
            className={`w-full ${
              errors.assigned_date ? "border-red-500" : ""
            }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_overdue">
            Overdue <span className="text-red-500">*</span>
          </Label>
          <select
            key={`is_overdue-${watch("is_overdue") || "none"}`}
            id="is_overdue"
            value={isOverdue ? "yes" : "no"}
            onChange={(e) =>
              setValue("is_overdue", e.target.value === "yes")
            }
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="records_found">Records Found</Label>
          <Input
            id="records_found"
            type="number"
            {...register("records_found", { valueAsNumber: true })}
            className="w-full"
          />
        </div>
      </div>

      {showResponseFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="response_method">
              Response Method <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`response_method-${watch("response_method") || "none"}`}
              value={watch("response_method") || ""}
              onValueChange={(value) =>
                setValue("response_method", (value || null) as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select response method" />
              </SelectTrigger>
              <SelectContent>
                {responseMethodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response_format">
              Response Format <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`response_format-${watch("response_format") || "none"}`}
              value={watch("response_format") || ""}
              onValueChange={(value) =>
                setValue("response_format", (value || null) as any)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select response format" />
              </SelectTrigger>
              <SelectContent>
                {responseFormatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response_uri">
              Response URI <span className="text-red-500">*</span>
            </Label>
            <Input
              id="response_uri"
              {...register("response_uri")}
              className={`w-full ${
                errors.response_uri ? "border-red-500" : ""
              }`}
              placeholder="https://..."
            />
            {errors.response_uri && (
              <p className="text-sm text-red-500">
                {errors.response_uri.message}
              </p>
            )}
          </div>
        </div>
      )}

      {showCompletionFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="response_date">
              Response Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="response_date"
              type="date"
              {...register("response_date")}
              className={`w-full ${
                errors.response_date ? "border-red-500" : ""
              }`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completed_date">
              Completed Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="completed_date"
              type="date"
              {...register("completed_date")}
              className={`w-full ${
                errors.completed_date ? "border-red-500" : ""
              }`}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="response_notes">Response Notes</Label>
        <Textarea
          id="response_notes"
          {...register("response_notes")}
          className="w-full min-h-[100px] resize-none"
          placeholder="Additional notes about the response"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jurisdiction">
            Jurisdiction <span className="text-red-500">*</span>
          </Label>
          <Input
            id="jurisdiction"
            {...register("jurisdiction")}
            className={`w-full ${
              errors.jurisdiction ? "border-red-500" : ""
            }`}
            placeholder="e.g., EU, UK"
          />
          {errors.jurisdiction && (
            <p className="text-sm text-red-500">
              {errors.jurisdiction.message}
            </p>
          )}
        </div>

        {showRejectionFields && (
          <div className="space-y-2">
            <Label htmlFor="rejection_reason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejection_reason"
              {...register("rejection_reason")}
              className={`w-full min-h-[100px] resize-none ${
                errors.rejection_reason ? "border-red-500" : ""
              }`}
              placeholder="Reason for rejection"
              rows={4}
            />
            {errors.rejection_reason && (
              <p className="text-sm text-red-500">
                {errors.rejection_reason.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


