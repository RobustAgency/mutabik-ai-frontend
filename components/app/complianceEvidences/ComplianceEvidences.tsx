"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetComplianceEvidencesQuery,
  useDeleteComplianceEvidenceMutation,
} from "@/app/lib/features/complianceEvidenceApi";
import type {
  ComplianceEvidence,
  ComplianceEvidenceFilters,
  ComplianceEvidenceArtifactTypeEnum,
  ComplianceEvidenceReviewOutcomeEnum,
} from "@/interfaces/ComplianceEvidence";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ComplianceEvidences: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<ComplianceEvidenceFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    id: number | null;
    label: string;
  }>({
    isOpen: false,
    id: null,
    label: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetComplianceEvidencesQuery(queryParams);
  const [deleteEvidence, { isLoading: isDeleting }] =
    useDeleteComplianceEvidenceMutation();

  const evidences = data?.data ?? [];
  const pagination = data?.meta;

  const handleEditClick = (
    e: React.MouseEvent,
    item: ComplianceEvidence
  ) => {
    e.stopPropagation();
    router.push(`/compliance-evidences/${item.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    item: ComplianceEvidence
  ) => {
    e.stopPropagation();
    const label =
      item.control?.reference ||
      item.requirement?.reference ||
      item.artifact_uri ||
      `Evidence #${item.id}`;
    setDeleteDialogState({
      isOpen: true,
      id: item.id,
      label,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.id) {
      try {
        await deleteEvidence(deleteDialogState.id).unwrap();
        setDeleteDialogState({
          isOpen: false,
          id: null,
          label: "",
        });
      } catch (error) {
        console.error("Failed to delete compliance evidence:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        id: null,
        label: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<ComplianceEvidence>[] = [
    {
      accessorKey: "control.reference",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Control Reference
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
          {row.original.control?.reference || `Control #${row.original.control_id}`}
        </div>
      ),
    },
    {
      accessorKey: "requirement.reference",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Requirement Reference
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.requirement?.reference || row.original.requirement_id ? `Requirement #${row.original.requirement_id}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "artifact_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Artifact Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = (getValue() as ComplianceEvidenceArtifactTypeEnum) || "";
        const label = formatFieldValue(type);
        return (
          <div className="h-[24px] px-3 flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium capitalize">
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "review_outcome",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Review Outcome
        </div>
      ),
      cell: ({ getValue }) => {
        const outcome = getValue() as ComplianceEvidenceReviewOutcomeEnum | null;
        if (!outcome) {
          return (
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              N/A
            </div>
          );
        }
        const label = formatFieldValue(outcome);
        const colorClass =
          outcome === "pass"
            ? "bg-green-100 text-green-700"
            : outcome === "fail"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";
        return (
          <div
            className={`h-[24px] px-3 flex items-center justify-center rounded-full text-xs font-medium capitalize ${colorClass}`}
          >
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Last Updated
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
                Compliance Evidences
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage compliance evidence and artifacts
              </p>
            </div>
            {/* <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/compliance-evidences/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Evidence
              </Button>
            </div> */}
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={evidences}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/compliance-evidences/${row.id}/details`)
              }
              pagination={
                pagination
                  ? {
                      page: pagination.current_page,
                      limit: pagination.per_page,
                      total: pagination.total,
                      totalPages: pagination.last_page || 1,
                    }
                  : undefined
              }
              onPageChange={handlePageChange}
              emptyState={{
                title: "No compliance evidences found",
                description: "Get started by creating your first compliance evidence",
                action: (
                  <Button
                    onClick={() => router.push("/compliance-evidences/create")}
                  >
                    Create Evidence
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
        title="Delete Compliance Evidence"
        description={`Are you sure you want to delete "${deleteDialogState.label}"? This action cannot be undone and will remove the evidence from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ComplianceEvidences;

