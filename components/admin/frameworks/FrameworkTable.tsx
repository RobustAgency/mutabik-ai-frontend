"use client";
import React from 'react';
import Link from 'next/link';
import { DataTable } from '../../custom/DataTable';
import TableCard from '../../custom/TableCard';
import { SquarePen } from 'lucide-react';
import { useFrameworks } from '@/hooks/admin/useFrameworks';
import { Framework } from '@/interfaces/Framework';

import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Framework>[] = [
  {
    accessorKey: 'name',
    header: 'Regulation',
    cell: ({ row }) => (
      <div className='pl-4'>
        <div className="font-normal text-sm text-[#171717]">{row.original.name}</div>
        <div className="text-xs text-[#757575]">Code: {row.original.code}</div>
      </div>
    ),
  },
  { accessorKey: 'geography', header: 'Geography' },
  { accessorKey: 'version', header: 'Version' },
  {
    accessorKey: 'is_published',
    header: 'Status',
    cell: ({ getValue }) => {
      const value = getValue() as boolean;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${value
            ? 'bg-[#F2FDF5] text-[#16A34A] border border-[#D3F3DF]'
            : 'bg-[#FFFBEB] text-[#C47E09] border border-[#FDECCE]'
            }`}
        >
          {value ? 'Published' : 'Draft'}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Last Updated',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  {
    id: 'edit',
    header: '',
    cell: ({ row }) => (
      <Link
        href={`/admin/frameworks/${row.original.id}`}
        className="text-[#4FD58F] flex items-center gap-1 text-sm font-semibold hover:underline"
      >
        <SquarePen width={14} height={14} /> Edit
      </Link>
    ),
    enableSorting: false,
  },
];

const FrameworkTable = () => {
  const { frameworks, loading, error } = useFrameworks();

  if (loading) {
    return (
      <TableCard title="">
        <div className="flex items-center justify-center p-8">
          <div className="text-[#737373]">Loading frameworks...</div>
        </div>
      </TableCard>
    );
  }

  if (error) {
    return (
      <TableCard title="">
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </TableCard>
    );
  }

  return (
    <TableCard title="" >
      <DataTable
        columns={columns}
        data={frameworks}
        searchKey="name"
        searchPlaceholder="Search frameworks"
      />
    </TableCard>
  );
};

export default FrameworkTable;
