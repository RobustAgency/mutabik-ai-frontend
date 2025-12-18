"use client";

import React from "react";
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
import type { RecordOfProcessingActivityFormData } from "@/lib/schemas/recordOfProcessingActivity.schema";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "under_review", label: "Under Review" },
  { value: "archived", label: "Archived" },
];

const ownerTeamOptions = [
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "risk", label: "Risk" },
  { value: "ai/ml", label: "AI/ML" },
  { value: "it", label: "IT" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "legal", label: "Legal" },
  { value: "sales", label: "Sales" },
];

const controllerRoleOptions = [
  { value: "controller", label: "Controller" },
  { value: "processor", label: "Processor" },
  { value: "joint_controller", label: "Joint Controller" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RecordOfProcessingActivityFormData>();

  const purpose = watch("purpose");
  const detailedPurpose = watch("detailed_purpose");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="activity_code">
            Activity Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="activity_code"
            {...register("activity_code")}
            className={`w-full ${errors.activity_code ? "border-red-500" : ""}`}
            placeholder="e.g., ROPA-2024-001"
          />
          {errors.activity_code && (
            <p className="text-sm text-red-500">{errors.activity_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity_name">
            Activity Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="activity_name"
            {...register("activity_name")}
            className={`w-full ${errors.activity_name ? "border-red-500" : ""}`}
            placeholder="Enter activity name"
          />
          {errors.activity_name && (
            <p className="text-sm text-red-500">{errors.activity_name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">
          Purpose <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="purpose"
          {...register("purpose")}
          className={`w-full min-h-[100px] resize-none ${
            errors.purpose ? "border-red-500" : ""
          }`}
          placeholder="Describe the purpose of processing"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.purpose?.message}</span>
          <span>{purpose?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="detailed_purpose">Detailed Purpose</Label>
        <Textarea
          id="detailed_purpose"
          {...register("detailed_purpose")}
          className="w-full min-h-[120px] resize-none"
          placeholder="Provide detailed description (optional)"
          rows={5}
        />
        <div className="flex justify-end text-xs text-[#667085]">
          <span>{detailedPurpose?.length || 0} characters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner_team">
            Owner Team <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("owner_team")}
            onValueChange={(value) => setValue("owner_team", value as any)}
          >
            <SelectTrigger
              className={`w-full ${errors.owner_team ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select owner team" />
            </SelectTrigger>
            <SelectContent>
              {ownerTeamOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.owner_team && (
            <p className="text-sm text-red-500">{errors.owner_team.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="controller_role">
            Controller Role <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("controller_role")}
            onValueChange={(value) => setValue("controller_role", value as any)}
          >
            <SelectTrigger
              className={`w-full ${errors.controller_role ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select controller role" />
            </SelectTrigger>
            <SelectContent>
              {controllerRoleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.controller_role && (
            <p className="text-sm text-red-500">{errors.controller_role.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger
              className={`w-full ${errors.status ? "border-red-500" : ""}`}
            >
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
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

