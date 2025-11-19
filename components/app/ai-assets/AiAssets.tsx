"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
    useGetAiAssetsQuery,
    useDeleteAiAssetMutation,
    AiAsset,
} from "@/app/lib/features/aiAssetsApi";

const AiAssets: React.FC = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = React.useState(1);
    const { data, isLoading } = useGetAiAssetsQuery({ page: currentPage, per_page: 15 });
    const [deleteAsset, { isLoading: isDeleting }] = useDeleteAiAssetMutation();

    const assets = data?.data ?? [];
    const pagination = data?.pagination;

    const handleRemove = async (e: React.MouseEvent, asset: AiAsset) => {
        e.stopPropagation();
        await deleteAsset(asset.id).unwrap();
    };

    const columns: ColumnDef<AiAsset>[] = [
        {
            accessorKey: "display_id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    AI Asset ID
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "vendor_id",
            header: "Vendor",
            cell: ({ row }) => {
                const vendorName = row.original.vendor?.vendor_name;
                const vendorId = row.original.vendor_id;
                return vendorName || vendorId || "-";
            },
        },
        {
            accessorKey: "vendor_agreement_id",
            header: "Agreement ID",
            cell: ({ getValue }) => getValue() ?? "-",
        },
        {
            accessorKey: "vendor_effective_from",
            header: "Effective From",
            cell: ({ getValue }) => (getValue() ? new Date(getValue() as string).toLocaleString() : "-"),
        },
        {
            accessorKey: "vendor_effective_to",
            header: "Effective To",
            cell: ({ getValue }) => (getValue() ? new Date(getValue() as string).toLocaleString() : "-"),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="text-[#667085]"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/core-assets/ai-assets/${row.original.id}/edit`);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        className="text-[#667085]"
                        onClick={(e) => handleRemove(e, row.original)}
                        disabled={isDeleting}
                    >
                        Remove
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
            <CardContent className="flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
                    <div>
                        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                            AI Assets
                        </h2>
                        <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                            Manage AI assets vendor details
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/core-assets/ai-assets/create")}
                        className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                    >
                        New AI Asset
                    </Button>
                </div>

                <Card className="bg-white w-full rounded-xl border-0 py-0">
                    <DataTable
                        columns={columns}
                        data={assets}
                        variant="projects"
                        loading={isLoading}
                        onRowClick={(row) => router.push(`/core-assets/ai-assets/${row.id}/details`)}
                        emptyState={{
                            title: "No AI assets found",
                            description: "Get started by creating your first AI asset",
                            action: (
                                <Button onClick={() => router.push("/core-assets/ai-assets/create")}>
                                    Create AI Asset
                                </Button>
                            )
                        }}
                        pagination={
                            pagination
                                ? {
                                    page: pagination.current_page,
                                    limit: pagination.per_page,
                                    total: pagination.total,
                                    totalPages: pagination.last_page,
                                }
                                : undefined
                        }
                        onPageChange={setCurrentPage}
                    />
                </Card>
            </CardContent>
        </Card>
    );
};

export default AiAssets;


