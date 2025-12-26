"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

export const AdditionalInformationStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  const hasError = (fieldName: keyof VendorFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof VendorFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 4: Additional Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          className={hasError("notes") ? "border-red-500" : ""}
          placeholder="Enter any additional notes about this vendor..."
          rows={6}
        />
        {hasError("notes") && (
          <p className="text-sm text-red-500">{getError("notes")}</p>
        )}
      </div>
    </div>
  );
};
