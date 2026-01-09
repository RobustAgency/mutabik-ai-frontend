"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateCommitteeMeetingData } from "@/interfaces/CommitteeMeeting";
import type { CommitteeMeeting } from "@/interfaces/CommitteeMeeting";
import {
  committeeMeetingSchema,
  type CommitteeMeetingFormData,
} from "@/lib/schemas/committeeMeeting.schema";
import { MeetingType, AttendancePolicy } from "@/interfaces/CommitteeMeeting";
import { AiCommitteeField } from "./fields/AiCommitteeField";
import { MeetingTypeField } from "./fields/MeetingTypeField";
import { ScheduledAtField } from "./fields/ScheduledAtField";
import { DurationField } from "./fields/DurationField";
import { AgendaField } from "./fields/AgendaField";
import { MaterialsLinkField } from "./fields/MaterialsLinkField";
import { AttendancePolicyField } from "./fields/AttendancePolicyField";
import { AttendanceRosterField, getAttendanceRosterValue } from "./fields/AttendanceRosterField";
import { MinutesLinkField } from "./fields/MinutesLinkField";

const initialFormData: CommitteeMeetingFormData = {
  ai_committee_id: 0,
  meeting_type: MeetingType.REGULAR,
  scheduled_at: "",
  duration_minutes: null,
  agenda: "",
  materials_link: null,
  attendance_policy: AttendancePolicy.QUORUM_REQUIRED,
  attendance_roster: null,
  minutes_link: null,
};

interface CommitteeMeetingFormProps {
  mode: "create" | "edit";
  initialData?: CommitteeMeeting;
  isLoading?: boolean;
  onSubmit: (
    data: CreateCommitteeMeetingData | Partial<CreateCommitteeMeetingData>
  ) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const CommitteeMeetingForm: React.FC<CommitteeMeetingFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
  hideHeader = false,
}) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attendanceRosterText, setAttendanceRosterText] = useState("");

  const methods = useForm<CommitteeMeetingFormData>({
    resolver: zodResolver(committeeMeetingSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const scheduledDate = initialData.scheduled_at
        ? new Date(initialData.scheduled_at).toISOString().slice(0, 16)
        : "";
      const rosterText = initialData.attendance_roster
        ? initialData.attendance_roster.join("\n")
        : "";

      reset({
        ai_committee_id: initialData.ai_committee_id,
        meeting_type: initialData.meeting_type,
        scheduled_at: scheduledDate,
        duration_minutes: initialData.duration_minutes,
        agenda: initialData.agenda,
        materials_link: initialData.materials_link || null,
        attendance_policy: initialData.attendance_policy,
        attendance_roster: initialData.attendance_roster,
        minutes_link: initialData.minutes_link || null,
      });
      setAttendanceRosterText(rosterText);
    }
  }, [mode, initialData, reset]);

  // Collect all validation errors
  const validationErrors = useMemo(() => {
    const errorObj: Record<string, string[]> = {};
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        errorObj[key] = [error.message as string];
      }
    });
    return errorObj;
  }, [errors]);

  const handleFormSubmit = handleSubmit(async (data: CommitteeMeetingFormData) => {
    setSubmitError(null);
    try {
      // Convert scheduled_at to ISO string format
      const scheduledAtISO = data.scheduled_at
        ? new Date(data.scheduled_at).toISOString()
        : "";

      // Parse attendance roster from text
      const attendanceRoster = getAttendanceRosterValue(attendanceRosterText);

      const submitData: CreateCommitteeMeetingData = {
        ...data,
        scheduled_at: scheduledAtISO,
        attendance_roster: attendanceRoster,
        materials_link: data.materials_link || null,
        minutes_link: data.minutes_link || null,
        duration_minutes: data.duration_minutes || null,
      };

      await onSubmit(submitData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error?.error?.data?.message || "Failed to save Committee Meeting";
      setSubmitError(errorMessage);
    }
  });

  return (
    <FormProvider {...methods}>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        {!hideHeader && (
          <CardContent className="flex flex-col gap-2 pb-4">
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              {title}
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              {description}
            </p>
          </CardContent>
        )}

        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Show validation errors in alert */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, fieldErrors]) => (
                      <li key={field}>
                        <span className="font-medium capitalize">
                          {field.replace(/_/g, " ")}:
                        </span>{" "}
                        {fieldErrors[0]}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Show submit error if any */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* AI Committee and Meeting Type in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AiCommitteeField />
                <MeetingTypeField />
              </div>

              {/* Scheduled At and Duration in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScheduledAtField />
                <DurationField />
              </div>

              {/* Agenda full width */}
              <AgendaField />

              {/* Materials Link and Attendance Policy in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaterialsLinkField />
                <AttendancePolicyField />
              </div>

              {/* Attendance Roster */}
              <AttendanceRosterField
                initialRoster={initialData?.attendance_roster}
                onRosterChange={setAttendanceRosterText}
              />

              {/* Minutes Link */}
              <MinutesLinkField />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Meeting"
                  : "Update Meeting"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
