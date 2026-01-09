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
import { MeetingType } from "@/interfaces/CommitteeMeeting";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

const meetingTypeOptions = [
  { value: MeetingType.REGULAR, label: "Regular" },
  { value: MeetingType.AD_HOC, label: "Ad Hoc" },
  { value: MeetingType.EMERGENCY, label: "Emergency" },
];

export const MeetingTypeField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const watchedMeetingType = watch("meeting_type");
  const hasError = !!errors.meeting_type;

  return (
    <div className="space-y-2">
      <Label htmlFor="meeting_type">
        Meeting Type <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`meeting-type-select-${watchedMeetingType}`}
        value={watchedMeetingType || ""}
        onValueChange={(value) =>
          setValue("meeting_type", value as MeetingType, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select meeting type" />
        </SelectTrigger>
        <SelectContent>
          {meetingTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.meeting_type?.message as string}
        </p>
      )}
    </div>
  );
};

