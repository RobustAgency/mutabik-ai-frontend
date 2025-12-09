"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useAiModels } from '@/hooks/app/useAiModels';
import { AiModel } from "@/service/app/aiModels";
import { formatDate, getStatusBadge } from "@/lib/helpers/ui";
import { AiModelFilters } from "@/app/lib/features/aiModelsApi";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

// Helper function to format category names safely
const formatCategory = (value: unknown): string => {
    if (typeof value !== 'string' || value.length === 0) return "-";
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const AiModels: React.FC = () => {
    const router = useRouter();
    const [filters, setFilters] = React.useState<AiModelFilters>({});
    const { aiModels, loading } = useAiModels(filters);

    const columns: ColumnDef<AiModel>[] = [
        {
            accessorKey: "display_id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    AI Model ID
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
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">Model Name</div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Model Category
                </div>
            ),
            cell: ({ getValue, row }) => {
                // Fallback to model_category or primary_category for backward compatibility
                const value = getValue() as string || (row.original as any).model_category || (row.original as any).primary_category || "";
                return (
                    <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                        {formatCategory(value)}
                    </div>
                );
            },
        },
        {
            accessorKey: "type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Type
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatCategory(getValue())}
                </div>
            ),
        },
        {
            accessorKey: "ownership_category",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Ownership Category
                </div>
            ),
            cell: ({ getValue, row }) => {
                // Fallback to ownership_type for backward compatibility
                const value = getValue() as string || (row.original as any).ownership_type || "";
                return (
                    <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                        {formatCategory(value)}
                    </div>
                );
            },
        },
        {
            accessorKey: "business_adoption_status",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Business Adoption Status
                </div>
            ),
            cell: ({ getValue, row }) => {
                // Fallback to business_status for backward compatibility
                const value = getValue() as string || (row.original as any).business_status || "";
                return (
                    <span className={getStatusBadge(value, 'business')}>
                        {formatCategory(value)}
                    </span>
                );
            },
        },
        {
            accessorKey: "regulatory_risk_tier",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Regulatory Risk Tier
                </div>
            ),
            cell: ({ getValue, row }) => {
                // Fallback to regulatory_risk_classification for backward compatibility
                const classification = (getValue() as string) || (row.original as any).regulatory_risk_classification || "";
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
            cell: ({ getValue, row }) => {
                // Fallback to created_date for backward compatibility
                const value = getValue() as string || (row.original as any).created_date || "";
                return (
                    <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                        {value ? formatDate(value) : "-"}
                    </div>
                );
            },
        },
    ];

    const handleFiltersChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters as AiModelFilters);
    };

    return (
        <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
            <CardContent className="flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All AI Models</h2>
                    <div className="flex items-center gap-3">
                        <DynamicFilter
                            filterType="ai-models"
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                        />
                        <Button
                            onClick={() => router.push("/core-assets/ai-models/create")}
                            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                        >
                            New AI Model
                        </Button>
                    </div>
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