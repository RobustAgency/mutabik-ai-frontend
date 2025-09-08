"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/custom/DataTable";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import { useRequirements } from "@/hooks/admin/useRequirements";
import { Requirement, RequirementFilters } from "@/interfaces/Requirement";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Filter, LayoutGrid, Search } from "lucide-react";

export default function RequirementsList() {
    const [filters, setFilters] = useState<RequirementFilters>({
        page: 1,
        per_page: 10,
    });

    const { requirements, loading, refetch } = useRequirements(filters);

    const breadcrumbItems = [
        { label: 'Requirements', href: '/admin/compliance-library/requirements' },
        { label: 'List' },
    ];

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm || undefined,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handlePerPageChange = (perPage: number) => {
        setFilters(prev => ({ ...prev, per_page: perPage, page: 1 }));
    };

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
            header: "Controls",
            cell: () => (
                <span className="text-gray-700">
                    0 {/* This would be calculated based on actual controls */}
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
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Header */}
            <div className="flex items-center justify-between w-full mt-4 mb-6">
                <h1 className="text-3xl text-[#171717] font-bold">Requirements</h1>
                <Link href="/admin/compliance-library/requirements/create">
                    <Button className="bg-primary text-white">
                        Create Requirement
                    </Button>
                </Link>
            </div>

            {/* Main Content Card */}
            <Card className="w-full border-0 rounded-xl py-0">
                <div className="bg-white rounded-xl">
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-gray-300"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 border-gray-300"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div>
                        <DataTable
                            columns={columns}
                            data={requirements?.data || []}
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
                    </div>
                </div>
            </Card>
        </div>
    );
}
