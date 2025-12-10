"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import { useComplianceEvidences, useComplianceEvidenceMutations } from "@/hooks/admin/useComplianceEvidence";
import { ComplianceEvidence, ComplianceEvidenceFilters } from "@/interfaces/ComplianceEvidence";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import {
  ComplianceEvidenceArtifactTypeEnum,
  ComplianceEvidenceReviewOutcomeEnum,
} from "@/interfaces/ComplianceEvidence";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ComplianceEvidenceList() {
  const [filters, setFilters] = useState<ComplianceEvidenceFilters>({
    page: 1,
    per_page: 10,
  });

  const { complianceEvidences, loading, error, pagination, handlePageChange, handleSearch } =
    useComplianceEvidences(filters);
  const { deleteComplianceEvidence, deleting } = useComplianceEvidenceMutations();

  const breadcrumbItems = [
    { label: "Compliance Library", href: "/admin/compliance-library/frameworks" },
    { label: "Compliance Evidence", href: "/admin/compliance-library/compliance-evidences" },
    { label: "List" },
  ];

  const handleSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
    handleSearch(searchTerm || "");
  };

  const handlePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    handlePageChange(page);
  };

  const handleDelete = useCallback(async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this compliance evidence?")) {
      try {
        await deleteComplianceEvidence(id);
      } catch {
        // Error handled by toast in hook
      }
    }
  }, [deleteComplianceEvidence]);

  const columns: ColumnDef<ComplianceEvidence>[] = useMemo(
    () => [
      {
        accessorKey: "control.reference",
        header: "Control Reference",
        cell: ({ row }) => (
          <span className="pl-4 font-medium text-gray-900">
            {row.original.control?.reference || `Control #${row.original.control_id}`}
          </span>
        ),
      },
      {
        accessorKey: "requirement.reference",
        header: "Requirement Reference",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            {row.original.requirement?.reference || row.original.requirement_id ? `Requirement #${row.original.requirement_id}` : "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "artifact_type",
        header: "Artifact Type",
        cell: ({ row }) => {
          const artifactType = row.getValue("artifact_type") as ComplianceEvidenceArtifactTypeEnum;
          return (
            <Badge className="capitalize">
              {artifactType.replace(/_/g, " ")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "artifact_uri",
        header: "Artifact URI",
        cell: ({ row }) => {
          const uri = row.getValue("artifact_uri") as string;
          return (
            <a
              href={uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate max-w-xs block"
            >
              {uri}
            </a>
          );
        },
      },
      {
        accessorKey: "review_outcome",
        header: "Review Outcome",
        cell: ({ row }) => {
          const outcome = row.getValue("review_outcome") as ComplianceEvidenceReviewOutcomeEnum | null;
          if (!outcome) return <span className="text-gray-500">N/A</span>;
          const colorMap: Record<ComplianceEvidenceReviewOutcomeEnum, string> = {
            [ComplianceEvidenceReviewOutcomeEnum.PASS]: "bg-green-100 text-green-800",
            [ComplianceEvidenceReviewOutcomeEnum.FAIL]: "bg-red-100 text-red-800",
            [ComplianceEvidenceReviewOutcomeEnum.NEEDS_FIX]: "bg-yellow-100 text-yellow-800",
          };
          return (
            <Badge className={`${colorMap[outcome]} capitalize`}>
              {outcome.replace(/_/g, " ")}
            </Badge>
          );
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
          const ce = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link href={`/admin/compliance-library/compliance-evidences/${ce.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(ce.id)}
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
        <Breadcrumbs items={breadcrumbItems} />
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
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-3xl text-[#171717] font-bold">Compliance Evidence</h1>
        <Link href="/admin/compliance-library/compliance-evidences/create">
          <Button className="bg-primary text-white">Create Compliance Evidence</Button>
        </Link>
      </div>

      <Card className="shadow-none">
        <DataTable
          columns={columns}
          data={complianceEvidences}
          searchKey="search"
          searchPlaceholder="Search compliance evidence..."
          loading={loading}
          serverSide={true}
          pagination={pagination}
          onPageChange={handlePage}
          onSearch={handleSearchTerm}
        />
      </Card>
    </div>
  );
}

