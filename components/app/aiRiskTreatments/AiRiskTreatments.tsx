"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/custom/DataTable";
import { useGetAiRiskTreatmentsQuery } from "@/app/lib/features/aiRiskTreatmentApi";
import { AiRiskTreatment, TreatmentStatus, ResultVerification } from "@/interfaces/AiRiskTreatment";
import { formatDate } from "@/utils/formatDate";
import { formatCategory } from "@/lib/helpers/ui";

export default function AiRiskTreatmentsList() {
  const router = useRouter();
  const { data: treatments = [], isLoading } = useGetAiRiskTreatmentsQuery();

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
        <Button
          onClick={() => router.push("/risk-compliance/ai-risk-management/treatment/create")}
          className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
        >
          Create Treatment Plan
        </Button>
      </div>
      <Card className="bg-white w-full rounded-xl border-0 py-0">
        <DataTable
          columns={columns}
          data={treatments}
          loading={isLoading}
          onRowClick={handleRowClick}
          emptyState={{
            title: "No AI Risk Treatments found",
            description: "Get started by creating your first treatment plan",
            action: (
              <Button
                onClick={() => router.push("/risk-compliance/ai-risk-management/treatment/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                Create Treatment Plan
              </Button>
            ),
          }}
        />
      </Card>
    </Card>
  );
}

