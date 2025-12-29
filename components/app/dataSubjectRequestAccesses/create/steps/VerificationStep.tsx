"use client";

import React, { useMemo } from "react";
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
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";

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

  const { data: users = [], isLoading: isLoadingUsers } =
    useGetOrganizationUsersQuery({
      per_page: 100,
    });

  const verificationStatus = watch("verification_status");
  const verifiedBy = watch("verified_by");

  const showVerifiedFields = verificationStatus === "verified";

  const userOptions = useMemo(() => {
    const base =
      users?.map((user: any) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    // Ensure currently selected user is present in options
    if (verifiedBy) {
      const verifiedByStr = String(verifiedBy);
      const exists = base.some((opt) => opt.value === verifiedByStr);
      if (!exists) {
        base.unshift({
          value: verifiedByStr,
          label: `User #${verifiedBy}`,
        });
      }
    }

    return base;
  }, [users, verifiedBy]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="verification_status">
            Verification Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`verification_status-${watch("verification_status") || "none"}`}
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
                key={`verification_method-${watch("verification_method") || "none"}`}
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
                Verified By <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`verified-by-${verifiedBy || "none"}-${userOptions.length}`}
                value={verifiedBy || ""}
                onValueChange={(value) => setValue("verified_by", value)}
                disabled={isLoadingUsers}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.verified_by ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select user" />
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


