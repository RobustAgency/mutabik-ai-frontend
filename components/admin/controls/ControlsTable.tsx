"use client";
import React from "react";
import { DataTable } from "../../custom/DataTable";
import TableCard from "../../custom/TableCard";
import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";

// Define the data type for rows
interface Control {
  "control-code": string;
  title: string;
  requirements: string;
  frameworks: string;
  "last-updated": string;
}

// Columns styled as per image
const columns: ColumnDef<Control>[] = [
  {
    accessorKey: "control-code",
    header: "Control Code",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("control-code")}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "requirements",
    header: "Requirements",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("requirements")}
      </span>
    ),
  },
  {
    accessorKey: "frameworks",
    header: "Frameworks",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("frameworks")}
      </span>
    ),
  },
  {
    accessorKey: "last-updated",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("last-updated")}
      </span>
    ),
  },
  {
    id: "edit",
    header: "",
    cell: () => (
      <span className="text-[#4FD58F] cursor-pointer flex items-center gap-1 text-sm font-semibold hover:underline">
        <SquarePen width={14} height={14} /> Edit
      </span>
    ),
    enableSorting: false,
  },
];

// Dummy data
const controls: Control[] = [
  {
    "control-code": "C-001",
    title: "Control A",
    requirements: "Requirement 1",
    frameworks: "Framework A",
    "last-updated": "2025-09-10",
  },
  {
    "control-code": "C-002",
    title: "Control B",
    requirements: "Requirement 2",
    frameworks: "Framework B",
    "last-updated": "2025-09-09",
  },
  {
    "control-code": "C-003",
    title: "Control C",
    requirements: "Requirement 3",
    frameworks: "Framework C",
    "last-updated": "2025-09-08",
  },
];

const ControlsTable = () => {
  const loading = false;
  const error: string | null = null;

  if (loading) {
    return (
      <TableCard title="Controls List">
        <div className="flex items-center justify-center p-8 text-[#737373]">
          Loading controls...
        </div>
      </TableCard>
    );
  }

  if (error) {
    return (
      <TableCard title="Controls List">
        <div className="">
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
        searchKey="title" // ✅ fixed (your data has "title", not "name")
        searchPlaceholder="Search controls"
        showRowSelector={true}
      />
    </TableCard>
  );
};

export default ControlsTable;
