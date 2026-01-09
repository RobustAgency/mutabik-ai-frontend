"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetCommitteeMeetingQuery } from "@/app/lib/features/committeeMeetingsApi";
import { useGetAiCommitteesQuery } from "@/app/lib/features/aiCommitteesApi";
import {
  MeetingType,
  AttendancePolicy,
} from "@/interfaces/CommitteeMeeting";
import { formatDateShort } from "@/lib/helpers/date";

interface CommitteeMeetingDetailsProps {
  meetingId: number;
}

const formatMeetingType = (type: MeetingType): string => {
  const typeMap: Record<MeetingType, string> = {
    [MeetingType.REGULAR]: "Regular",
    [MeetingType.AD_HOC]: "Ad Hoc",
    [MeetingType.EMERGENCY]: "Emergency",
  };
  return typeMap[type] || type;
};

const formatAttendancePolicy = (policy: AttendancePolicy): string => {
  const policyMap: Record<AttendancePolicy, string> = {
    [AttendancePolicy.QUORUM_REQUIRED]: "Quorum Required",
    [AttendancePolicy.NO_QUORUM_REQUIRED]: "No Quorum Required",
  };
  return policyMap[policy] || policy;
};

const CommitteeMeetingDetails: React.FC<CommitteeMeetingDetailsProps> = ({
  meetingId,
}) => {
  const router = useRouter();
  const { data: meeting, isLoading } = useGetCommitteeMeetingQuery(meetingId);
  const { data: committeesData } = useGetAiCommitteesQuery({ per_page: 100 });
  const committees = committeesData?.data ?? [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee meeting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Committee meeting not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const committee = committees.find((c) => c.id === meeting.ai_committee_id);

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              {committee?.name || "Unknown Committee"} - Meeting Details
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              Committee Meeting Details
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/governance/committee-meetings/${meetingId}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/governance/committee-meetings")}
            >
              Back to List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              AI Committee
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {committee?.name || "Unknown"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Meeting Type
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatMeetingType(meeting.meeting_type)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Scheduled At
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(meeting.scheduled_at)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Duration
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {meeting.duration_minutes ? `${meeting.duration_minutes} minutes` : "-"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Attendance Policy
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatAttendancePolicy(meeting.attendance_policy)}
            </p>
          </div>

          {meeting.materials_link && (
            <div className="space-y-1">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Materials Link
              </p>
              <a
                href={meeting.materials_link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#4FD58F] hover:underline"
              >
                {meeting.materials_link}
              </a>
            </div>
          )}

          {meeting.minutes_link && (
            <div className="space-y-1">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Minutes Link
              </p>
              <a
                href={meeting.minutes_link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#4FD58F] hover:underline"
              >
                {meeting.minutes_link}
              </a>
            </div>
          )}

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Created At
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(meeting.created_at)}
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Agenda
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] whitespace-pre-wrap">
              {meeting.agenda}
            </p>
          </div>

          {meeting.attendance_roster && meeting.attendance_roster.length > 0 && (
            <div className="space-y-1 md:col-span-2">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Attendance Roster
              </p>
              <ul className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] list-disc list-inside">
                {meeting.attendance_roster.map((attendee, index) => (
                  <li key={index}>{attendee}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitteeMeetingDetails;

