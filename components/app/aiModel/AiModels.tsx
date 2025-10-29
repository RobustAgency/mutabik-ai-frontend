"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useAiModels } from '@/hooks/app/useAiModels';
import { AiModel } from "@/service/app/aiModels";

// Optional: define date formatter (e.g., "Oct 6, 2025")
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};

// Helper function to format category names
const formatCategory = (category: string): string => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to format status with colors
const getStatusBadge = (status: string, type: 'business' | 'operational') => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    if (type === 'business') {
        switch (status) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'planned':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'deprecated':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            case 'retired':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    } else {
        switch (status) {
            case 'production':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'testing':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'development':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'not_deployed':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    }
};

const AiModels: React.FC = () => {
    const { aiModels, loading } = useAiModels();
    const router = useRouter();

    const columns: ColumnDef<AiModel>[] = [
        {
            accessorKey: "id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    ID
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">Name</div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "primary_category",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Category
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatCategory(getValue() as string)}
                </div>
            ),
        },
        {
            accessorKey: "model_type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Type
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatCategory(getValue() as string)}
                </div>
            ),
        },
        {
            accessorKey: "ownership_type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Ownership
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatCategory(getValue() as string)}
                </div>
            ),
        },
        {
            accessorKey: "business_status",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Business Status
                </div>
            ),
            cell: ({ getValue }) => (
                <span className={getStatusBadge(getValue() as string, 'business')}>
                    {formatCategory(getValue() as string)}
                </span>
            ),
        },
        {
            accessorKey: "operational_status",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Operational Status
                </div>
            ),
            cell: ({ getValue }) => (
                <span className={getStatusBadge(getValue() as string, 'operational')}>
                    {formatCategory(getValue() as string)}
                </span>
            ),
        },
        {
            accessorKey: "regulatory_classification",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Regulatory Risk
                </div>
            ),
            cell: ({ getValue }) => {
                const classification = getValue() as string;
                const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
                let badgeClasses = baseClasses;

                switch (classification) {
                    case 'minimal_risk':
                        badgeClasses += " bg-green-100 text-green-800";
                        break;
                    case 'limited_risk':
                        badgeClasses += " bg-blue-100 text-blue-800";
                        break;
                    case 'high_risk':
                        badgeClasses += " bg-red-100 text-red-800";
                        break;
                    case 'unacceptable_risk':
                        badgeClasses += " bg-red-100 text-red-800";
                        break;
                    case 'sector_specific':
                        badgeClasses += " bg-purple-100 text-purple-800";
                        break;
                    default:
                        badgeClasses += " bg-gray-100 text-gray-800";
                }

                return (
                    <span className={badgeClasses}>
                        {formatCategory(classification)}
                    </span>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Created
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatDate(getValue() as string)}
                </div>
            ),
        },
    ];

    return (
        <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
            <CardContent className="flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All AI Models</h2>
                    <Button
                        onClick={() => router.push("/core-assets/ai-models/create")}
                        className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
                    >
                        New AI Model
                    </Button>
                </div>
                <Card className="bg-white w-full rounded-xl border-0 py-0">
                    <DataTable
                        columns={columns}
                        data={aiModels ?? []}
                        variant="projects"
                        loading={loading}
                        onRowClick={(row) => router.push(`/core-assets/ai-models/${row.id}/details`)}
                        emptyState={{
                            title: "No AI models found",
                            description: "Get started by creating your first AI model",
                            action: (
                                <Button onClick={() => router.push("/core-assets/ai-models/create")}>
                                    Create AI Model
                                </Button>
                            )
                        }}
                    />
                </Card>
            </CardContent>
        </Card>
    );
};

export default AiModels;