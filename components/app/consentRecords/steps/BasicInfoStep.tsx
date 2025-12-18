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
import type { ConsentRecordFormData } from "@/lib/schemas/consentRecord.schema";
import SingleRopaSelector from "../SingleRopaSelector";

const subjectRealmOptions = [
  { value: "customer", label: "Customer" },
  { value: "employee", label: "Employee" },
  { value: "vendor", label: "Vendor" },
  { value: "student", label: "Student" },
  { value: "patient", label: "Patient" },
  { value: "visitor", label: "Visitor" },
];

const purposeOptions = [
  { value: "marketing", label: "Marketing" },
  { value: "ai_training", label: "AI Training" },
  { value: "profiling", label: "Profiling" },
  { value: "personalization", label: "Personalization" },
  { value: "biometrics", label: "Biometrics" },
  { value: "cctv", label: "CCTV" },
  { value: "analytics", label: "Analytics" },
  { value: "research", label: "Research" },
];

export const BasicInfoStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConsentRecordFormData>();

  const processingActivityId = watch("record_of_processing_activity_id");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject_key">
            Subject Key <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subject_key"
            {...register("subject_key")}
            className={`w-full ${errors.subject_key ? "border-red-500" : ""}`}
            placeholder="e.g., user_12345 or email"
          />
          {errors.subject_key && (
            <p className="text-sm text-red-500">
              {errors.subject_key.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_realm">
            Subject Realm <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("subject_realm")}
            onValueChange={(value) => setValue("subject_realm", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subject realm" />
            </SelectTrigger>
            <SelectContent>
              {subjectRealmOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_age_group">Subject Age Group</Label>
          <Input
            id="subject_age_group"
            {...register("subject_age_group")}
            className="w-full"
            placeholder="e.g., adult, minor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">
            Purpose <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("purpose")}
            onValueChange={(value) => setValue("purpose", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              {purposeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Linked Processing Activity (ROPA) <span className="text-red-500">*</span>
        </Label>
        <SingleRopaSelector
          value={
            processingActivityId && processingActivityId > 0
              ? processingActivityId
              : null
          }
          onChange={(id) =>
            setValue("record_of_processing_activity_id", id || 0)
          }
          error={
            errors.record_of_processing_activity_id
              ? "Processing activity is required"
              : undefined
          }
        />
      </div>
    </div>
  );
};


