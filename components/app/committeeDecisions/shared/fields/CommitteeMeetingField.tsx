"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useGetCommitteeMeetingsQuery } from "@/app/lib/features/committeeMeetingsApi";
import type { CommitteeDecisionFormData } from "@/lib/schemas/committeeDecision.schema";

export const CommitteeMeetingField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeDecisionFormData>();

  const { data: meetingsData, isLoading: isLoadingMeetings } = useGetCommitteeMeetingsQuery({ per_page: 100 });
  const meetings = meetingsData?.data ?? [];

  const watchedMeetingId = watch("committee_meeting_id");

  // Prepare options for SelectWithInlineCreate
  const meetingOptions = React.useMemo(() => {
    return meetings.map((meeting) => {
      const meetingDate = meeting.scheduled_at
        ? new Date(meeting.scheduled_at).toLocaleDateString()
        : "Unknown date";
      return {
        id: meeting.id,
        label: `${meeting.committee?.name || "Unknown"} - ${meetingDate}`,
        value: meeting.id.toString(),
      };
    });
  }, [meetings]);

  // Convert to string for SelectWithInlineCreate
  const meetingIdString = watchedMeetingId !== undefined && watchedMeetingId !== null && watchedMeetingId !== 0
    ? String(watchedMeetingId)
    : "";

  const hasError = !!errors.committee_meeting_id;

  return (
    <div className="space-y-2">
      <Label htmlFor="committee_meeting_id">
        Committee Meeting <span className="text-red-500">*</span>
      </Label>
      <SelectWithInlineCreate
        key={`committee_meeting_id-select-${watchedMeetingId || "none"}`}
        value={meetingIdString}
        onValueChange={(value) => {
          const numValue = value && value !== "" ? parseInt(value, 10) : undefined;
          setValue("committee_meeting_id", numValue as any, {
            shouldValidate: true,
          });
        }}
        placeholder="Select committee meeting"
        options={meetingOptions}
        isLoading={isLoadingMeetings}
        isEmpty={meetings.length === 0}
        entityName="Committee Meeting"
        modalForm={() => null} // TODO: Add CommitteeMeetingModalForm when available
        canCreate={false}
        error={hasError}
        triggerClassName={hasError ? "border-red-500" : ""}
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.committee_meeting_id?.message as string}
        </p>
      )}
    </div>
  );
};

