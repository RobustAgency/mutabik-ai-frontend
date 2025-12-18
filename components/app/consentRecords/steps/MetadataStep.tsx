"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";
import type { ConsentRecordFormData } from "@/lib/schemas/consentRecord.schema";

const sourceSystemOptions = [
  { value: "portal", label: "Portal" },
  { value: "mobile_app", label: "Mobile App" },
  { value: "crm", label: "CRM" },
  { value: "call_center", label: "Call Center" },
  { value: "admin", label: "Admin" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
];

const jurisdictionOptions = [
  { value: "eu", label: "EU" },
  { value: "uae", label: "UAE" },
  { value: "uk", label: "UK" },
  { value: "ksa", label: "KSA" },
  { value: "difc", label: "DIFC" },
  { value: "us_ca", label: "US/CA" },
];

const dataCategoryOptions = [
  { value: "name", label: "Name" },
  { value: "contact", label: "Contact" },
  { value: "identifier", label: "Identifier" },
  { value: "financial", label: "Financial" },
  { value: "health", label: "Health" },
  { value: "biometric", label: "Biometric" },
  { value: "behavioral", label: "Behavioral" },
  { value: "sensitive", label: "Sensitive" },
  { value: "children", label: "Children" },
  { value: "location", label: "Location" },
];

export const MetadataStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConsentRecordFormData>();

  const dataCategories = watch("data_categories") || [];
  const canWithdraw = watch("can_withdraw");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source_system">
            Source System <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("source_system")}
            onValueChange={(value) => setValue("source_system", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source system" />
            </SelectTrigger>
            <SelectContent>
              {sourceSystemOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">
            Language <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("language")}
            onValueChange={(value) => setValue("language", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jurisdiction">
            Jurisdiction <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("jurisdiction")}
            onValueChange={(value) => setValue("jurisdiction", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              {jurisdictionOptions.map((option) => (
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
          Data Categories <span className="text-red-500">*</span>
        </Label>
        <CustomMultiSelect
          options={dataCategoryOptions}
          value={dataCategories}
          onChange={(value) => setValue("data_categories", value as any)}
          placeholder="Select data categories"
          className={`w-full ${errors.data_categories ? "border-red-500" : ""}`}
        />
        {errors.data_categories && (
          <p className="text-sm text-red-500">
            {errors.data_categories.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="evidence_uri">Evidence URL</Label>
          <Input
            id="evidence_uri"
            {...register("evidence_uri")}
            className={`w-full ${
              errors.evidence_uri ? "border-red-500" : ""
            }`}
            placeholder="https://..."
          />
          {errors.evidence_uri && (
            <p className="text-sm text-red-500">
              {errors.evidence_uri.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ip_address">IP Address</Label>
          <Input
            id="ip_address"
            {...register("ip_address")}
            className="w-full"
            placeholder="Captured from request"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_refreshed_date">Last Refreshed Date</Label>
          <Input
            id="last_refreshed_date"
            type="date"
            {...register("last_refreshed_date")}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_agent">User Agent</Label>
        <Textarea
          id="user_agent"
          {...register("user_agent")}
          className="w-full min-h-[80px] resize-none"
          placeholder="Browser user-agent string"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="can_withdraw"
            checked={canWithdraw}
            onCheckedChange={(checked) =>
              setValue("can_withdraw", checked === true)
            }
          />
          <Label htmlFor="can_withdraw">User can withdraw consent</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="withdrawal_method">
            Withdrawal Method <span className="text-red-500">*</span>
          </Label>
          <Input
            id="withdrawal_method"
            {...register("withdrawal_method")}
            className={`w-full ${
              errors.withdrawal_method ? "border-red-500" : ""
            }`}
            placeholder="e.g., web_form, email, support"
          />
          {errors.withdrawal_method && (
            <p className="text-sm text-red-500">
              {errors.withdrawal_method.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


