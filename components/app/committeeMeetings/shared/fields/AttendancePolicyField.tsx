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
import { AttendancePolicy } from "@/interfaces/CommitteeMeeting";
import type { CommitteeMeetingFormData } from "@/lib/schemas/committeeMeeting.schema";

const attendancePolicyOptions = [
  {
    value: AttendancePolicy.QUORUM_REQUIRED,
    label: "Quorum Required",
  },
  {
    value: AttendancePolicy.NO_QUORUM_REQUIRED,
    label: "No Quorum Required",
  },
];

export const AttendancePolicyField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeMeetingFormData>();

  const watchedAttendancePolicy = watch("attendance_policy");
  const hasError = !!errors.attendance_policy;

  return (
    <div className="space-y-2">
      <Label htmlFor="attendance_policy">
        Attendance Policy <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`attendance-policy-select-${watchedAttendancePolicy}`}
        value={watchedAttendancePolicy || ""}
        onValueChange={(value) =>
          setValue("attendance_policy", value as AttendancePolicy, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select attendance policy" />
        </SelectTrigger>
        <SelectContent>
          {attendancePolicyOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.attendance_policy?.message as string}
        </p>
      )}
    </div>
  );
};

