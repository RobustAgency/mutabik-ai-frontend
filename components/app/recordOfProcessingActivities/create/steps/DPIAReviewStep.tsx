"use client";

import React, { useMemo } from "react";
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
import { useGetDataProtectionImpactAssessmentsQuery } from "@/app/lib/features/dataProtectionImpactAssessmentsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import DpiaModalForm from "@/components/app/dpia/create/DpiaModalForm";

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

  const { data: dpiaData, isLoading: isLoadingDPIAs } =
    useGetDataProtectionImpactAssessmentsQuery({
      per_page: 100,
    });

  const dpiaRequired = watch("dpia_required");
  const dpiaId = watch("dpia_id");

  const dpias = dpiaData?.data ?? [];

  const dpiaOptions = useMemo(() => {
    const base =
      dpias.map((dpia: any) => ({
        id: dpia.id,
        value: dpia.id.toString(),
        label: `${dpia.dpia_code} - ${dpia.dpia_name}`,
      })) || [];

    // Ensure currently selected DPIA is present in options
    if (dpiaId) {
      const exists = base.some((opt) => opt.value === dpiaId.toString());
      if (!exists) {
        base.unshift({
          id: dpiaId,
          value: dpiaId.toString(),
          label: `DPIA #${dpiaId}`,
        });
      }
    }

    return base;
  }, [dpias, dpiaId]);

  const handleDpiaRequiredChange = (checked: boolean) => {
    setValue("dpia_required", checked);
    if (!checked) {
      // Clear DPIA fields when unchecked
      setValue("dpia_status", null);
      setValue("dpia_id", null);
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
              key={`dpia_status-${watch("dpia_status") || "none"}`}
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
            <SelectWithInlineCreate
              key={`dpia_id-${dpiaId || "none"}`}
              value={dpiaId ? dpiaId.toString() : ""}
              onValueChange={(value) => {
                setValue("dpia_id", value ? (Number(value) as any) : (null as any));
              }}
              placeholder="Select DPIA"
              disabled={isLoadingDPIAs}
              options={dpiaOptions}
              isLoading={isLoadingDPIAs}
              isEmpty={dpiaOptions.length === 0}
              entityName="DPIA"
              modalForm={DpiaModalForm}
              canCreate={true}
              modalTitle="Create New DPIA"
              modalDescription="Create a new Data Protection Impact Assessment and link it to this ROPA."
              triggerClassName={`w-full ${
                errors.dpia_id ? "border-red-500" : ""
              }`}
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

