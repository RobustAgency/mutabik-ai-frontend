"use client";



import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetConsentCoveragesQuery, useDeleteConsentCoverageMutation, ConsentCoverage } from "@/app/lib/features/consentCoverageApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const ConsentCoveragePage: React.FC = () => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    coverageId: string | null;
    coverageName: string;
  }>({
    isOpen: false,
    coverageId: null,
    coverageName: "",
  });

  const [deleteCoverage, { isLoading: isDeleting }] = useDeleteConsentCoverageMutation();
  const { data: coverages, isLoading } = useGetConsentCoveragesQuery();

  const handleEditClick = (e: React.MouseEvent, coverage: ConsentCoverage) => {
    e.stopPropagation();
    router.push(`/privacy/consent/coverage/${coverage.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, coverage: ConsentCoverage) => {
    e.stopPropagation();
    const datasetName = coverage.dataset?.name || coverage.dataset_id;
    setDeleteDialogState({
      isOpen: true,
      coverageId: coverage.id,
      coverageName: `${coverage.purpose.join(', ')} - ${datasetName}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.coverageId) {
      try {
        await deleteCoverage(deleteDialogState.coverageId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          coverageId: null,
          coverageName: "",
        });
      } catch (error) {
        console.error("Failed to delete coverage:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        coverageId: null,
        coverageName: "",
      });
    }
  };

  const columns: ColumnDef<ConsentCoverage>[] = [
    {
      accessorKey: "dataset_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Dataset
        </div>
      ),
      cell: ({ row }) => {
        const datasetName = row.original.dataset?.name;
        const datasetId = row.original.dataset_id;
        return (
          <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
            {datasetName || datasetId}
          </div>
        );
      },
    },
    {
      accessorKey: "purpose",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Purpose
        </div>
      ),
      cell: ({ getValue }) => {
        const purposes = getValue() as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {purposes.map((purpose, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC]">
                {purpose}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "jurisdiction",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Jurisdiction
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "subjects_total",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Total Subjects
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {(getValue() as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "subjects_with_valid_consent",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          With Consent
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {(getValue() as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "coverage_pct",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Coverage %
        </div>
      ),
      cell: ({ getValue }) => {
        const pct = getValue() as number;
        const colorClass = pct >= 80 ? "text-[#039855]" : pct >= 50 ? "text-[#F79009]" : "text-[#F04438]";
        return (
          <div className={`font-sans font-semibold text-sm leading-5 tracking-normal ${colorClass}`}>
            {pct}%
          </div>
        );
      },
    },
    {
      accessorKey: "as_of",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          As Of
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {new Date(getValue() as string).toLocaleDateString()}
        </div>
      ),
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Consent Coverage</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Aggregated consent metrics for gate checks and compliance</p>
            </div>
            <Button
              onClick={() => router.push("/privacy/consent/coverage/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Coverage
            </Button>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={coverages ?? []}
              variant="projects"
              loading={isLoading}
              onRowClick={(coverage) => router.push(`/privacy/consent/coverage/${coverage.id}/details`)}
              emptyState={{
                title: "No consent coverage found",
                description: "Coverage metrics are computed from consent scopes and user consents",
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Consent Coverage"
        description={`Are you sure you want to delete coverage "${deleteDialogState.coverageName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ConsentCoveragePage;

