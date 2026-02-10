"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiCommitteeModalForm from "@/components/app/aiCommittees/create/AiCommitteeModalForm";
import { useGetAiCommitteesQuery } from "@/app/lib/features/aiCommitteesApi";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

export const AiCommitteeField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const { data: committeesData, isLoading: isLoadingCommittees } = useGetAiCommitteesQuery({ per_page: 100 });
  const committees = committeesData?.data ?? [];

  const watchedCommitteeId = watch("ai_committee_id");

  // Prepare options for SelectWithInlineCreate
  const committeeOptions = React.useMemo(() => {
    return committees.map((committee) => ({
      id: committee.id,
      label: committee.name,
      value: committee.id.toString(),
    }));
  }, [committees]);

  // Convert to string for SelectWithInlineCreate
  const committeeIdString = watchedCommitteeId !== undefined && watchedCommitteeId !== null && watchedCommitteeId !== 0
    ? String(watchedCommitteeId)
    : "";

  const hasError = !!errors.ai_committee_id;

  return (
    <div className="space-y-2">
      <Label htmlFor="ai_committee_id">
        AI Committee <span className="text-red-500">*</span>
      </Label>
      <SelectWithInlineCreate
        key={`ai_committee_id-select-${watchedCommitteeId || "none"}`}
        value={committeeIdString}
        onValueChange={(value) => {
          const numValue = value && value !== "" ? parseInt(value, 10) : undefined;
          setValue("ai_committee_id", numValue as any, {
            shouldValidate: true,
          });
        }}
        placeholder="Select AI Committee"
        options={committeeOptions}
        isLoading={isLoadingCommittees}
        isEmpty={committees.length === 0}
        entityName="AI Committee"
        modalForm={AiCommitteeModalForm}
        canCreate={true}
        modalTitle="Create AI Committee"
        modalDescription="Complete the form to create a new AI committee"
        error={hasError}
        triggerClassName={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.ai_committee_id?.message as string}
        </p>
      )}
    </div>
  );
};

