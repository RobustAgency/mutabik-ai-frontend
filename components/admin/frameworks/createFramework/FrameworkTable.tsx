"use client";
import React from 'react';
import Link from 'next/link';
import { DataTable } from '../../../custom/DataTable';
import TableCard from '../../../custom/TableCard';
import { SquarePen } from 'lucide-react';
import { useFrameworks } from '@/hooks/admin/useFrameworks';
import { Framework } from '@/interfaces/Framework';

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from 'next/navigation';

const columns: ColumnDef<Framework>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className='pl-4'>
        <div className="font-normal text-sm text-[#171717]">{row.original.name}</div>
      </div>
    ),
  },
  { accessorKey: 'version', header: 'Version' },
  {
    id: 'jurisdictions',
    accessorFn: (row) => (row as any).jurisdictions,
    header: 'Jurisdictions',
    cell: ({ row }) => {
      const value = (row.original as any).jurisdictions as string[] | undefined;
      return (
        <span className="text-sm text-[#525252]">
          {Array.isArray(value) ? value.join(', ') : '-'}
        </span>
      );
    },
  },
  { accessorKey: 'scope', header: 'Scope' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = (getValue() as string) || '';
      const isActive = status === 'active';
      const isRetired = status === 'retired';
      const badgeClass = isActive
        ? 'bg-[#F2FDF5] text-[#16A34A] border border-[#D3F3DF]'
        : isRetired
          ? 'bg-gray-100 text-gray-700 border border-gray-200'
          : 'bg-[#FFFBEB] text-[#C47E09] border border-[#FDECCE]';
      const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}>
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: 'effective_date',
    header: 'Effective Date',
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span className="text-sm text-[#525252]">{date ? new Date(date).toLocaleDateString() : '-'}</span>;
    },
  },
  {
    accessorKey: 'controls_count',
    header: 'Controls',
    cell: ({ getValue }) => <span className="text-sm text-[#171717]">{getValue() as number ?? 0}</span>,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return <span className="text-sm text-[#525252]">{date ? new Date(date).toLocaleDateString() : '-'}</span>;
    },
  },
  {
    id: 'edit',
    header: '',
    cell: ({ row }) => (
      <Link
        href={`/admin/compliance-library/frameworks/${row.original.id}`}
        className="text-[#4FD58F] flex items-center gap-1 text-sm font-semibold hover:underline"
      >
        <SquarePen width={14} height={14} /> Edit
      </Link>
    ),
    enableSorting: false,
  },
];

const FrameworkTable = () => {
  const router = useRouter();
  const {
    frameworks,
    loading,
    error,
    pagination,
    handlePageChange,
    handleSearch,
  } = useFrameworks({ page: 1, per_page: 10 });

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
        serverSide
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onRowClick={(row) => {
          router.push(`/admin/compliance-library/frameworks/${row.id}`);
        }}
      />
    </TableCard>
  );
};

export default FrameworkTable;
