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
import { VoteMethod } from "@/interfaces/CommitteeDecision";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

const voteMethodOptions = [
  { value: VoteMethod.SIMPLE_MAJORITY, label: "Simple Majority" },
  { value: VoteMethod.SUPER_MAJORITY, label: "Super Majority" },
  { value: VoteMethod.CONSENSUS, label: "Consensus" },
  { value: VoteMethod.CHAIR_DECISION, label: "Chair Decision" },
];

export const VoteMethodField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const watchedVoteMethod = watch("vote_method");
  const hasError = !!errors.vote_method;

  return (
    <div className="space-y-2">
      <Label htmlFor="vote_method">
        Vote Method <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`vote-method-select-${watchedVoteMethod}`}
        value={watchedVoteMethod || ""}
        onValueChange={(value) =>
          setValue("vote_method", value as VoteMethod, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select vote method" />
        </SelectTrigger>
        <SelectContent>
          {voteMethodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.vote_method?.message as string}
        </p>
      )}
    </div>
  );
};

