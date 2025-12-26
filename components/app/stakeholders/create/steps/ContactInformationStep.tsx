"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StakeholderFormData } from "@/lib/schemas/stakeholder.schema";

export const ContactInformationStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<StakeholderFormData>();

  const hasError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 2: Contact Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={hasError("email") ? "border-red-500" : ""}
          />
          {hasError("email") && (
            <p className="text-sm text-red-500">{getError("email")}</p>
          )}
        </div>

        {/* Secondary Email */}
        <div className="space-y-2">
          <Label htmlFor="secondary_email">Secondary Email</Label>
          <Input
            id="secondary_email"
            type="email"
            {...register("secondary_email")}
            placeholder="Enter secondary email (optional)"
            className={hasError("secondary_email") ? "border-red-500" : ""}
          />
          {hasError("secondary_email") && (
            <p className="text-sm text-red-500">
              {getError("secondary_email")}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Enter phone number"
            className={hasError("phone") ? "border-red-500" : ""}
          />
          {hasError("phone") && (
            <p className="text-sm text-red-500">{getError("phone")}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            {...register("mobile")}
            placeholder="Enter mobile number (optional)"
            className={hasError("mobile") ? "border-red-500" : ""}
          />
          {hasError("mobile") && (
            <p className="text-sm text-red-500">{getError("mobile")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

