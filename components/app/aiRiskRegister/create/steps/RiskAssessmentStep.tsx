"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import type { AiRiskRegisterFormData } from "@/lib/schemas/aiRiskRegister.schema";
import { RiskDecision, RiskLevel } from "@/interfaces/AiRiskRegister";
import { formatRiskDecision, formatRiskLevel } from "@/utils/riskUtils";
import RiskMethodologyModalForm from "@/components/app/riskMethodologies/RiskMethodologyModalForm";

interface RiskAssessmentStepProps {
  riskMethodologies: any[];
  isRiskMethodologiesLoading: boolean;
}

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({
  riskMethodologies,
  isRiskMethodologiesLoading,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AiRiskRegisterFormData>();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Risk Assessment
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk_methodology_id">
          Risk Methodology <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="risk_methodology_id"
          control={control}
          render={({ field }) => (
            <SelectWithInlineCreate
              key={`risk_methodology_id-${field.value ?? "none"}`}
              value={field.value || undefined}
              onValueChange={(value) => field.onChange(value || "")}
              options={riskMethodologies.map((item: any) => ({
                id: item.id,
                label: item.name,
                value: String(item.id),
              }))}
              isLoading={isRiskMethodologiesLoading}
              isEmpty={
                !isRiskMethodologiesLoading && riskMethodologies.length === 0
              }
              entityName="Risk Methodology"
              modalForm={RiskMethodologyModalForm}
              placeholder="Select Risk Methodology"
              error={!!errors.risk_methodology_id}
            />
          )}
        />
        {errors.risk_methodology_id && (
          <p className="text-sm text-red-500">
            {errors.risk_methodology_id.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="likelihood_code">
            Likelihood Code <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="likelihood_code"
            control={control}
            render={({ field }) => (
              <Select 
              key={`likelihood_code-${field.value || "none"}`}
              value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`h-11 w-full px-4 rounded-lg border ${
                    errors.likelihood_code
                      ? "border-red-500"
                      : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                >
                  <SelectValue placeholder="Select likelihood" />
                </SelectTrigger>
                <SelectContent>
                  {["rare", "unlikely", "possible", "likely", "almost_certain"].map(
                    (item) => (
                      <SelectItem key={item} value={item}>
                        {item.replace("_", " ").replace(/\b\w/g, (c) =>
                          c.toUpperCase()
                        )}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.likelihood_code && (
            <p className="text-sm text-red-500">
              {errors.likelihood_code.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="impact_code">
            Impact Code <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="impact_code"
            control={control}
            render={({ field }) => (
              <Select 
              key={`impact_code-${field.value || "none"}`}
              value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`h-11 w-full px-4 rounded-lg border ${
                    errors.impact_code
                      ? "border-red-500"
                      : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                >
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  {["rare", "unlikely", "possible", "likely", "almost_certain"].map(
                    (item) => (
                      <SelectItem key={item} value={item}>
                        {item.replace("_", " ").replace(/\b\w/g, (c) =>
                          c.toUpperCase()
                        )}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.impact_code && (
            <p className="text-sm text-red-500">{errors.impact_code.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="inherent_score">Inherent Score</Label>
          <Input
            id="inherent_score"
            {...register("inherent_score")}
            placeholder="7"
            className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="residual_score">Residual Score</Label>
          <Input
            id="residual_score"
            {...register("residual_score")}
            placeholder="3"
            className="h-11 w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="risk_level">
            Risk Level <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="risk_level"
            control={control}
            render={({ field }) => (
              <Select 
              key={`risk_level-${field.value || "none"}`}
              value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${
                    errors.risk_level ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RiskLevel).map((item) => (
                    <SelectItem key={item} value={item}>
                      {formatRiskLevel(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.risk_level && (
            <p className="text-sm text-red-500">{errors.risk_level.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="decision">
            Decision <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="decision"
            control={control}
            render={({ field }) => (
              <Select  
              key={`decision-${field.value || "none"}`}
              value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${
                    errors.decision ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RiskDecision).map((item) => (
                    <SelectItem key={item} value={item}>
                      {formatRiskDecision(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.decision && (
            <p className="text-sm text-red-500">{errors.decision.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

