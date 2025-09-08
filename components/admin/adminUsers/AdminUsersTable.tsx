"use client";
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/DataTable';
import { User } from '@/interfaces/User';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatDate';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import AddAdminUserDialog from './AddAdminUserDialog';
import TableCard from '@/components/custom/TableCard';
import { Users, CheckCircle, Clock, Shield } from 'lucide-react';

const AdminUsersTable: React.FC = () => {
    const {
        users,
        pagination,
        loading,
        createUser,
        handlePageChange,
        handleSearch
    } = useAdminUsers();

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="pl-4 flex flex-col">
                    <span className="font-medium text-gray-900">{row.getValue('name')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <span className="text-gray-600">{row.getValue('email')}</span>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                return (
                    <Badge
                        variant="light"
                        color={role === 'admin' ? 'info' : 'default'}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => {
                const date = row.getValue('created_at') as string;
                return (
                    <span className="text-gray-600">
                        {formatDate(date)}
                    </span>
                );
            },
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
                    <p className="text-gray-600 mt-1">Manage admin users and their permissions</p>
                </div>
                <AddAdminUserDialog onSubmit={createUser} loading={loading} />
            </div>
            <TableCard
                title="Admin Users">
                <DataTable
                    columns={columns}
                    data={users}
                    searchKey="name"
                    searchPlaceholder="Search users..."
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    loading={loading}
                    serverSide={true}
                />
            </TableCard>

        </div>
    );
};

export default AdminUsersTable;
