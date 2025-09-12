"use client";
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/custom/DataTable';
import { OrganizationMember } from '@/interfaces/Organization';
import { formatRole } from '@/utils/formatRole';
import MemberActions from './MemberActions';

interface MembersTableProps {
    members: OrganizationMember[];
    loading?: boolean;
    onMemberUpdated?: () => void | Promise<void>;
    onMemberDeleted?: () => void | Promise<void>;
}

const MembersTable: React.FC<MembersTableProps> = ({
    members,
    loading = false,
    onMemberUpdated,
    onMemberDeleted
}) => {
    const memberColumns: ColumnDef<OrganizationMember>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="pl-4 font-medium text-gray-900">{row.getValue('name')}</span>
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
            cell: ({ row }) => (
                <span className="text-gray-600">{formatRole(row.getValue('role'))}</span>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <MemberActions
                    member={row.original}
                    onMemberUpdated={onMemberUpdated}
                    onMemberDeleted={onMemberDeleted}
                />
            ),
        }
    ];

    return (
        <Card className='gap-0'>
            <CardHeader className='px-5'>
                <CardTitle className='text-lg font-semibold'>
                    Members
                </CardTitle>
            </CardHeader>
            <CardContent className='mt-0 py-0'>
                {members && members.length > 0 ? (
                    <DataTable
                        columns={memberColumns}
                        data={members}
                        loading={loading}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No members found for this organization
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MembersTable;
