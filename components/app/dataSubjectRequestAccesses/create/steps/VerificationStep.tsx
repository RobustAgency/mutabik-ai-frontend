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

const verificationStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "failed", label: "Failed" },
];

const verificationMethodOptions = [
  { value: "email_link", label: "Email Link" },
  { value: "sms_code", label: "SMS Code" },
  { value: "id_document", label: "ID Document" },
  { value: "in_person", label: "In Person" },
  { value: "callback", label: "Callback" },
];

export const VerificationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DataSubjectRequestAccessFormData>();

  const verificationStatus = watch("verification_status");

  const showVerifiedFields = verificationStatus === "verified";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="verification_status">
            Verification Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={verificationStatus}
            onValueChange={(value) =>
              setValue("verification_status", value as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select verification status" />
            </SelectTrigger>
            <SelectContent>
              {verificationStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showVerifiedFields && (
          <>
            <div className="space-y-2">
              <Label htmlFor="subject_key">
                Subject Key <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject_key"
                {...register("subject_key")}
                className={`w-full ${
                  errors.subject_key ? "border-red-500" : ""
                }`}
                placeholder="Internal subject key"
              />
              {errors.subject_key && (
                <p className="text-sm text-red-500">
                  {errors.subject_key.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification_method">
                Verification Method <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("verification_method") || ""}
                onValueChange={(value) =>
                  setValue("verification_method", (value || null) as any)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select verification method" />
                </SelectTrigger>
                <SelectContent>
                  {verificationMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.verification_method && (
                <p className="text-sm text-red-500">
                  {errors.verification_method.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="verified_by">
                Verified By (User ID) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="verified_by"
                {...register("verified_by")}
                className={`w-full ${
                  errors.verified_by ? "border-red-500" : ""
                }`}
                placeholder="User ID"
              />
              {errors.verified_by && (
                <p className="text-sm text-red-500">
                  {errors.verified_by.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


