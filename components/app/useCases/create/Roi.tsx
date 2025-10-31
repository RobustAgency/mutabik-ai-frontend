"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataType } from "../types/useCaseTypes";

interface RoiProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const Roi: React.FC<RoiProps> = ({ formData, setFormData }) => {
  // ✅ Local states for smooth typing - Updated for new schema
  const [expectedRoiPercentageInput, setExpectedRoiPercentageInput] = useState(formData.expected_roi_percentage ?? "");
  const [budgetAllocatedInput, setBudgetAllocatedInput] = useState(formData.budget_allocated ?? "");
  const [estimatedImplementationCostInput, setEstimatedImplementationCostInput] = useState(formData.estimated_implementation_cost ?? "");
  const [estimatedReductionInTimeInput, setEstimatedReductionInTimeInput] = useState(formData.estimated_reduction_in_time ?? "");
  const [estimatedReductionInCostInput, setEstimatedReductionInCostInput] = useState(formData.estimated_reduction_in_cost ?? "");
  const [estimatedRevenueIncreaseInput, setEstimatedRevenueIncreaseInput] = useState(formData.estimated_revenue_increase ?? "");
  const [estimatedFteCapacitySavingInput, setEstimatedFteCapacitySavingInput] = useState(formData.estimated_fte_capacity_saving ?? "");

  // Sync local state when formData resets
  useEffect(() => {
    setExpectedRoiPercentageInput(formData.expected_roi_percentage ?? "");
    setBudgetAllocatedInput(formData.budget_allocated ?? "");
    setEstimatedImplementationCostInput(formData.estimated_implementation_cost ?? "");
    setEstimatedReductionInTimeInput(formData.estimated_reduction_in_time ?? "");
    setEstimatedReductionInCostInput(formData.estimated_reduction_in_cost ?? "");
    setEstimatedRevenueIncreaseInput(formData.estimated_revenue_increase ?? "");
    setEstimatedFteCapacitySavingInput(formData.estimated_fte_capacity_saving ?? "");
  }, [formData]);

  return (
    <div className="space-y-6 w-full">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          ROI
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1 - Core Financial Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {/* Expected ROI Percentage */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Expected ROI Percentage (%)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="999.99"
              value={expectedRoiPercentageInput}
              onChange={(e) => setExpectedRoiPercentageInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, expected_roi_percentage: Number(expectedRoiPercentageInput) }))}
              placeholder="25.50 (0.00-999.99)"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Budget Allocated */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Budget Allocated</Label>
            <Input
              type="number"
              min="0"
              value={budgetAllocatedInput}
              onChange={(e) => setBudgetAllocatedInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, budget_allocated: Number(budgetAllocatedInput) }))}
              placeholder="100,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Estimated Implementation Cost */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Estimated Implementation Cost</Label>
            <Input
              type="number"
              value={estimatedImplementationCostInput}
              onChange={(e) => setEstimatedImplementationCostInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, estimated_implementation_cost: Number(estimatedImplementationCostInput) }))}
              placeholder="75,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>

        {/* Row 2 - Estimated Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Estimated Reduction in Time */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Estimated Reduction in Time (%)</Label>
            <Input
              type="number"
              value={estimatedReductionInTimeInput}
              onChange={(e) => setEstimatedReductionInTimeInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, estimated_reduction_in_time: Number(estimatedReductionInTimeInput) }))}
              placeholder="30"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Estimated Reduction in Cost */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Estimated Reduction in Cost</Label>
            <Input
              type="number"
              value={estimatedReductionInCostInput}
              onChange={(e) => setEstimatedReductionInCostInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, estimated_reduction_in_cost: Number(estimatedReductionInCostInput) }))}
              placeholder="50,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Estimated Revenue Increase */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Estimated Revenue Increase</Label>
            <Input
              type="number"
              value={estimatedRevenueIncreaseInput}
              onChange={(e) => setEstimatedRevenueIncreaseInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, estimated_revenue_increase: Number(estimatedRevenueIncreaseInput) }))}
              placeholder="200,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Estimated FTE Capacity Saving */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Estimated FTE Capacity Saving</Label>
            <Input
              type="number"
              value={estimatedFteCapacitySavingInput}
              onChange={(e) => setEstimatedFteCapacitySavingInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, estimated_fte_capacity_saving: Number(estimatedFteCapacitySavingInput) }))}
              placeholder="5"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roi;
