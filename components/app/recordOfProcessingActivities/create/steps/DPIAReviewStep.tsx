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
import { Checkbox } from "@/components/ui/checkbox";
import type { RecordOfProcessingActivityFormData } from "@/lib/schemas/recordOfProcessingActivity.schema";

const dpiaStatusOptions = [
  { value: "required", label: "Required" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const DPIAReviewStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RecordOfProcessingActivityFormData>();

  const dpiaRequired = watch("dpia_required");
  const dpiaId = watch("dpia_id");

  const handleDpiaRequiredChange = (checked: boolean) => {
    setValue("dpia_required", checked);
    if (!checked) {
      // Clear DPIA fields when unchecked
      setValue("dpia_status", null);
      setValue("dpia_id", null);
    }
  };

  const handleDpiaIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      setValue("dpia_id", null);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        setValue("dpia_id", numValue);
      } else {
        setValue("dpia_id", null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex items-center gap-2">
        <Checkbox
          id="dpia_required"
          checked={dpiaRequired || false}
          onCheckedChange={handleDpiaRequiredChange}
        />
        <Label 
          htmlFor="dpia_required" 
          className="cursor-pointer"
          onClick={() => handleDpiaRequiredChange(!dpiaRequired)}
        >
          DPIA Required
        </Label>
      </div>

      {dpiaRequired && (
        <>
          <div className="space-y-2">
            <Label htmlFor="dpia_status">DPIA Status</Label>
            <Select
              value={watch("dpia_status") || ""}
              onValueChange={(value) => setValue("dpia_status", (value || null) as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select DPIA status" />
              </SelectTrigger>
              <SelectContent>
                {dpiaStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dpia_id">DPIA ID</Label>
            <Input
              id="dpia_id"
              type="number"
              value={dpiaId || ""}
              onChange={handleDpiaIdChange}
              className="w-full"
              placeholder="Enter DPIA ID"
            />
            {errors.dpia_id && (
              <p className="text-sm text-red-500">{errors.dpia_id.message}</p>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="last_reviewed_date">Last Reviewed Date</Label>
          <Input
            id="last_reviewed_date"
            type="date"
            {...register("last_reviewed_date")}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="next_review_date">Next Review Date</Label>
          <Input
            id="next_review_date"
            type="date"
            {...register("next_review_date")}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

