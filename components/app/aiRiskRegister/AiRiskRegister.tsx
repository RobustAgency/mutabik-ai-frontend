"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/custom/DataTable";
import { useGetAiRiskRegistersQuery, useDeleteAiRiskRegisterMutation } from "@/app/lib/features/aiRiskRegisterApi";
import { AiRiskRegister, RiskLevel, RiskStatus } from "@/interfaces/AiRiskRegister";
import { formatDate } from "@/utils/formatDate";
import { formatRiskCategory, formatRiskDecision } from "@/utils/riskUtils";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";

export default function AiRiskRegisterList() {
  const router = useRouter();
  const { data, isLoading } = useGetAiRiskRegistersQuery();
  const registers = data?.data || [];
  const [deleteRisk, { isLoading: isDeleting }] = useDeleteAiRiskRegisterMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteRisk(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "AI Risk",
    onSuccess: () => {
      // Data will be refetched automatically via RTK Query cache invalidation
    },
  });

  const getRiskLevelBadge = (level: RiskLevel) => {
    const config: Record<RiskLevel, { color: string; label: string }> = {
      [RiskLevel.LOW]: { color: "bg-green-100 text-green-800", label: "Low" },
      [RiskLevel.MEDIUM]: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      [RiskLevel.HIGH]: { color: "bg-orange-100 text-orange-800", label: "High" },
      [RiskLevel.CRITICAL]: { color: "bg-red-100 text-red-800", label: "Critical" },
    };
    const { color, label } = config[level];
    return (
      <Badge variant="light" className={color}>
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: RiskStatus) => {
    const config: Record<RiskStatus, { color: string; label: string }> = {
      [RiskStatus.IDENTIFIED]: { color: "bg-blue-100 text-blue-800", label: "Identified" },
      [RiskStatus.ASSESSED]: { color: "bg-purple-100 text-purple-800", label: "Assessed" },
      [RiskStatus.IN_TREATMENT]: { color: "bg-yellow-100 text-yellow-800", label: "In Treatment" },
      [RiskStatus.ACCEPTED]: { color: "bg-gray-100 text-gray-800", label: "Accepted" },
      [RiskStatus.TRANSFERRED]: { color: "bg-indigo-100 text-indigo-800", label: "Transferred" },
      [RiskStatus.CLOSED]: { color: "bg-green-100 text-green-800", label: "Closed" },
    };
    const { color, label } = config[status];
    return (
      <Badge variant="light" className={color}>
        {label}
      </Badge>
    );
  };

  const columns: ColumnDef<AiRiskRegister>[] = [
    {
      accessorKey: "title",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Title
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "risk_category",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Category
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatRiskCategory(row.original.risk_category)}
        </div>
      ),
    },
    {
      accessorKey: "risk_level",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Risk Level
        </div>
      ),
      cell: ({ row }) => getRiskLevelBadge(row.original.risk_level),
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
      accessorKey: "next_review_due",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Next Review
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatDate(row.original.next_review_due)}
        </div>
      ),
    },
    {
      accessorKey: "decision",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Decision
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatRiskDecision(row.original.decision)}
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
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/risk-compliance/ai-risk-management/register/${row.original.id}/edit`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteDialog(String(row.original.id), row.original.title);
            }}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (register: AiRiskRegister) => {
    router.push(`/risk-compliance/ai-risk-management/register/${register.id}/details`);
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
          AI Risk Register
        </h2>
        <Button
          onClick={() => router.push("/risk-compliance/ai-risk-management/register/create")}
          className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
        >
          Register New Risk
        </Button>
      </div>
      <Card className="bg-white w-full rounded-xl border-0 py-0">
        <DataTable
          columns={columns}
          data={registers}
          loading={isLoading}
          onRowClick={handleRowClick}
          emptyState={{
            title: "No AI Risks found",
            description: "Get started by registering your first AI risk",
            action: (
              <Button
                onClick={() => router.push("/risk-compliance/ai-risk-management/register/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                Register New Risk
              </Button>
            ),
          }}
        />
      </Card>
      <DeleteConfirmationDialog />
    </Card>
  );
}

