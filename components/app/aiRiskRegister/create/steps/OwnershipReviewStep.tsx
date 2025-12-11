"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StakeholderSelectorWithInline from "@/components/app/useCases/create/StakeholderSelectorWithInline";
import type { AiRiskRegisterFormData } from "@/lib/schemas/aiRiskRegister.schema";
import { ReviewCadence } from "@/interfaces/AiRiskRegister";
import { formatReviewCadence } from "@/utils/riskUtils";

export const OwnershipReviewStep: React.FC = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AiRiskRegisterFormData>();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Ownership & Review
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-2">
        <Controller
          name="risk_owner"
          control={control}
          render={({ field }) => (
            <StakeholderSelectorWithInline
              label="Risk Owner"
              required
              value={field.value ? Number(field.value) : null}
              onValueChange={(value) => {
                field.onChange(value ? String(value) : "");
              }}
              placeholder="Select risk owner"
              filterType="all"
              error={errors.risk_owner?.message}
            />
          )}
        />
        {errors.risk_owner && (
          <p className="text-sm text-red-500">{errors.risk_owner.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="review_cadence">
            Review Cadence <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="review_cadence"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${
                    errors.review_cadence ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select review cadence" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ReviewCadence).map((item) => (
                    <SelectItem key={item} value={item}>
                      {formatReviewCadence(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.review_cadence && (
            <p className="text-sm text-red-500">
              {errors.review_cadence.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="next_review_due">
            Next Review Due <span className="text-red-500">*</span>
          </Label>
          <Input
            id="next_review_due"
            type="date"
            {...register("next_review_due")}
            className={`h-[44px] w-full px-4 rounded-lg border ${
              errors.next_review_due
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {errors.next_review_due && (
            <p className="text-sm text-red-500">
              {errors.next_review_due.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="created_by">
          Created By (email) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="created_by"
          {...register("created_by")}
          placeholder="user@example.com"
          className={`h-[44px] w-full px-4 rounded-lg border ${
            errors.created_by ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {errors.created_by && (
          <p className="text-sm text-red-500">{errors.created_by.message}</p>
        )}
      </div>
    </div>
  );
};

