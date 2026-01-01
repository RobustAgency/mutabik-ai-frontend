"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ModelDatasetLinkFormData } from "@/lib/schemas/modelDatasetLink.schema";

export const TrainingDetailsStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ModelDatasetLinkFormData>();

  const rowsUsed = watch("rows_used");
  const trainingStartDate = watch("training_start_date");
  const trainingEndDate = watch("training_end_date");
  const trainingDuration = watch("training_duration");
  const computeResources = watch("compute_resources");
  const cost = watch("cost");

  const hasError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof ModelDatasetLinkFormData) =>
    errors[fieldName]?.message as string;

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert date input value to ISO string
  const handleDateChange = (field: "training_start_date" | "training_end_date", value: string) => {
    if (value) {
      const date = new Date(value);
      setValue(field, date.toISOString().split('T')[0], { shouldValidate: true });
    } else {
      setValue(field, null, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Training Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rows Used */}
          <div className="space-y-2">
            <Label htmlFor="rows_used">Rows Used</Label>
            <Input
              id="rows_used"
              type="number"
              {...register("rows_used", { valueAsNumber: true, setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              placeholder="e.g., 1500000"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">Number of rows used from the dataset</p>
          </div>

          {/* Training Start Date */}
          <div className="space-y-2">
            <Label htmlFor="training_start_date">Training Start Date</Label>
            <Input
              id="training_start_date"
              type="date"
              value={formatDateForInput(trainingStartDate)}
              onChange={(e) => handleDateChange("training_start_date", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Training End Date */}
          <div className="space-y-2">
            <Label htmlFor="training_end_date">Training End Date</Label>
            <Input
              id="training_end_date"
              type="date"
              value={formatDateForInput(trainingEndDate)}
              onChange={(e) => handleDateChange("training_end_date", e.target.value)}
              className={`w-full ${hasError("training_end_date") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("training_end_date") && (
              <p className="text-sm text-red-500">{getError("training_end_date")}</p>
            )}
          </div>

          {/* Training Duration */}
          <div className="space-y-2">
            <Label htmlFor="training_duration">Training Duration</Label>
            <Input
              id="training_duration"
              {...register("training_duration")}
              placeholder="e.g., 2 hours, 3 days"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">Human-readable duration</p>
          </div>

          {/* Compute Resources */}
          <div className="space-y-2">
            <Label htmlFor="compute_resources">Compute Resources</Label>
            <Input
              id="compute_resources"
              {...register("compute_resources")}
              placeholder="e.g., 4x A100 GPUs, 32 CPU cores"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">Hardware/resources used</p>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              {...register("cost", { valueAsNumber: true, setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              placeholder="e.g., 1250.50"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">Training cost in currency units</p>
          </div>
        </div>
      </div>
    </div>
  );
};

