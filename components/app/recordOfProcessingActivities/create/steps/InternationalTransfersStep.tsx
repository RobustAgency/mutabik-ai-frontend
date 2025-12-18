"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";
import type { RecordOfProcessingActivityFormData } from "@/lib/schemas/recordOfProcessingActivity.schema";

const jurisdictionOptions = [
  { value: "eu", label: "EU" },
  { value: "uae", label: "UAE" },
  { value: "uk", label: "UK" },
  { value: "ksa", label: "KSA" },
  { value: "difc", label: "DIFC" },
  { value: "us_ca", label: "US/CA" },
  { value: "other", label: "Other" },
];

export const InternationalTransfersStep: React.FC = () => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<RecordOfProcessingActivityFormData>();

  const internalRecipients = watch("internal_recipients") || [];
  const externalRecipients = watch("external_recipients") || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center gap-2">
        <Checkbox
          id="has_international_transfers"
          checked={watch("has_international_transfers") || false}
          onCheckedChange={(checked) =>
            setValue("has_international_transfers", checked === true)
          }
        />
        <Label 
          htmlFor="has_international_transfers" 
          className="cursor-pointer"
          onClick={() => setValue("has_international_transfers", !watch("has_international_transfers"))}
        >
          Has International Transfers
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="applicable_jurisdictions">
          Applicable Jurisdictions <span className="text-red-500">*</span>
        </Label>
        <CustomMultiSelect
          options={jurisdictionOptions}
          value={watch("applicable_jurisdictions") || []}
          onChange={(value) => setValue("applicable_jurisdictions", value as any)}
          placeholder="Select jurisdictions"
          className={`w-full ${errors.applicable_jurisdictions ? "border-red-500" : ""}`}
        />
        {errors.applicable_jurisdictions && (
          <p className="text-sm text-red-500">
            {errors.applicable_jurisdictions.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="internal_recipients">Internal Recipients</Label>
          <Input
            id="internal_recipients"
            value={internalRecipients.join(", ") || ""}
            onChange={(e) =>
              setValue(
                "internal_recipients",
                e.target.value
                  ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  : []
              )
            }
            className="w-full"
            placeholder="Comma-separated list (e.g., HR, Finance)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="external_recipients">External Recipients</Label>
          <Input
            id="external_recipients"
            value={externalRecipients.join(", ") || ""}
            onChange={(e) =>
              setValue(
                "external_recipients",
                e.target.value
                  ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  : []
              )
            }
            className="w-full"
            placeholder="Comma-separated list (e.g., Cloud Provider)"
          />
        </div>
      </div>
    </div>
  );
};

