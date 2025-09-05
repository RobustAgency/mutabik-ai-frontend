"use client";
import React from 'react';
import { DataTable } from '../../custom/DataTable';
import TableCard from '../../custom/TableCard';
import { SquarePen } from 'lucide-react';

const frameworks = [
  {
    regulation: 'EU AI Act',
    code: 'MF-3',
    geography: 'EU',
    version: '2024.1',
    status: 'Published',
    requirements: 68,
    controls: 12,
    lastUpdated: '2025-08-05',
    editUrl: '#',
  },
  {
    regulation: 'NIST AI RMF 1.0',
    code: 'MF-1',
    geography: 'US',
    version: '1.0',
    status: 'Draft',
    requirements: 72,
    controls: 44,
    lastUpdated: '2025-08-01',
    editUrl: '#',
  },
  {
    regulation: 'ISO/IEC 42001',
    code: 'MF-5',
    geography: 'Global',
    version: '2024',
    status: 'Published',
    requirements: 42,
    controls: 38,
    lastUpdated: '2024-03-01',
    editUrl: '#',
  },
];

interface Framework {
  regulation: string;
  code: string;
  geography: string;
  version: string;
  status: string;
  requirements: number;
  controls: number;
  lastUpdated: string;
  editUrl: string;
}

import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Framework>[] = [
  {
    accessorKey: 'regulation',
    header: 'Regulation',
    cell: ({ row }) => (
      <div>
        <div className="font-normal text-sm text-[#171717]">{row.original.regulation}</div>
        <div className="text-xs text-[#757575]">Code: {row.original.code}</div>
      </div>
    ),
  },
  { accessorKey: 'geography', header: 'Geography' },
  { accessorKey: 'version', header: 'Version' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${value === 'Published'
              ? 'bg-[#F2FDF5] text-[#16A34A] border border-[#D3F3DF]'
              : 'bg-[#FFFBEB] text-[#C47E09] border border-[#FDECCE]'
            }`}
        >
          {value}
        </span>
      );
    },
  },
  { accessorKey: 'requirements', header: 'Requirements' },
  { accessorKey: 'controls', header: 'Controls' },
  { accessorKey: 'lastUpdated', header: 'Last Updated' },
  {
    id: 'edit',
    header: '',
    cell: ({ row }) => (
      <a
        href={row.original.editUrl}
        className="text-[#4FD58F] flex items-center gap-1 text-sm font-semibold"
      >
        <SquarePen width={14} height={14} /> Edit
      </a>
    ),
    enableSorting: false,
  },
];

const FrameworkTable = () => {
  return (
    <TableCard title="" >
      <DataTable
        columns={columns}
        data={frameworks}
        searchKey="regulation"
        searchPlaceholder="Search"

      />

    </TableCard>
  );
};

export default FrameworkTable;
