"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { useRegulatorySubmissions, useRegulatorySubmissionMutations } from "@/hooks/admin/useRegulatorySubmissions";
import { RegulatorySubmission, RegulatorySubmissionFilters, RegulatorySubmissionStatusEnum, RegulatorySubmissionTypeEnum } from "@/interfaces/RegulatorySubmission";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useRouter } from "next/navigation";

export default function RegulatorySubmissionsList() {
  const router = useRouter();
  const [filters, setFilters] = useState<RegulatorySubmissionFilters>({
    page: 1,
    per_page: 10,
  });

  const { regulatorySubmissions, loading, error, pagination, handlePageChange, handleSearch, refresh } =
    useRegulatorySubmissions(filters);
  const { deleteRegulatorySubmission, deleting } = useRegulatorySubmissionMutations();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: deleteRegulatorySubmission,
    isDeleting: deleting,
    entityTypeName: "Regulatory Submission",
    onSuccess: () => refresh(),
  });

  const breadcrumbItems = [
    { label: "Compliance Library", href: "/admin/compliance-library/frameworks" },
    { label: "Regulatory Submissions", href: "/admin/compliance-library/regulatory-submissions" },
    { label: "List" },
  ];

  const handleSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      authority: searchTerm || undefined,
      page: 1,
    }));
    handleSearch(searchTerm || "");
  };

  const handlePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    handlePageChange(page);
  };

  const handleDelete = useCallback(
    (submission: RegulatorySubmission) => {
      const label = submission.tracking_id || submission.authority || `Submission #${submission.id}`;
      openDeleteDialog(submission.id, label);
    },
    [openDeleteDialog]
  );

  const columns: ColumnDef<RegulatorySubmission>[] = useMemo(
    () => [
      {
        accessorKey: "authority",
        header: "Authority",
        cell: ({ row }) => <span className="pl-4 font-medium text-gray-900">{row.getValue("authority")}</span>,
      },
      {
        accessorKey: "submission_type",
        header: "Submission Type",
        cell: ({ row }) => {
          const type = row.getValue("submission_type") as RegulatorySubmissionTypeEnum;
          return <Badge className="capitalize">{type.replace(/_/g, " ")}</Badge>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as RegulatorySubmissionStatusEnum;
          const colorMap: Record<RegulatorySubmissionStatusEnum, string> = {
            [RegulatorySubmissionStatusEnum.DRAFT]: "bg-gray-100 text-gray-800",
            [RegulatorySubmissionStatusEnum.SUBMITTED]: "bg-blue-100 text-blue-800",
            [RegulatorySubmissionStatusEnum.ACKNOWLEDGED]: "bg-purple-100 text-purple-800",
            [RegulatorySubmissionStatusEnum.APPROVED]: "bg-green-100 text-green-800",
            [RegulatorySubmissionStatusEnum.REJECTED]: "bg-red-100 text-red-800",
            [RegulatorySubmissionStatusEnum.CLOSED]: "bg-gray-200 text-gray-900",
          };
          return (
            <Badge className={`${colorMap[status]} capitalize`}>
              {status.replace(/_/g, " ")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "renewal_due_at",
        header: "Renewal Due",
        cell: ({ row }) => {
          const date = row.getValue("renewal_due_at") as string;
          return date ? new Date(date).toLocaleDateString() : "N/A";
        },
      },
      {
        accessorKey: "submitted_at",
        header: "Submitted At",
        cell: ({ row }) => {
          const date = row.getValue("submitted_at") as string;
          return date ? new Date(date).toLocaleDateString() : "N/A";
        },
      },
      {
        accessorKey: "updated_at",
        header: "Last Updated",
        cell: ({ row }) => {
          const date = new Date(row.getValue("updated_at"));
          return (
            <span className="text-gray-700">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link href={`/admin/compliance-library/regulatory-submissions/${submission.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                   onClick={(e) => e.stopPropagation()} 
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) =>{ 
                  e.stopPropagation();
                  handleDelete(submission)
                }}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [deleting, handleDelete]
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6">
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-6">
      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-3xl text-[#171717] font-bold">Regulatory Submissions</h1>
        <Link href="/admin/compliance-library/regulatory-submissions/create">
          <Button className="bg-primary text-white">Create Regulatory Submission</Button>
        </Link>
      </div>

      <Card className="shadow-none">
        <DataTable
          columns={columns}
          data={regulatorySubmissions}
          searchKey="authority"
          searchPlaceholder="Search by authority..."
          loading={loading}
          serverSide={true}
          pagination={pagination}
          onPageChange={handlePage}
          onSearch={handleSearchTerm}
          onRowClick={(row) => {
            router.push(`/admin/compliance-library/regulatory-submissions/${row.id}`);
          }}
        />
      </Card>
      <DeleteConfirmationDialog />
    </div>
  );
}

