"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

export const AssigneeField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const { data: stakeholdersResponse, isLoading: isLoadingStakeholders } = useGetStakeholdersQuery({ per_page: 100 });
  const stakeholders = stakeholdersResponse?.data || [];

  const watchedAssigneeId = watch("assignee_id");

  // Prepare options for SelectWithInlineCreate
  const stakeholderOptions = React.useMemo(() => {
    return stakeholders.map((stakeholder) => ({
      id: stakeholder.id,
      label: stakeholder.display_name,
      value: stakeholder.id.toString(),
    }));
  }, [stakeholders]);

  // Convert to string for SelectWithInlineCreate
  const assigneeIdString = watchedAssigneeId !== undefined && watchedAssigneeId !== null && watchedAssigneeId !== 0
    ? String(watchedAssigneeId)
    : "";

  const hasError = !!errors.assignee_id;

  return (
    <div className="space-y-2">
      <Label htmlFor="assignee_id">
        Assignee <span className="text-red-500">*</span>
      </Label>
      <SelectWithInlineCreate
        key={`assignee_id-select-${watchedAssigneeId || "none"}`}
        value={assigneeIdString}
        onValueChange={(value) => {
          const numValue = value && value !== "" ? parseInt(value, 10) : undefined;
          setValue("assignee_id", numValue as any, {
            shouldValidate: true,
          });
        }}
        placeholder="Select assignee"
        options={stakeholderOptions}
        isLoading={isLoadingStakeholders}
        isEmpty={stakeholders.length === 0}
        entityName="Stakeholder"
        modalForm={StakeholderModalForm}
        canCreate={true}
        modalTitle="Create Stakeholder"
        modalDescription="Complete the form to create a new stakeholder"
        error={hasError}
        triggerClassName={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.assignee_id?.message as string}
        </p>
      )}
    </div>
  );
};

