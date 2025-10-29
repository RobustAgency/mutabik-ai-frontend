"use client"

import React, { useState } from 'react'
import { DataTable } from '@/components/custom/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import CreateLinkedUseCases from './CreateLinkedUseCases'
import { useGetAiModelUseCasesQuery, useDeleteAiModelUseCaseMutation } from '@/app/lib/features/aiModelUseCasesApi'
import { AiModelUseCase } from '@/app/lib/features/aiModelUseCasesApi'

interface LinkedUseCasesProps {
    aiModelId: number
}

const LinkedUseCases: React.FC<LinkedUseCasesProps> = ({ aiModelId }) => {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = useState(false)

    // Fetch linked use cases
    const { data: linkedUseCases = [], isLoading, error } = useGetAiModelUseCasesQuery(aiModelId)

    // Delete mutation
    const [deleteLink] = useDeleteAiModelUseCaseMutation()

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to unlink this use case?')) {
            try {
                await deleteLink(id).unwrap()
            } catch (error) {
                console.error('Failed to unlink use case:', error)
            }
        }
    }

    const columns: ColumnDef<AiModelUseCase>[] = [
        {
            accessorKey: "use_case.title",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Use Case
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {row.original.use_case?.title || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "ai_model_version.version",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Model Version
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {row.original.ai_model_version?.version || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "relationship_type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Relationship Type
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {row.original.relationship_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "use_case.status",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Status
                </div>
            ),
            cell: ({ row }) => {
                const status = row.original.use_case?.status || 'unknown'
                const statusClasses = {
                    active: 'bg-green-100 text-green-800',
                    draft: 'bg-yellow-100 text-yellow-800',
                    under_review: 'bg-blue-100 text-blue-800',
                    inactive: 'bg-gray-100 text-gray-800'
                }

                return (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
                        }`}>
                        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                )
            },
        },
        {
            accessorKey: "use_case.business_domain",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Business Domain
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {row.original.use_case?.business_domain || 'N/A'}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Actions
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/core-assets/use-cases/${row.original.use_case_id}/details`)}
                        className="text-xs"
                    >
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(row.original.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                    >
                        Unlink
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <>
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                <CardContent className="flex flex-col flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Linked Use Cases</h2>
                        <Button
                            className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
                            onClick={() => setDialogOpen(true)}
                        >
                            Link use case
                        </Button>
                    </div>
                    <Card className="bg-white w-full rounded-xl border-0 py-0">
                        <DataTable
                            columns={columns}
                            data={linkedUseCases}
                            variant="projects"
                            loading={isLoading}
                            onRowClick={(row) => router.push(`/core-assets/use-cases/${row.use_case_id}/details`)}
                            emptyState={{
                                title: "No linked use cases found",
                                description: "Get started by linking a use case to this AI model.",
                                action: (
                                    <Button onClick={() => setDialogOpen(true)}>
                                        Link Use Case
                                    </Button>
                                )
                            }}
                        />
                    </Card>
                </CardContent>
            </Card>
            <CreateLinkedUseCases
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                aiModelId={aiModelId}
            />
        </>
    )
}

export default LinkedUseCases