'use client'

import React, { useState, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Breadcrumbs from '@/components/custom/Breadcrumbs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/custom/DataTable'
import CreateTagDialog from './CreateTagDialog'
import { useTags } from '@/hooks/admin/useTags'
import type { Tag } from '@/interfaces/Tag'

const breadcrumbItems = [
    { label: 'Tags', href: '/admin/compliance-library/tags' },
    { label: 'List' },
]

const TagsList = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const { tags, pagination, loading, createTags, isCreating, handlePageChange, handleSearch } = useTags()

    const columns: ColumnDef<Tag>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => (
                    <div className="pl-4 font-medium text-gray-900">
                        {row.getValue('name')}
                    </div>
                ),
            },
            {
                accessorKey: 'group',
                header: 'Group',
                cell: ({ row }) => (
                    <div className="text-gray-600">
                        {row.getValue('group')}
                    </div>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: ({ row }) => {
                    const date = row.getValue('created_at') as string
                    return (
                        <div className="text-gray-600">
                            {date ? new Date(date).toLocaleDateString() : '-'}
                        </div>
                    )
                },
            },
        ],
        []
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-start">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between w-full mt-4 mb-6">
                <h1 className="text-3xl text-[#171717] font-bold">Tags</h1>
                <Button
                    className="bg-primary text-white"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    Create Tags
                </Button>
            </div>

            <Card className="bg-white w-full rounded-xl border">
                <DataTable
                    columns={columns}
                    data={tags}
                    searchKey="name"
                    searchPlaceholder="Search tags..."
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    loading={loading}
                    serverSide={true}
                />
            </Card>

            <CreateTagDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={createTags}
                isCreating={isCreating}
            />
        </div>
    )
}

export default TagsList