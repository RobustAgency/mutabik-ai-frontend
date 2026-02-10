"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useGetCommitteeDecisionsQuery } from "@/app/lib/features/committeeDecisionsApi";
import CommitteeDecisionModalForm from "@/components/app/committeeDecisions/create/CommitteeDecisionModalForm";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const CommitteeDecisionField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const { data: decisionsData, isLoading: isLoadingDecisions } = useGetCommitteeDecisionsQuery({ per_page: 100 });
  const decisions = decisionsData?.data ?? [];

  const watchedDecisionId = watch("committee_decision_id");

  // Prepare options for SelectWithInlineCreate
  const decisionOptions = React.useMemo(() => {
    return decisions.map((decision) => {
      // Create a display label from decision data
      const decisionLabel = decision.rationale
        ? `${decision.decision_type} - ${decision.rationale.substring(0, 50)}${decision.rationale.length > 50 ? "..." : ""}`
        : `${decision.decision_type} - Decision ${decision.id}`;
      return {
        id: decision.id,
        label: decisionLabel,
        value: decision.id.toString(),
      };
    });
  }, [decisions]);

  // Convert to string for SelectWithInlineCreate
  const decisionIdString = watchedDecisionId !== undefined && watchedDecisionId !== null && watchedDecisionId !== 0
    ? String(watchedDecisionId)
    : "";

  const hasError = !!errors.committee_decision_id;

  return (
    <div className="space-y-2">
      <Label htmlFor="committee_decision_id">
        Committee Decision <span className="text-red-500">*</span>
      </Label>
      <SelectWithInlineCreate
        key={`committee_decision_id-select-${watchedDecisionId || "none"}`}
        value={decisionIdString}
        onValueChange={(value) => {
          const numValue = value && value !== "" ? parseInt(value, 10) : undefined;
          setValue("committee_decision_id", numValue as any, {
            shouldValidate: true,
          });
        }}
        placeholder="Select committee decision"
        options={decisionOptions}
        isLoading={isLoadingDecisions}
        isEmpty={decisions.length === 0}
        entityName="Committee Decision"
        modalForm={CommitteeDecisionModalForm}
        canCreate={true}
        modalTitle="Create Committee Decision"
        modalDescription="Complete the form to create a new committee decision"
        error={hasError}
        triggerClassName={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.committee_decision_id?.message as string}
        </p>
      )}
    </div>
  );
};

