"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetCommitteeMeetingsQuery,
  useDeleteCommitteeMeetingMutation,
} from "@/app/lib/features/committeeMeetingsApi";
import { useGetAiCommitteesQuery } from "@/app/lib/features/aiCommitteesApi";
import type {
  CommitteeMeeting,
  CommitteeMeetingFilters,
} from "@/interfaces/CommitteeMeeting";
import {
  MeetingType,
  AttendancePolicy,
} from "@/interfaces/CommitteeMeeting";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

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

const CommitteeMeetings: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<CommitteeMeetingFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    meetingId: number | null;
    meetingInfo: string;
  }>({
    isOpen: false,
    meetingId: null,
    meetingInfo: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetCommitteeMeetingsQuery(queryParams);
  const { data: committeesData } = useGetAiCommitteesQuery({ per_page: 100 });
  const committees = committeesData?.data ?? [];
  const [deleteMeeting, { isLoading: isDeleting }] =
    useDeleteCommitteeMeetingMutation();

  const meetings = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    meeting: CommitteeMeeting
  ) => {
    e.stopPropagation();
    router.push(`/governance/committee-meetings/${meeting.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    meeting: CommitteeMeeting
  ) => {
    e.stopPropagation();
    const committeeName =
      committees.find((c) => c.id === meeting.ai_committee_id)?.name ||
      "Unknown";
    setDeleteDialogState({
      isOpen: true,
      meetingId: meeting.id,
      meetingInfo: `${committeeName} - ${formatDate(meeting.scheduled_at)}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.meetingId) {
      try {
        await deleteMeeting(deleteDialogState.meetingId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          meetingId: null,
          meetingInfo: "",
        });
      } catch (error) {
        console.error("Failed to delete Committee Meeting:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        meetingId: null,
        meetingInfo: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<CommitteeMeeting>[] = [
    {
      accessorKey: "committee.name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Committee
        </div>
      ),
      cell: ({ row }) => {
        const meeting = row.original;
        const committee = committees.find((c) => c.id === meeting.ai_committee_id);
        return (
          <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
            {committee?.name || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "meeting_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatMeetingType(getValue() as MeetingType)}
        </div>
      ),
    },
    {
      accessorKey: "scheduled_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Scheduled At
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string | null;
        const formatted = formatDate(rawDate);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "duration_minutes",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Duration
        </div>
      ),
      cell: ({ getValue }) => {
        const duration = getValue() as number | null;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {duration ? `${duration} min` : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "attendance_policy",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Attendance Policy
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatAttendancePolicy(getValue() as AttendancePolicy)}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Created
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string | null;
        const formatted = formatDate(rawDate);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleEditClick(e, row.original)}
            >
              Edit
            </Button>
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleDeleteClick(e, row.original)}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                Committee Meetings
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage and track committee meetings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/governance/committee-meetings/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Meeting
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={meetings}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/governance/committee-meetings/${row.id}/details`)
              }
              pagination={
                pagination
                  ? {
                      page: pagination.current_page,
                      limit: pagination.per_page,
                      total: pagination.total,
                      totalPages: pagination.last_page,
                    }
                  : undefined
              }
              onPageChange={handlePageChange}
              emptyState={{
                title: "No committee meetings found",
                description: "Get started by creating your first committee meeting",
                action: (
                  <Button
                    onClick={() => router.push("/governance/committee-meetings/create")}
                  >
                    Create Meeting
                  </Button>
                ),
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Committee Meeting"
        description={`Are you sure you want to delete the meeting "${deleteDialogState.meetingInfo}"? This action cannot be undone and will remove the committee meeting from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default CommitteeMeetings;

