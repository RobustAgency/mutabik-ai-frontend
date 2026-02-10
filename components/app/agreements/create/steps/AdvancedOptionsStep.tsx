"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AgreementFormData } from "@/lib/schemas/agreement.schema";

const DISPUTE_RESOLUTION_OPTIONS = [
  { value: "mediation_then_arbitration", label: "Mediation then Arbitration" },
  { value: "arbitration", label: "Arbitration" },
  { value: "courts", label: "Courts" },
];

const CONFIDENTIALITY_TERM_OPTIONS = [
  { value: "strict", label: "Strict" },
  { value: "moderate", label: "Moderate" },
  { value: "lenient", label: "Lenient" },
];

const PARENT_AGREEMENT_OPTIONS = [
  { value: "msa_openai_2024", label: "MSA OpenAI 2024" },
  { value: "msa_aws_2023", label: "MSA AWS 2023" },
  { value: "none", label: "None" },
];

const REPLACES_AGREEMENT_OPTIONS = [
  { value: "dpa_openai_2023", label: "DPA OpenAI 2023" },
  { value: "none", label: "None" },
];

export const AdvancedOptionsStep: React.FC = () => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<AgreementFormData>();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const internalReferenceNumber = watch("internal_reference_number");
  const vendorContractId = watch("vendor_contract_id");
  const disputeResolution = watch("dispute_resolution");
  const confidentialityTerm = watch("confidentiality_term");
  const parentAgreement = watch("parent_agreement");
  const replacesAgreement = watch("replaces_agreement");
  const notes = watch("notes");

  const hasError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 6: Additional Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-[#039855] hover:text-[#047857] font-medium flex items-center gap-1"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showAdvanced ? "Hide" : "Show"} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Label className="text-base font-semibold">Advanced Options</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Internal Reference Number */}
            <div className="space-y-2">
              <Label htmlFor="internal_reference_number">Internal Reference Number</Label>
              <Input
                id="internal_reference_number"
                {...register("internal_reference_number")}
                className={hasError("internal_reference_number") ? "border-red-500" : ""}
                placeholder="e.g., REF-2024-001"
                maxLength={255}
              />
              {hasError("internal_reference_number") && (
                <p className="text-sm text-red-500">{getError("internal_reference_number")}</p>
              )}
            </div>

            {/* Vendor Contract ID */}
            <div className="space-y-2">
              <Label htmlFor="vendor_contract_id">Vendor Contract ID</Label>
              <Input
                id="vendor_contract_id"
                {...register("vendor_contract_id")}
                className={hasError("vendor_contract_id") ? "border-red-500" : ""}
                placeholder="e.g., VND-CONT-2024-001"
                maxLength={255}
              />
              {hasError("vendor_contract_id") && (
                <p className="text-sm text-red-500">{getError("vendor_contract_id")}</p>
              )}
            </div>

            {/* Dispute Resolution */}
            <div className="space-y-2">
              <Label htmlFor="dispute_resolution">Dispute Resolution</Label>
              <Select
                key={`dispute_resolution-select-${disputeResolution || "none"}`}
                value={disputeResolution || ""}
                onValueChange={(value) =>
                  setValue("dispute_resolution", value ? (value as any) : null, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select dispute resolution" />
                </SelectTrigger>
                <SelectContent>
                  {DISPUTE_RESOLUTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError("dispute_resolution") && (
                <p className="text-sm text-red-500">{getError("dispute_resolution")}</p>
              )}
            </div>

            {/* Confidentiality Term */}
            <div className="space-y-2">
              <Label htmlFor="confidentiality_term">Confidentiality Term</Label>
              <Select
                key={`confidentiality_term-select-${confidentialityTerm || "none"}`}
                value={confidentialityTerm || ""}
                onValueChange={(value) =>
                  setValue("confidentiality_term", value ? (value as any) : null, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select confidentiality term" />
                </SelectTrigger>
                <SelectContent>
                  {CONFIDENTIALITY_TERM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError("confidentiality_term") && (
                <p className="text-sm text-red-500">{getError("confidentiality_term")}</p>
              )}
            </div>

            {/* Parent Agreement */}
            <div className="space-y-2">
              <Label htmlFor="parent_agreement">Parent Agreement</Label>
              <Select
                key={`parent_agreement-select-${parentAgreement || "none"}`}
                value={parentAgreement || ""}
                onValueChange={(value) =>
                  setValue("parent_agreement", value ? (value as any) : null, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select parent agreement" />
                </SelectTrigger>
                <SelectContent>
                  {PARENT_AGREEMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError("parent_agreement") && (
                <p className="text-sm text-red-500">{getError("parent_agreement")}</p>
              )}
            </div>

            {/* Replaces Agreement */}
            <div className="space-y-2">
              <Label htmlFor="replaces_agreement">Replaces Agreement</Label>
              <Select
                key={`replaces_agreement-select-${replacesAgreement || "none"}`}
                value={replacesAgreement || ""}
                onValueChange={(value) =>
                  setValue("replaces_agreement", value ? (value as any) : null, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select replaces agreement" />
                </SelectTrigger>
                <SelectContent>
                  {REPLACES_AGREEMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError("replaces_agreement") && (
                <p className="text-sm text-red-500">{getError("replaces_agreement")}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          className={hasError("notes") ? "border-red-500" : ""}
          placeholder="Enter any additional notes about this agreement..."
          rows={6}
        />
        {hasError("notes") && (
          <p className="text-sm text-red-500">{getError("notes")}</p>
        )}
      </div>
    </div>
  );
};

