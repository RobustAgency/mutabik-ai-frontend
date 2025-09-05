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
                <div className="flex flex-col">
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
            accessorKey: 'is_approved',
            header: 'Status',
            cell: ({ row }) => {
                const isApproved = row.getValue('is_approved') as boolean;
                return (
                    <Badge
                        variant="light"
                        color={isApproved ? 'success' : 'error'}
                    >
                        {isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'email_verified_at',
            header: 'Email Verified',
            cell: ({ row }) => {
                const emailVerified = row.getValue('email_verified_at') as string | null;
                return (
                    <Badge
                        variant="light"
                        color={emailVerified ? 'success' : 'warning'}
                    >
                        {emailVerified ? 'Verified' : 'Unverified'}
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
                    <p className="text-gray-600 mt-1">Manage admin users and their permissions</p>
                </div>
                <AddAdminUserDialog onSubmit={createUser} loading={loading} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.is_approved).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => !user.is_approved).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>
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
