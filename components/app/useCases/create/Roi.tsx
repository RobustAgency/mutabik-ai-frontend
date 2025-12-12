"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "../types/useCaseTypes";

interface RoiProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors?: Record<string, string[]>;
}

const Roi: React.FC<RoiProps> = ({ formData, setFormData, errors = {} }) => {
  // Local states for smooth typing
  const [expectedRoiInput, setExpectedRoiInput] = useState(formData.expected_roi ?? "");
  const [budgetAllocatedInput, setBudgetAllocatedInput] = useState(formData.budget_allocated ?? "");
  const [estimatedImplementationCostInput, setEstimatedImplementationCostInput] = useState(formData.estimated_implementation_cost ?? "");
  const [estimatedTimeSavingsInput, setEstimatedTimeSavingsInput] = useState(formData.estimated_time_savings ?? "");
  const [estimatedCostSavingsInput, setEstimatedCostSavingsInput] = useState(formData.estimated_cost_savings ?? "");
  const [estimatedRevenueImpactInput, setEstimatedRevenueImpactInput] = useState(formData.estimated_revenue_impact ?? "");
  const [estimatedFteSavingInput, setEstimatedFteSavingInput] = useState(formData.estimated_fte_saving ?? "");
  const [successMetricsInput, setSuccessMetricsInput] = useState(formData.success_metrics || "");

  // Sync local state when formData resets
  useEffect(() => {
    setExpectedRoiInput(formData.expected_roi ?? "");
    setBudgetAllocatedInput(formData.budget_allocated ?? "");
    setEstimatedImplementationCostInput(formData.estimated_implementation_cost ?? "");
    setEstimatedTimeSavingsInput(formData.estimated_time_savings ?? "");
    setEstimatedCostSavingsInput(formData.estimated_cost_savings ?? "");
    setEstimatedRevenueImpactInput(formData.estimated_revenue_impact ?? "");
    setEstimatedFteSavingInput(formData.estimated_fte_saving ?? "");
    setSuccessMetricsInput(formData.success_metrics || "");
  }, [formData]);

  // Helper to check if field has error
  const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
  const getError = (fieldName: string) => errors[fieldName]?.[0];

  return (
    <div className="space-y-6 w-full">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 2: ROI & Business Impact
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1 - Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {/* Estimated ROI (%) */}
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Estimated ROI (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              max="999.99"
              value={expectedRoiInput}
              onChange={(e) => setExpectedRoiInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({ ...prev, expected_roi: Number(expectedRoiInput) }))
              }
              placeholder="25.50 (0.00-999.99)"
              className={`h-11 w-full px-4 rounded-lg border ${
                hasError("expected_roi") ? "border-red-500" : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("expected_roi") && (
              <p className="text-sm text-red-500">{getError("expected_roi")}</p>
            )}
          </div>

          {/* Budget Allocated */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Budget Allocated</Label>
            <Input
              type="number"
              min="0"
              value={budgetAllocatedInput}
              onChange={(e) => setBudgetAllocatedInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({ ...prev, budget_allocated: Number(budgetAllocatedInput) }))
              }
              placeholder="100,000"
              className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>

          {/* Estimated Implementation Cost */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Estimated Implementation Cost</Label>
            <Input
              type="number"
              min="0"
              value={estimatedImplementationCostInput}
              onChange={(e) => setEstimatedImplementationCostInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({
                  ...prev,
                  estimated_implementation_cost: Number(estimatedImplementationCostInput),
                }))
              }
              placeholder="75,000"
              className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
            />
          </div>
        </div>

        {/* Row 2 - Impact Estimates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Estimated Time Savings (%) */}
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Estimated Time Savings (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="number"
              min="0"
              value={estimatedTimeSavingsInput}
              onChange={(e) => setEstimatedTimeSavingsInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({
                  ...prev,
                  estimated_time_savings: Number(estimatedTimeSavingsInput),
                }))
              }
              placeholder="30"
              className={`h-11 w-full px-4 rounded-lg border ${
                hasError("estimated_time_savings") ? "border-red-500" : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("estimated_time_savings") && (
              <p className="text-sm text-red-500">{getError("estimated_time_savings")}</p>
            )}
          </div>

          {/* Estimated Cost Savings */}
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Estimated Cost Savings <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="number"
              min="0"
              value={estimatedCostSavingsInput}
              onChange={(e) => setEstimatedCostSavingsInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({
                  ...prev,
                  estimated_cost_savings: Number(estimatedCostSavingsInput),
                }))
              }
              placeholder="50,000"
              className={`h-11 w-full px-4 rounded-lg border ${
                hasError("estimated_cost_savings") ? "border-red-500" : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("estimated_cost_savings") && (
              <p className="text-sm text-red-500">{getError("estimated_cost_savings")}</p>
            )}
          </div>

          {/* Estimated Revenue Impact */}
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Estimated Revenue Impact <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="number"
              min="0"
              value={estimatedRevenueImpactInput}
              onChange={(e) => setEstimatedRevenueImpactInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({
                  ...prev,
                  estimated_revenue_impact: Number(estimatedRevenueImpactInput),
                }))
              }
              placeholder="200,000"
              className={`h-11 w-full px-4 rounded-lg border ${
                hasError("estimated_revenue_impact") ? "border-red-500" : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("estimated_revenue_impact") && (
              <p className="text-sm text-red-500">{getError("estimated_revenue_impact")}</p>
            )}
          </div>

          {/* Estimated FTE Savings */}
          <div className="flex flex-col gap-2 w-full">
            <Label>
              Estimated FTE Savings <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              type="number"
              min="0"
              step="1"
              value={estimatedFteSavingInput}
              onChange={(e) => setEstimatedFteSavingInput(Number(e.target.value))}
              onBlur={() =>
                setFormData((prev) => ({
                  ...prev,
                  estimated_fte_saving: Number(estimatedFteSavingInput),
                }))
              }
              placeholder="5"
              className={`h-11 w-full px-4 rounded-lg border ${
                hasError("estimated_fte_saving") ? "border-red-500" : "border-[#D0D5DD]"
              } focus:border-[#D0D5DD] focus:-ring-0`}
            />
            {hasError("estimated_fte_saving") && (
              <p className="text-sm text-red-500">{getError("estimated_fte_saving")}</p>
            )}
          </div>
        </div>

        {/* Success Metrics (KPIs) */}
        <div className="flex flex-col gap-2 w-full">
          <Label>
            Success Metrics (KPIs) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            required
            value={successMetricsInput}
            onChange={(e) => setSuccessMetricsInput(e.target.value)}
            onBlur={() =>
              setFormData((prev) => ({ ...prev, success_metrics: successMetricsInput }))
            }
            placeholder="Describe key performance indicators and success criteria (minimum 50 characters)..."
            className={`min-h-24 resize-none ${
              hasError("success_metrics") ? "border-red-500" : ""
            }`}
          />
          {hasError("success_metrics") && (
            <p className="text-sm text-red-500">{getError("success_metrics")}</p>
          )}
          <p className="text-xs text-gray-500">
            {successMetricsInput.length} / 2000 characters (minimum 50)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Roi;
