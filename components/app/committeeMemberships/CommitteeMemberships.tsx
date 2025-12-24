"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetCommitteeMembershipsQuery,
  useDeleteCommitteeMembershipMutation,
} from "@/app/lib/features/committeeMembershipsApi";
import type {
  CommitteeMembership,
  CommitteeMembershipFilters,
} from "@/interfaces/CommitteeMembership";
import {
  CommitteeMembershipMemberRole,
  CommitteeMembershipEligibility,
} from "@/interfaces/CommitteeMembership";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

const formatMemberRole = (role: CommitteeMembershipMemberRole): string => {
  const roleMap: Record<CommitteeMembershipMemberRole, string> = {
    [CommitteeMembershipMemberRole.CHAIR]: "Chair",
    [CommitteeMembershipMemberRole.VOTING_MEMBER]: "Voting Member",
    [CommitteeMembershipMemberRole.ADVISOR]: "Advisor",
    [CommitteeMembershipMemberRole.SECRETARY]: "Secretary",
    [CommitteeMembershipMemberRole.OBSERVER]: "Observer",
  };
  return roleMap[role] || role;
};

const formatEligibility = (eligibility: CommitteeMembershipEligibility): string => {
  const eligibilityMap: Record<CommitteeMembershipEligibility, string> = {
    [CommitteeMembershipEligibility.ACTIVE]: "Active",
    [CommitteeMembershipEligibility.SUSPENDED]: "Suspended",
    [CommitteeMembershipEligibility.TERM_ENDED]: "Term Ended",
  };
  return eligibilityMap[eligibility] || eligibility;
};

const CommitteeMemberships: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<CommitteeMembershipFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    membershipId: number | null;
    membershipInfo: string;
  }>({
    isOpen: false,
    membershipId: null,
    membershipInfo: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetCommitteeMembershipsQuery(queryParams);
  const [deleteMembership, { isLoading: isDeleting }] =
    useDeleteCommitteeMembershipMutation();

  const memberships = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    membership: CommitteeMembership
  ) => {
    e.stopPropagation();
    router.push(`/governance/committee-memberships/${membership.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    membership: CommitteeMembership
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      membershipId: membership.id,
      membershipInfo: `Membership #${membership.id}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.membershipId) {
      try {
        await deleteMembership(deleteDialogState.membershipId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          membershipId: null,
          membershipInfo: "",
        });
      } catch (error) {
        console.error("Failed to delete committee membership:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        membershipId: null,
        membershipInfo: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<CommitteeMembership>[] = [
    {
      accessorKey: "ai_committee_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Committee
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          Committee #{getValue() as number}
        </div>
      ),
    },
    {
      accessorKey: "stakeholder_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Stakeholder
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          Stakeholder #{getValue() as number}
        </div>
      ),
    },
    {
      accessorKey: "member_role",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Role
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatMemberRole(getValue() as CommitteeMembershipMemberRole)}
        </div>
      ),
    },
    {
      accessorKey: "eligibility",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Eligibility
        </div>
      ),
      cell: ({ getValue }) => {
        const eligibility = getValue() as CommitteeMembershipEligibility;
        const eligibilityColors: Record<CommitteeMembershipEligibility, string> = {
          [CommitteeMembershipEligibility.ACTIVE]: "bg-[#ECFDF3] text-[#047857]",
          [CommitteeMembershipEligibility.SUSPENDED]: "bg-[#FEF3C7] text-[#D97706]",
          [CommitteeMembershipEligibility.TERM_ENDED]: "bg-[#F2F4F7] text-[#667085]",
        };
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              eligibilityColors[eligibility] || "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {formatEligibility(eligibility)}
          </div>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Start Date
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
      accessorKey: "end_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          End Date
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string | null;
        const formatted = formatDate(rawDate);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted || "N/A"}
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
                Committee Memberships
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage committee memberships and roles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/governance/committee-memberships/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Membership
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={memberships}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/governance/committee-memberships/${row.id}/details`)
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
                title: "No committee memberships found",
                description: "Get started by creating your first committee membership",
                action: (
                  <Button
                    onClick={() => router.push("/governance/committee-memberships/create")}
                  >
                    Create Membership
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
        title="Delete Committee Membership"
        description={`Are you sure you want to delete ${deleteDialogState.membershipInfo}? This action cannot be undone and will remove the committee membership from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default CommitteeMemberships;

