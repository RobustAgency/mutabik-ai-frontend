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

export default function RequirementsList() {
    const [filters, setFilters] = useState<RequirementFilters>({
        page: 1,
        per_page: 10,
    });

    const { requirements, loading } = useRequirements(filters);

    const breadcrumbItems = [
        { label: 'Requirements', href: '/admin/compliance-library/requirements' },
        { label: 'List' },
    ];

    // const handleSearch = (searchTerm: string) => {
    //     setFilters(prev => ({
    //         ...prev,
    //         search: searchTerm || undefined,
    //         page: 1,
    //     }));
    // };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // const handlePerPageChange = (perPage: number) => {
    //     setFilters(prev => ({ ...prev, per_page: perPage, page: 1 }));
    // };

    const columns: ColumnDef<Requirement>[] = useMemo(() => [
        {
            accessorKey: "code",
            header: "Req Code",
            cell: ({ row }) => (
                <span className="pl-4 font-medium text-gray-900">
                    {row.getValue("code")}
                </span>
            ),
        },
        {
            accessorKey: "name",
            header: "Title",
            cell: ({ row }) => (
                <div className="max-w-[300px]">
                    <span className="text-gray-900 line-clamp-2">
                        {row.getValue("name")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "frameworks_count",
            header: "Frameworks",
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">
                    {row.getValue("frameworks_count")}
                </span>
            ),
        },
        {
            accessorKey: "controls_count",
            header: "Controls",
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">
                    {row.getValue("controls_count")}
                </span>
            ),
        },
        {
            accessorKey: "updated_at",
            header: "Last Updated",
            cell: ({ row }) => {
                const date = new Date(row.getValue("updated_at"));
                return (
                    <span className="text-gray-700">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        })}
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
            <Card className="bg-white w-full rounded-xl py-0">
                <DataTable
                    columns={columns}
                    data={requirements?.data || []}
                    searchKey="name"
                    loading={loading}
                    serverSide={true}
                    pagination={{
                        page: requirements?.current_page || 1,
                        limit: requirements?.per_page || 10,
                        totalPages: requirements?.last_page || 1,
                        total: requirements?.total || 0,
                    }}
                    onPageChange={handlePageChange}
                />
            </Card>
        </div>
    );
}
