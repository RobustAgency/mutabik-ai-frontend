"use client";
import React from "react";
import Link from "next/link";
import { DataTable } from "../../custom/DataTable";
import TableCard from "../../custom/TableCard";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { useControls } from "@/hooks/admin/useControls";
import { Control } from "@/interfaces/Control";
import { Button } from "@/components/ui/button";

// Columns styled as per image
const columns: ColumnDef<Control>[] = [
  {
    accessorKey: "code",
    header: "Control Code",
    cell: ({ row }) => {
      const control = row.original;
      return (
        <Link href={`/admin/compliance-library/controls/details/${control.id}`} className="pl-4 hover:underline">
          {row.getValue("code")}
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "requirements_count",
    header: "Requirements",
    cell: ({ row }) => {
      return (
        <span className="">
          {row.getValue("requirements_count")}
        </span>
      );
    },
  },
  {
    accessorKey: "frameworks_count",
    header: "Frameworks",
    cell: ({ row }) => {
      return (
        <span className="">
          {row.getValue("frameworks_count")}
        </span>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at"));
      return (
        <span className="">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const control = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/compliance-library/controls/edit/${control.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <SquarePen width={14} height={14} className="mr-1" />
              Edit
            </Button>
          </Link>
        </div>
      );
    },
    enableSorting: false,
  },
];

const ControlsTable = () => {
  const {
    controls,
    loading,
    error,
    pagination,
    handlePageChange,
    handleSearch
  } = useControls({ page: 1, per_page: 10 });

  if (error) {
    return (
      <TableCard title="Controls List">
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
        data={controls}
        searchKey="name"
        searchPlaceholder="Search controls"
        loading={loading}
        serverSide={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </TableCard>
  );
};

export default ControlsTable;
