"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useUseCases } from '@/hooks/app/useUseCases';
import { UseCase } from "@/service/app/useCases";
import { formatDateShort } from "@/lib/helpers/date";
import { UseCaseFilters } from "@/app/lib/features/useCasesApi";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

// Date formatter (e.g., "Oct 06, 2025")
const formatDate = (dateString: string | null | undefined): string => formatDateShort(dateString);

const UseCases: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState<UseCaseFilters>({});
  const { useCases, loading } = useUseCases(filters);

  const columns: ColumnDef<UseCase>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Use Case ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">Name</div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
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
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085] ">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "business_domain",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Business Domain
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "data_sensitivity",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Sensitivity
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "target_go_live_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Target Go Live Date
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string;
        const formatted = formatDate(rawDate);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium">
          {getValue() as string}
        </div>
      ),
    },
  ];

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters as UseCaseFilters);
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Use cases</h2>
          <div className="flex items-center gap-3">
            <DynamicFilter
              filterType="use-cases"
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
            <Button
              onClick={() => router.push("/core-assets/ai-use-cases/create")}
              className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New use case
            </Button>
          </div>
        </div>
        <Card className="bg-white w-full rounded-xl border-0 py-0">
          <DataTable
            columns={columns}
            data={useCases ?? []}
            variant="projects"
            loading={loading}
            onRowClick={(row) => router.push(`/core-assets/ai-use-cases/${row.id}/details`)}
            emptyState={{
              title: "No use cases found",
              description: "Get started by creating your first use case",
              action: (
                <Button onClick={() => router.push("/core-assets/ai-use-cases/create")}>
                  Create Use Case
                </Button>
              )
            }}
          />
        </Card>
      </CardContent>
    </Card>
  );
};

export default UseCases;
