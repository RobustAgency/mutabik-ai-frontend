"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import TableCard from "@/components/custom/TableCard";
import { useRequirementControls } from "@/hooks/admin/useRequirementControls";
import { RequirementControl, RequirementControlFilters } from "@/interfaces/RequirementControl";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  RequirementControlCoverageEnum,
  RequirementControlReviewStatusEnum,
} from "@/interfaces/RequirementControl";

export default function RequirementControlsList() {
  const router = useRouter();
  const [filters, setFilters] = useState<RequirementControlFilters>({
    page: 1,
    per_page: 10,
  });

  const {
    requirementControls,
    loading,
    error,
    pagination,
    handlePageChange,
    handleSearch,
  } = useRequirementControls(filters);

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

  const columns: ColumnDef<RequirementControl>[] = useMemo(
    () => [
      {
        accessorKey: "requirement",
        header: "Requirement",
        cell: ({ row }) => (
          <span className="pl-4 font-medium text-gray-900">
            {row.original.requirement?.reference || `Requirement #${row.original.requirement_id}`}
          </span>
        ),
      },
      {
        accessorKey: "control",
        header: "Control",
        cell: ({ row }) => (
          <span className="text-gray-900">
            {row.original.control?.reference || `Control #${row.original.control_id}`}
          </span>
        ),
      },
      {
        accessorKey: "coverage",
        header: "Coverage",
        cell: ({ row }) => {
          const coverage = row.getValue("coverage") as RequirementControlCoverageEnum;
          const coverageMap: Record<RequirementControlCoverageEnum, { bg: string; text: string }> = {
            [RequirementControlCoverageEnum.FULL]: {
              bg: "bg-green-100",
              text: "text-green-800",
            },
            [RequirementControlCoverageEnum.PARTIAL]: {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
            },
            [RequirementControlCoverageEnum.NOT_APPLICABLE]: {
              bg: "bg-gray-100",
              text: "text-gray-800",
            },
          };
          const { bg, text } = coverageMap[coverage] || { bg: "bg-gray-100", text: "text-gray-800" };
          return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${bg} ${text}`}>
              {coverage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          );
        },
      },
      {
        accessorKey: "review_status",
        header: "Review Status",
        cell: ({ row }) => {
          const status = row.getValue("review_status") as RequirementControlReviewStatusEnum | null;
          if (!status) return <span className="text-gray-500">-</span>;
          const statusMap: Record<RequirementControlReviewStatusEnum, { bg: string; text: string }> = {
            [RequirementControlReviewStatusEnum.DRAFT]: {
              bg: "bg-gray-100",
              text: "text-gray-800",
            },
            [RequirementControlReviewStatusEnum.PEER_REVIEWED]: {
              bg: "bg-blue-100",
              text: "text-blue-800",
            },
            [RequirementControlReviewStatusEnum.APPROVED]: {
              bg: "bg-green-100",
              text: "text-green-800",
            },
          };
          const { bg, text } = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800" };
          return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${bg} ${text}`}>
              {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          );
        },
      },
      {
        accessorKey: "reviewed_at",
        header: "Reviewed At",
        cell: ({ row }) => {
          const date = row.getValue("reviewed_at") as string | null;
          return date ? new Date(date).toLocaleDateString() : <span className="text-gray-500">-</span>;
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
          const requirementControl = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link href={`/admin/compliance-library/requirement-controls/${requirementControl.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  if (error) {
    return (
      <TableCard title="Requirement Controls List">
        <div className="flex items-center justify-center p-8 text-red-600">
          Error: {error}
        </div>
      </TableCard>
    );
  }

  return (
    <TableCard title="">
      <DataTable
        columns={columns}
        data={requirementControls}
        searchKey="search"
        searchPlaceholder="Search requirement controls"
        loading={loading}
        serverSide={true}
        pagination={pagination}
        onPageChange={handlePage}
        onSearch={handleSearchTerm}
        onRowClick={(row) => {
          router.push(`/admin/compliance-library/requirement-controls/${row.id}`);
        }}
      />
    </TableCard>
  );
}

