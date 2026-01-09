"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoteResult } from "@/interfaces/CommitteeDecision";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

const voteResultOptions = [
  { value: VoteResult.PASSED, label: "Passed" },
  { value: VoteResult.FAILED, label: "Failed" },
  { value: VoteResult.NOT_APPLICABLE, label: "Not Applicable" },
];

export const VoteResultField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const watchedVoteResult = watch("vote_result");
  const hasError = !!errors.vote_result;

  return (
    <div className="space-y-2">
      <Label htmlFor="vote_result">
        Vote Result <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`vote-result-select-${watchedVoteResult}`}
        value={watchedVoteResult || ""}
        onValueChange={(value) =>
          setValue("vote_result", value as VoteResult, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select vote result" />
        </SelectTrigger>
        <SelectContent>
          {voteResultOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.vote_result?.message as string}
        </p>
      )}
    </div>
  );
};

