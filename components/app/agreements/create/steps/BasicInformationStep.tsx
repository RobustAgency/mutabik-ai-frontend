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
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";
import StakeholderSelectorWithInline from "@/components/app/useCases/create/StakeholderSelectorWithInline";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import type { AgreementFormData } from "@/lib/schemas/agreement.schema";

const AGREEMENT_TYPE_OPTIONS = [
  { value: "msa", label: "MSA" },
  { value: "dpa", label: "DPA" },
  { value: "order_form", label: "Order Form" },
  { value: "addendum", label: "Addendum" },
  { value: "sla", label: "SLA" },
  { value: "nda", label: "NDA" },
  { value: "sow", label: "SOW" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "under_review", label: "Under Review" },
  { value: "pending_signature", label: "Pending Signature" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "terminated", label: "Terminated" },
  { value: "suspended", label: "Suspended" },
];


export const BasicInformationStep: React.FC = () => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<AgreementFormData>();

  const { data: vendorsData, isLoading: isVendorsLoading } = useGetVendorsQuery({ per_page: 100 });
  const vendors = vendorsData?.data || [];

  const vendorId = watch("vendor_id");
  const agreementType = watch("agreement_type");
  const status = watch("status");
  const agreementOwnerId = watch("agreement_owner_id");
  const docRef = watch("doc_ref");
  const effectiveFrom = watch("effective_from");
  const effectiveTo = watch("effective_to");

  const vendorOptions = vendors.map((vendor) => ({
    id: vendor.id,
    label: vendor.vendor_name,
    value: String(vendor.id),
  }));

  const hasError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AgreementFormData) =>
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
        {/* Vendor */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="vendor_id">
            Vendor <span className="text-red-500">*</span>
          </Label>
          <SelectWithInlineCreate
            key={`vendor_id-${vendorId || "none"}`}
            value={vendorId ? String(vendorId) : ""}
            onValueChange={(value) => {
              const numValue = value ? Number(value) : undefined;
              if (numValue) {
                setValue("vendor_id", numValue, { shouldValidate: true });
              }
            }}
            placeholder={isVendorsLoading ? "Loading vendors..." : "Select vendor"}
            options={vendorOptions}
            isLoading={isVendorsLoading}
            isEmpty={!isVendorsLoading && vendorOptions.length === 0}
            entityName="Vendor"
            modalForm={VendorModalForm}
            canCreate={true}
            error={!!hasError("vendor_id")}
          />
          {hasError("vendor_id") && (
            <p className="text-sm text-red-500">{getError("vendor_id")}</p>
          )}
        </div>

        {/* Agreement Type */}
        <div className="space-y-2">
          <Label htmlFor="agreement_type">
            Agreement Type <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`agreement_type-select-${agreementType || "none"}`}
            value={agreementType || ""}
            onValueChange={(value) => setValue("agreement_type", value as any, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("agreement_type") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select agreement type" />
            </SelectTrigger>
            <SelectContent>
              {AGREEMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("agreement_type") && (
            <p className="text-sm text-red-500">{getError("agreement_type")}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`status-select-${status || "none"}`}
            value={status || ""}
            onValueChange={(value) => setValue("status", value as any, { shouldValidate: true })}
          >
            <SelectTrigger
              className={`w-full ${hasError("status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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

        {/* Agreement Owner */}
        <div className="space-y-2 md:col-span-2">
          <StakeholderSelectorWithInline
            label="Agreement Owner"
            value={agreementOwnerId ? String(agreementOwnerId) : null}
            onValueChange={(value) => {
              if (value) {
                setValue("agreement_owner_id", Number(value), { shouldValidate: true });
              }
            }}
            placeholder="Select agreement owner"
            required={true}
            error={hasError("agreement_owner_id") ? getError("agreement_owner_id") : undefined}
            filterType="person"
          />
        </div>

        {/* Document Reference */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="doc_ref">
            Document Reference <span className="text-red-500">*</span>
          </Label>
          <Input
            id="doc_ref"
            {...register("doc_ref")}
            className={hasError("doc_ref") ? "border-red-500" : ""}
            placeholder="https://example.com/agreement.pdf"
          />
          {hasError("doc_ref") && (
            <p className="text-sm text-red-500">{getError("doc_ref")}</p>
          )}
        </div>

        {/* Effective From */}
        <div className="space-y-2">
          <Label htmlFor="effective_from">
            Effective From <span className="text-red-500">*</span>
          </Label>
          <Input
            id="effective_from"
            type="date"
            {...register("effective_from")}
            className={hasError("effective_from") ? "border-red-500" : ""}
          />
          {hasError("effective_from") && (
            <p className="text-sm text-red-500">{getError("effective_from")}</p>
          )}
        </div>

        {/* Effective To */}
        <div className="space-y-2">
          <Label htmlFor="effective_to">
            Effective To <span className="text-red-500">*</span>
          </Label>
          <Input
            id="effective_to"
            type="date"
            {...register("effective_to")}
            className={hasError("effective_to") ? "border-red-500" : ""}
          />
          {hasError("effective_to") && (
            <p className="text-sm text-red-500">{getError("effective_to")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

