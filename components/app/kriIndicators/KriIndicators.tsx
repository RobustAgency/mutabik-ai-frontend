"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/custom/DataTable";
import { useGetKriIndicatorsQuery } from "@/app/lib/features/kriIndicatorApi";
import { KriIndicator, KriStatus } from "@/interfaces/KriIndicator";
import { formatCategory } from "@/lib/helpers/ui";

export default function KriIndicatorsList() {
  const router = useRouter();
  const { data: indicators = [], isLoading } = useGetKriIndicatorsQuery();

  const getStatusBadge = (status: KriStatus) => {
    const config: Record<KriStatus, { color: string; label: string }> = {
      [KriStatus.DRAFT]: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      [KriStatus.ACTIVE]: { color: "bg-green-100 text-green-800", label: "Active" },
      [KriStatus.PAUSED]: { color: "bg-yellow-100 text-yellow-800", label: "Paused" },
      [KriStatus.RETIRED]: { color: "bg-red-100 text-red-800", label: "Retired" },
    };
    const { color, label } = config[status];
    return (
      <Badge variant="light" className={color}>
        {label}
      </Badge>
    );
  };

  const columns: ColumnDef<KriIndicator>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Name
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {row.original.name}
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
      accessorKey: "frequency",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Frequency
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatCategory(row.original.frequency)}
        </div>
      ),
    },
    {
      accessorKey: "directionality",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Directionality
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatCategory(row.original.directionality)}
        </div>
      ),
    },
    {
      accessorKey: "threshold_warning",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Warning
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.threshold_warning}
          {row.original.unit ? ` ${row.original.unit}` : ""}
        </div>
      ),
    },
    {
      accessorKey: "threshold_critical",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Critical
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.threshold_critical}
          {row.original.unit ? ` ${row.original.unit}` : ""}
        </div>
      ),
    },
    {
      accessorKey: "owner_team",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Owner Team
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.owner_team}
        </div>
      ),
    },
  ];

  const handleRowClick = (indicator: KriIndicator) => {
    router.push(`/governance/kri-indicators/${indicator.id}/details`);
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
          KRI Indicators
        </h2>
        <Button
          onClick={() => router.push("/governance/kri-indicators/create")}
          className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
        >
          Create KRI Indicator
        </Button>
      </div>
      <Card className="bg-white w-full rounded-xl border-0 py-0">
        <DataTable
          columns={columns}
          data={indicators}
          loading={isLoading}
          onRowClick={handleRowClick}
          emptyState={{
            title: "No KRI Indicators found",
            description: "Get started by creating your first KRI indicator",
            action: (
              <Button
                onClick={() => router.push("/governance/kri-indicators/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                Create KRI Indicator
              </Button>
            ),
          }}
        />
      </Card>
    </Card>
  );
}

