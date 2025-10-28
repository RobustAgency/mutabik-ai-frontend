"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDataType } from "./CreateUseCases";

interface RoiProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const Roi: React.FC<RoiProps> = ({ formData, setFormData }) => {
  // ✅ Local states for smooth typing
  const [expectedRoiInput, setExpectedRoiInput] = useState(formData.expected_roi ?? "");
  const [implementationCostInput, setImplementationCostInput] = useState(formData.implementation_cost ?? "");
  const [reductionInTimeInput, setReductionInTimeInput] = useState(formData.reduction_in_time ?? "");
  const [reductionInCostInput, setReductionInCostInput] = useState(formData.reduction_in_cost ?? "");
  const [increaseInRevenueInput, setIncreaseInRevenueInput] = useState(formData.increase_in_revenue ?? "");
  const [riskAvoidanceInput, setRiskAvoidanceInput] = useState(formData.risk_avoidance ?? "");
  const [fteCapacityInput, setFteCapacityInput] = useState(formData.fte_capacity_saved ?? "");

  // Sync local state when formData resets
  useEffect(() => {
    setExpectedRoiInput(formData.expected_roi ?? "");
    setImplementationCostInput(formData.implementation_cost ?? "");
    setReductionInTimeInput(formData.reduction_in_time ?? "");
    setReductionInCostInput(formData.reduction_in_cost ?? "");
    setIncreaseInRevenueInput(formData.increase_in_revenue ?? "");
    setRiskAvoidanceInput(formData.risk_avoidance ?? "");
    setFteCapacityInput(formData.fte_capacity_saved ?? "");
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
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Expected ROI */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Expected ROI (%)</Label>
            <Input
              type="number"
              value={expectedRoiInput}
              onChange={(e) => setExpectedRoiInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, expected_roi: Number(expectedRoiInput) }))}
              placeholder="20%"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Implementation Cost */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Implementation Cost</Label>
            <Input
              type="number"
              value={implementationCostInput}
              onChange={(e) => setImplementationCostInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, implementation_cost: Number(implementationCostInput) }))}
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Reduction in Time */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Reduction in time (x)</Label>
            <Input
              type="number"
              value={reductionInTimeInput}
              onChange={(e) => setReductionInTimeInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, reduction_in_time: Number(reductionInTimeInput) }))}
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Reduction in Cost */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Reduction in cost (per year)</Label>
            <Input
              type="number"
              value={reductionInCostInput}
              onChange={(e) => setReductionInCostInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, reduction_in_cost: Number(reductionInCostInput) }))}
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Increase in Revenue */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Increase in revenue (per year)</Label>
            <Input
              type="number"
              value={increaseInRevenueInput}
              onChange={(e) => setIncreaseInRevenueInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, increase_in_revenue: Number(increaseInRevenueInput) }))}
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Risk Avoidance */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Risk avoidance (per year)</Label>
            <Input
              type="number"
              value={riskAvoidanceInput}
              onChange={(e) => setRiskAvoidanceInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, risk_avoidance: Number(riskAvoidanceInput) }))}
              placeholder="20,000"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* FTE Capacity */}
          <div className="flex flex-col gap-2 w-full">
            <Label>FTE capacity saved (count)</Label>
            <Input
              type="number"
              value={fteCapacityInput}
              onChange={(e) => setFteCapacityInput(Number(e.target.value))}
              onBlur={() => setFormData((prev) => ({ ...prev, fte_capacity_saved: Number(fteCapacityInput) }))}
              placeholder="30"
              className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roi;
