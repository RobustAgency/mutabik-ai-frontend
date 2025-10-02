"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface UseCase {
  id: string;
  name: string;
  riskLevel: string;
  businessDomain: string;
  dataSensitivity: string;
  targetDate: string;
  status: string;
}

const UseCases: React.FC = () => {
  const router = useRouter();
  const data: UseCase[] = [
    {
      id: "UC-20240223-44",
      name: "Retail Credit Risk Scoring",
      riskLevel: "High",
      businessDomain: "Risk Management",
      dataSensitivity: "Risk Confidential",
      targetDate: "2025-10-15",
      status: "Active",
    },
  ];

  const columns: ColumnDef<UseCase>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          ID
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
      accessorKey: "riskLevel",
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
      accessorKey: "businessDomain",
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
      accessorKey: "dataSensitivity",
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
      accessorKey: "targetDate",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Target Go Live Date
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="w-[60px] h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium">
          {getValue() as string}
        </div>
      ),
    },
  ];

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Use cases</h2>
          <Button
            onClick={() => router.push("/projects/setup/use-cases/create")}
            className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
          >
            New use case
          </Button>
        </div>
        <Card className="bg-white w-full rounded-xl border-0 py-0">
          <DataTable columns={columns} data={data} variant="projects" />
        </Card>
      </CardContent>
    </Card>
  );
};

export default UseCases;

