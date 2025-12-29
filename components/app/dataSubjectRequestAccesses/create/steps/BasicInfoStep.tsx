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
import type { DataSubjectRequestAccessFormData } from "@/lib/schemas/dataSubjectRequestAccess.schema";

const requestTypeOptions = [
  { value: "access", label: "Access" },
  { value: "rectification", label: "Rectification" },
  { value: "erasure", label: "Erasure" },
  { value: "restriction", label: "Restriction" },
  { value: "portability", label: "Portability" },
  { value: "objection", label: "Objection" },
  { value: "opt_out_marketing", label: "Opt-out Marketing" },
  { value: "ai_explainability", label: "AI Explainability" },
  { value: "automated_decision_challenge", label: "Automated Decision Challenge" },
];

const subjectRealmOptions = [
  { value: "customer", label: "Customer" },
  { value: "employee", label: "Employee" },
  { value: "vendor", label: "Vendor" },
  { value: "student", label: "Student" },
  { value: "patient", label: "Patient" },
];

export const BasicInfoStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DataSubjectRequestAccessFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="request_type">
            Request Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`request_type-${watch("request_type") || "none"}`}
            value={watch("request_type")}
            onValueChange={(value) => setValue("request_type", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              {requestTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_identifier">
            Subject Identifier <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subject_identifier"
            {...register("subject_identifier")}
            className={`w-full ${
              errors.subject_identifier ? "border-red-500" : ""
            }`}
            placeholder="e.g., user@example.com"
          />
          {errors.subject_identifier && (
            <p className="text-sm text-red-500">
              {errors.subject_identifier.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_name">Subject Name</Label>
          <Input
            id="subject_name"
            {...register("subject_name")}
            className="w-full"
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_realm">
            Subject Realm <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`subject_realm-${watch("subject_realm") || "none"}`}
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
      </div>
    </div>
  );
};


