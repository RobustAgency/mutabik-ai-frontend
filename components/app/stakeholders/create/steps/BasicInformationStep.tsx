"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StakeholderFormData } from "@/lib/schemas/stakeholder.schema";

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StakeholderFormData>();

  const type = watch("type");

  const stakeholderTypeOptions = [
    { value: "person", label: "Person" },
    { value: "team", label: "Team" },
    { value: "vendor_org", label: "Vendor Organization" },
    { value: "regulator", label: "Regulator" },
    { value: "customer_group", label: "Customer Group" },
    { value: "committee_secretariat", label: "Committee Secretariat" },
  ];

  const hasError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof StakeholderFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 1: Basic Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">
            Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`type-${type || "none"}`}
            value={type || ""}
            onValueChange={(value) => setValue("type", value as any)}
          >
            <SelectTrigger
              className={`w-full ${hasError("type") ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {stakeholderTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("type") && (
            <p className="text-sm text-red-500">{getError("type")}</p>
          )}
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="display_name">
            Display Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="display_name"
            {...register("display_name")}
            placeholder="Enter display name"
            className={hasError("display_name") ? "border-red-500" : ""}
          />
          {hasError("display_name") && (
            <p className="text-sm text-red-500">{getError("display_name")}</p>
          )}
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="Enter first name"
            className={hasError("first_name") ? "border-red-500" : ""}
          />
          {hasError("first_name") && (
            <p className="text-sm text-red-500">{getError("first_name")}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="last_name">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="last_name"
            {...register("last_name")}
            placeholder="Enter last name"
            className={hasError("last_name") ? "border-red-500" : ""}
          />
          {hasError("last_name") && (
            <p className="text-sm text-red-500">{getError("last_name")}</p>
          )}
        </div>

        {/* Organization Unit */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="org_unit">
            Organization Unit <span className="text-red-500">*</span>
          </Label>
          <Input
            id="org_unit"
            {...register("org_unit")}
            placeholder="Enter organization unit"
            className={hasError("org_unit") ? "border-red-500" : ""}
          />
          {hasError("org_unit") && (
            <p className="text-sm text-red-500">{getError("org_unit")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

