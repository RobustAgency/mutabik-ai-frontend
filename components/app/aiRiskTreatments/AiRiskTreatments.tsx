"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/custom/DataTable";
import {
  useGetAiRiskTreatmentsQuery,
  useDeleteAiRiskTreatmentMutation,
} from "@/app/lib/features/aiRiskTreatmentApi";
import { AiRiskTreatment, TreatmentStatus, ResultVerification } from "@/interfaces/AiRiskTreatment";
import { formatDate } from "@/utils/formatDate";
import { formatCategory } from "@/lib/helpers/ui";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

export default function AiRiskTreatmentsList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data, isLoading } = useGetAiRiskTreatmentsQuery({ page: currentPage, per_page: 15 });
  const treatments = data?.data ?? [];
  const pagination = data?.pagination;
  const [deleteTreatment, { isLoading: isDeleting }] = useDeleteAiRiskTreatmentMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteTreatment(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "AI Risk Treatment",
  });

  const getStatusBadge = (status: TreatmentStatus) => {
    const config: Record<TreatmentStatus, { color: string; label: string }> = {
      [TreatmentStatus.NEW]: { color: "bg-blue-100 text-blue-800", label: "New" },
      [TreatmentStatus.IN_PROGRESS]: { color: "bg-yellow-100 text-yellow-800", label: "In Progress" },
      [TreatmentStatus.BLOCKED]: { color: "bg-red-100 text-red-800", label: "Blocked" },
      [TreatmentStatus.PENDING_VERIFICATION]: { color: "bg-purple-100 text-purple-800", label: "Pending Verification" },
      [TreatmentStatus.CLOSED]: { color: "bg-green-100 text-green-800", label: "Closed" },
      [TreatmentStatus.CANCELLED]: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };
    const { color, label } = config[status];
    return (
      <Badge variant="light" className={color}>
        {label}
      </Badge>
    );
  };

  const getVerificationBadge = (verification: ResultVerification | null) => {
    if (!verification) return <span className="text-[#667085]">-</span>;
    
    const config: Record<ResultVerification, { color: string; label: string }> = {
      [ResultVerification.PENDING]: { color: "bg-gray-100 text-gray-800", label: "Pending" },
      [ResultVerification.PASSED]: { color: "bg-green-100 text-green-800", label: "Passed" },
      [ResultVerification.FAILED]: { color: "bg-red-100 text-red-800", label: "Failed" },
      [ResultVerification.NOT_APPLICABLE]: { color: "bg-gray-100 text-gray-800", label: "N/A" },
    };
    const { color, label } = config[verification];
    return (
      <Badge variant="light" className={color}>
        {label}
      </Badge>
    );
  };

  const columns: ColumnDef<AiRiskTreatment>[] = [
    {
      accessorKey: "plan_summary",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Plan Summary
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {row.original.plan_summary}
        </div>
      ),
    },
    {
      accessorKey: "treatment_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatCategory(row.original.treatment_type)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "result_verification",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Verification
        </div>
      ),
      cell: ({ row }) => getVerificationBadge(row.original.result_verification),
    },
    {
      accessorKey: "due_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Due Date
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatDate(row.original.due_date)}
        </div>
      ),
    },
    {
      accessorKey: "expected_residual_level",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Expected Residual
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.expected_residual_level || "-"}
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
      cell: ({ row }) => (
        <div className="flex gap-2">
          <PermissionGate permission={PERMISSIONS.AI_RISK_TREATMENTS_EDIT}>
            <Button
              variant="outline"
              className="text-[#667085]"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/risk-compliance/ai-risk-management/treatment/${row.original.id}/edit`);
              }}
            >
              Edit
            </Button>
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.AI_RISK_TREATMENTS_DELETE}>
            <Button
              variant="outline"
              className="text-[#667085]"
              onClick={(e) => {
                e.stopPropagation();
                openDeleteDialog(String(row.original.id), row.original.plan_summary);
              }}
              disabled={isDeleting}
            >
              Remove
            </Button>
          </PermissionGate>
        </div>
      ),
    },
  ];

  const handleRowClick = (treatment: AiRiskTreatment) => {
    router.push(`/risk-compliance/ai-risk-management/treatment/${treatment.id}/details`);
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
          AI Risk Treatments
        </h2>
        <PermissionGate permission={PERMISSIONS.AI_RISK_TREATMENTS_CREATE}>
          <Button
            onClick={() => router.push("/risk-compliance/ai-risk-management/treatment/create")}
            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
          >
            Create Treatment Plan
          </Button>
        </PermissionGate>
      </div>
      <Card className="bg-white w-full rounded-xl border-0 py-0">
        <DataTable
          columns={columns}
          data={treatments}
          loading={isLoading}
          onRowClick={handleRowClick}
          serverSide={true}
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
          onPageChange={setCurrentPage}
          emptyState={{
            title: "No AI Risk Treatments found",
            description: "Get started by creating your first treatment plan",
            action: (
              <PermissionGate permission={PERMISSIONS.AI_RISK_TREATMENTS_CREATE}>
                <Button
                  onClick={() => router.push("/risk-compliance/ai-risk-management/treatment/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  Create Treatment Plan
                </Button>
              </PermissionGate>
            ),
          }}
        />
      </Card>
      <DeleteConfirmationDialog />
    </Card>
  );
}

