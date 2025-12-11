"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import { useRequirements } from "@/hooks/admin/useRequirements";
import { Requirement, RequirementFilters } from "@/interfaces/Requirement";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RequirementsList() {
    const router = useRouter();                                             
    const [filters, setFilters] = useState<RequirementFilters>({
        page: 1,
        per_page: 10,
    });

    const { requirements, loading, pagination, handlePageChange, handleSearch } = useRequirements(filters);
    const breadcrumbItems = [
        { label: 'Requirements', href: '/admin/compliance-library/requirements' },
        { label: 'List' },
    ];

    const handleSearchTerm = (searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm || undefined,
            page: 1,
        }));
        handleSearch(searchTerm || "");
    };

    const handlePage = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
        handlePageChange(page);
    };

    const columns: ColumnDef<Requirement>[] = useMemo(() => [
        {
            accessorKey: "reference",
            header: "Reference",
            cell: ({ row }) => (
                <span className="pl-4 font-medium text-gray-900">
                    {row.getValue("reference")}
                </span>
            ),
        },
        {
            accessorKey: "applicability",
            header: "Applicability",
            cell: ({ row }) => (
                <span className="text-gray-900 line-clamp-2">
                    {row.getValue("applicability")}
                </span>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <span className="text-gray-900">{row.getValue("category")}</span>,
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => <span className="text-gray-900 capitalize">{row.getValue("priority")}</span>,
        },
        {
            accessorKey: "framework_id",
            header: "Framework",
            cell: ({ row }) => <span className="text-gray-900">{row.getValue("framework_id")}</span>,
        },
        {
            accessorKey: "effective_from",
            header: "Effective From",
            cell: ({ row }) => {
                const date = row.getValue("effective_from") as string;
                return (
                    <span className="text-gray-700">
                        {date ? new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }) : '-'}
                    </span>
                );
            },
        },
        {
            accessorKey: "effective_to",
            header: "Effective To",
            cell: ({ row }) => {
                const date = row.getValue("effective_to") as string;
                return (
                    <span className="text-gray-700">
                        {date ? new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }) : '-'}
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const requirement = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/compliance-library/requirements/${requirement.id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ], []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-start">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between w-full mt-4 mb-6">
                <h1 className="text-3xl text-[#171717] font-bold">Requirements</h1>
                <Link href="/admin/compliance-library/requirements/create">
                    <Button className="bg-primary text-white">
                        Create Requirement
                    </Button>
                </Link>
            </div>
            <Card className="bg-white w-full rounded-xl">
                <DataTable
                    columns={columns}
                    data={requirements || []}
                    searchKey="reference"
                    searchPlaceholder="Search requirements..."
                    onSearch={handleSearchTerm}
                    loading={loading}
                    serverSide={true}
                    pagination={pagination}
                    onPageChange={handlePage}
                    onRowClick={(row) => {
                        router.push(`/admin/compliance-library/requirements/${row.id}`);
                    }}
                />
            </Card>
        </div>
    );
}
