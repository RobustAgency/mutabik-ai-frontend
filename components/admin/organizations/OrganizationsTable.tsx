"use client";
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/DataTable';
import { Organization } from '@/interfaces/Organization';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatDate';
import { useOrganizations } from '@/hooks/admin/useOrganizations';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';

const OrganizationsTable: React.FC = () => {
    const router = useRouter();
    const {
        organizations,
        pagination,
        loading,
        handlePageChange,
        handleSearch,
        updateOrganization
    } = useOrganizations();

    const handleToggleActive = async (organizationId: number, currentStatus: boolean) => {
        if (!organizationId || typeof organizationId !== 'number') {
            console.error('Invalid organization ID for toggle:', organizationId);
            return;
        }
        await updateOrganization(organizationId, { is_active: !currentStatus });
    };

    const handleViewDetails = (organizationId: number) => {
        if (!organizationId || typeof organizationId !== 'number') {
            console.error('Invalid organization ID for details:', organizationId);
            return;
        }
        router.push(`/admin/users-administration/customers/${organizationId}`);
    };

    const safeOrganizations = Array.isArray(organizations) ? organizations : [];
    const safePagination = pagination ? {
        page: typeof pagination.page === 'number' && !isNaN(pagination.page) ? pagination.page : 1,
        limit: typeof pagination.limit === 'number' && !isNaN(pagination.limit) ? pagination.limit : 10,
        total: typeof pagination.total === 'number' && !isNaN(pagination.total) ? pagination.total : 0,
        totalPages: typeof pagination.totalPages === 'number' && !isNaN(pagination.totalPages) ? pagination.totalPages : 1
    } : {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    };

    const columns: ColumnDef<Organization>[] = [
        {
            accessorKey: 'name',
            header: 'Organization',
            cell: ({ row }) => {
                const name = row.getValue('name') as string || 'Unknown Organization';
                const website = row.original?.website;
                return (
                    <div className="pl-4 flex flex-col">
                        <span className="font-medium text-gray-900">{name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'country',
            header: 'Country',
            cell: ({ row }) => {
                const country = row.getValue('country') as string || '-';
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-900 capitalize">{country}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: '',
            header: 'Contact',
            cell: ({ row }) => {
                const phone = row.original?.phone;
                return (
                    phone ? (
                        <span className="text-sm text-gray-500">{phone}</span>
                    ) : "-"
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active') as boolean;
                return (
                    <Badge
                        variant="light"
                        color={isActive ? 'success' : 'error'}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'website',
            header: 'Website',
            cell: ({ row }) => {
                const website = row.getValue('website') as string;
                if (!website) {
                    return <span className="text-gray-400">-</span>;
                }

                // Ensure the URL has a protocol
                const url = website.startsWith('http://') || website.startsWith('https://')
                    ? website
                    : `https://${website}`;

                return (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {website}
                    </a>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created at',
            cell: ({ row }) => {
                const date = row.getValue('created_at') as string;
                if (date) {
                    try {
                        return (
                            <span className="text-gray-600">
                                {formatDate(date)}
                            </span>
                        );
                    } catch (error) {
                        console.error('Error formatting date:', error);
                        return <span className="text-gray-400">-</span>;
                    }
                }
                return <span className="text-gray-400">-</span>;
            },
        },
        {
            id: 'edit',
            header: '',
            cell: ({ row }) => (
                <Link
                    href={`/admin/users-administration/customers/${row.original.id}`}
                    className="text-[#4FD58F] flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                    <SquarePen width={14} height={14} /> Edit
                </Link>
            ),
            enableSorting: false,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage customer organizations and their details</p>
                </div>
            </div>
            <Card className="bg-white w-full rounded-xl">
                <DataTable
                    columns={columns}
                    data={safeOrganizations}
                    searchKey="name"
                    pagination={safePagination}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    loading={loading}
                    serverSide={true}
                />
            </Card>
        </div>
    );
};

export default OrganizationsTable;
