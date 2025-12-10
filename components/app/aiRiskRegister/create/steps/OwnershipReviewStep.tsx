"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StakeholderSelectorWithInline from "@/components/app/useCases/create/StakeholderSelectorWithInline";
import { FormState } from "../types";
import { ReviewCadence } from "@/interfaces/AiRiskRegister";
import { formatReviewCadence } from "@/utils/riskUtils";

interface OwnershipReviewStepProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  validationErrors: Record<string, string[]>;
}

export const OwnershipReviewStep: React.FC<OwnershipReviewStepProps> = ({
  formState,
  setFormState,
  validationErrors,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Ownership & Review
        </h3>
        <hr className="border-gray-200" />
      </div>

      <div className="space-y-2">
        <StakeholderSelectorWithInline
          label="Risk Owner"
          required
          value={formState.risk_owner ? Number(formState.risk_owner) : null}
          onValueChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              risk_owner: value ? String(value) : "",
            }))
          }
          placeholder="Select risk owner"
          filterType="all"
          error={validationErrors.risk_owner?.[0]}
        />
        {validationErrors.risk_owner && (
          <p className="text-sm text-red-500">{validationErrors.risk_owner[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="review_cadence">
            Review Cadence <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formState.review_cadence}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                review_cadence: value as ReviewCadence,
              }))
            }
          >
            <SelectTrigger
              className={`w-full ${
                validationErrors.review_cadence ? "border-red-500" : ""
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
          {validationErrors.review_cadence && (
            <p className="text-sm text-red-500">
              {validationErrors.review_cadence[0]}
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
            value={formState.next_review_due}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                next_review_due: e.target.value,
              }))
            }
            className={`h-[44px] w-full px-4 rounded-lg border ${
              validationErrors.next_review_due
                ? "border-red-500"
                : "border-[#D0D5DD]"
            } focus:border-[#D0D5DD] focus:-ring-0`}
          />
          {validationErrors.next_review_due && (
            <p className="text-sm text-red-500">
              {validationErrors.next_review_due[0]}
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
          value={formState.created_by}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, created_by: e.target.value }))
          }
          placeholder="user@example.com"
          className={`h-[44px] w-full px-4 rounded-lg border ${
            validationErrors.created_by ? "border-red-500" : "border-[#D0D5DD]"
          } focus:border-[#D0D5DD] focus:-ring-0`}
        />
        {validationErrors.created_by && (
          <p className="text-sm text-red-500">{validationErrors.created_by[0]}</p>
        )}
      </div>
    </div>
  );
};

