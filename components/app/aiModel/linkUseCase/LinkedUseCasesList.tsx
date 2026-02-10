"use client";

import React, { useState } from 'react'
import { DataTable } from '@/components/custom/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { useGetAiModelUseCasesQuery, useDeleteAiModelUseCaseMutation } from '@/app/lib/features/aiModelUseCasesApi'
import { AiModelUseCase } from '@/app/lib/features/aiModelUseCasesApi'
import ConfirmationDialog from '@/components/custom/ConfirmationDialog'
import { PermissionGate } from "@/components/auth/PermissionGate"
import { PERMISSIONS } from "@/constants/permissions"

const LinkedUseCasesList: React.FC = () => {
    const router = useRouter()
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean
        linkId: number | null
        useCaseName: string
    }>({
        isOpen: false,
        linkId: null,
        useCaseName: ''
    })

    // Fetch all linked use cases (no filter)
    const { data: linkedUseCases = [], isLoading } = useGetAiModelUseCasesQuery() // Pass nothing to get all

    // Delete mutation
    const [deleteLink, { isLoading: isDeleting }] = useDeleteAiModelUseCaseMutation()

    const handleDeleteClick = (id: number, useCaseName: string) => {
        setDeleteDialogState({
            isOpen: true,
            linkId: id,
            useCaseName: useCaseName
        })
    }

    const handleConfirmDelete = async () => {
        if (deleteDialogState.linkId) {
            try {
                await deleteLink(deleteDialogState.linkId).unwrap()
                setDeleteDialogState({
                    isOpen: false,
                    linkId: null,
                    useCaseName: ''
                })
            } catch (error) {
                console.error('Failed to unlink use case:', error)
            }
        }
    }

    const handleCancelDelete = () => {
        setDeleteDialogState({
            isOpen: false,
            linkId: null,
            useCaseName: ''
        })
    }

    const getAiModelName = (row: AiModelUseCase) => {
        return row.ai_model?.name || `Model ${row.ai_model_id}`
    }

    const columns: ColumnDef<AiModelUseCase>[] = [
        {
            accessorKey: "display_id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    ID
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "ai_model_id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    AI Model
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getAiModelName(row.original)}
                </div>
            ),
        },
        {
            accessorKey: "use_case.name",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Use Case
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {row.original.use_case?.name || row.original.use_case?.title || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "ai_model_version.version_number",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Model Version
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {row.original.ai_model_version?.version_number || 'N/A'}
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
                    approved: 'bg-green-100 text-green-800',
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
            id: "actions",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Actions
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <PermissionGate permission={PERMISSIONS.AI_MODEL_USE_CASES_DELETE}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                const useCaseName = row.original.use_case?.name || row.original.use_case?.title || 'this use case'
                                handleDeleteClick(row.original.id, useCaseName)
                            }}
                            className="text-xs text-red-600 hover:text-red-700"
                        >
                            Unlink
                        </Button>
                    </PermissionGate>
                </div>
            ),
        },
    ]

    return (
        <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Linked Use Cases</CardTitle>
                        <CardDescription>
                            Manage links between AI models and use cases
                        </CardDescription>
                    </div>
                    <PermissionGate permission={PERMISSIONS.AI_MODEL_USE_CASES_CREATE}>
                        <Button
                            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                            onClick={() => router.push('/core-assets/ai-models/link-use-case/create')}
                        >
                            Link Use Case
                        </Button>
                    </PermissionGate>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <Card className="bg-white w-full rounded-xl border-0 py-0">
                    <DataTable
                        columns={columns}
                        data={linkedUseCases}
                        variant="projects"
                        loading={isLoading}
                        onRowClick={(row) => router.push(`/core-assets/ai-use-cases/${row.use_case_id}/details`)}
                        emptyState={{
                            title: "No linked use cases found",
                            description: "Get started by linking a use case to an AI model.",
                            action: (
                                <PermissionGate permission={PERMISSIONS.AI_MODEL_USE_CASES_CREATE}>
                                    <Button onClick={() => router.push('/core-assets/ai-models/link-use-case/create')}>
                                        Link Use Case
                                    </Button>
                                </PermissionGate>
                            )
                        }}
                    />
                </Card>
            </CardContent>

            <ConfirmationDialog
                isOpen={deleteDialogState.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Unlink Use Case"
                description={`Are you sure you want to unlink "${deleteDialogState.useCaseName}"? This action will remove the association between the AI model and use case.`}
                confirmText="Unlink"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Unlinking..."
            />
        </Card>
    )
}

export default LinkedUseCasesList

