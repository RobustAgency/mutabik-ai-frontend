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
import type { AgreementFormData } from "@/lib/schemas/agreement.schema";

const INDEMNIFICATION_OPTIONS = [
  { value: "vendor_indemnifies", label: "Vendor Indemnifies" },
  { value: "mutual", label: "Mutual" },
  { value: "limited", label: "Limited" },
  { value: "none", label: "None" },
];


export const FinancialLegalStep: React.FC = () => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<AgreementFormData>();

  const contractValue = watch("contract_value");
  const liabilityCap = watch("liability_cap");
  const insuranceRequirements = watch("insurance_requirements");
  const indemnification = watch("indemnification");

  const hasError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AgreementFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 5: Financial Terms
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contract Value */}
        <div className="space-y-2">
          <Label htmlFor="contract_value">Contract Value</Label>
          <Input
            id="contract_value"
            type="number"
            step="0.01"
            min="0"
            {...register("contract_value", { valueAsNumber: true })}
            className={hasError("contract_value") ? "border-red-500" : ""}
            placeholder="e.g., 100000.00"
          />
          {hasError("contract_value") && (
            <p className="text-sm text-red-500">{getError("contract_value")}</p>
          )}
        </div>

        {/* Liability Cap */}
        <div className="space-y-2">
          <Label htmlFor="liability_cap">Liability Cap</Label>
          <Input
            id="liability_cap"
            type="number"
            step="0.01"
            min="0"
            {...register("liability_cap", { valueAsNumber: true })}
            className={hasError("liability_cap") ? "border-red-500" : ""}
            placeholder="e.g., 500000.00"
          />
          {hasError("liability_cap") && (
            <p className="text-sm text-red-500">{getError("liability_cap")}</p>
          )}
        </div>

        {/* Insurance Requirements */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="insurance_requirements">Insurance Requirements</Label>
          <Input
            id="insurance_requirements"
            {...register("insurance_requirements")}
            className={hasError("insurance_requirements") ? "border-red-500" : ""}
            placeholder="e.g., General liability insurance of $2M"
            maxLength={500}
          />
          {hasError("insurance_requirements") && (
            <p className="text-sm text-red-500">{getError("insurance_requirements")}</p>
          )}
        </div>

        {/* Indemnification */}
        <div className="space-y-2">
          <Label htmlFor="indemnification">Indemnification</Label>
          <Select
            key={`indemnification-select-${indemnification || "none"}`}
            value={indemnification || ""}
            onValueChange={(value) =>
              setValue("indemnification", value ? (value as any) : null, { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select indemnification" />
            </SelectTrigger>
            <SelectContent>
              {INDEMNIFICATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("indemnification") && (
            <p className="text-sm text-red-500">{getError("indemnification")}</p>
          )}
        </div>

      </div>
    </div>
  );
};

