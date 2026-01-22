"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { useOrganizations, useOrganizationMutations } from "@/hooks/admin/useOrganizations";
import { Organization, OrganizationFilters } from "@/interfaces/Organization";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

export default function OrganizationsList() {
    const router = useRouter();
    const [filters, setFilters] = useState<OrganizationFilters>({
        page: 1,
        per_page: 10,
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);

    const { organizations, loading, pagination, handlePageChange, handleSearch, refresh } = useOrganizations(filters);
    const { deleteOrganization, deleting } = useOrganizationMutations();

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

    const handleDeleteClick = useCallback((organization: Organization) => {
        setOrganizationToDelete(organization);
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = async () => {
        if (organizationToDelete) {
            const success = await deleteOrganization(organizationToDelete.id);
            if (success) {
                setDeleteDialogOpen(false);
                setOrganizationToDelete(null);
                refresh();
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setOrganizationToDelete(null);
    };

    const columns: ColumnDef<Organization>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: "Organization",
            cell: ({ row }) => (
                <span className="pl-4 font-medium text-gray-900">
                    {row.getValue("name")}
                </span>
            ),
        },
        {
            accessorKey: "country",
            header: "Country",
            cell: ({ row }) => {
                const country = row.getValue("country") as string;
                return (
                    <span className="text-gray-900 capitalize">
                        {country || "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => {
                const phone = row.original?.phone;
                return (
                    <span className="text-gray-600">
                        {phone || "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "website",
            header: "Website",
            cell: ({ row }) => {
                const website = row.getValue("website") as string;
                if (!website) {
                    return <span className="text-gray-400">-</span>;
                }
                const url = website.startsWith('http://') || website.startsWith('https://')
                    ? website
                    : `https://${website}`;
                return (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {website}
                    </a>
                );
            },
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean;
                return (
                    <Badge
                        variant="light"
                        color={isActive ? 'success' : 'error'}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                const date = row.getValue("created_at") as string;
                return (
                    <span className="text-gray-600">
                        {date ? formatDate(date) : '-'}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const organization = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/organizations/${organization.id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(organization);
                            }}
                            disabled={deleting}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ], [handleDeleteClick, deleting]);

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-start">
            <div className="flex items-center justify-between w-full mt-4 mb-6">
                <h1 className="text-3xl text-[#171717] font-bold">Organizations</h1>
                <Link href="/admin/organizations/create">
                    <Button className="bg-primary text-white">
                        Create Organization
                    </Button>
                </Link>
            </div>
            <Card className="bg-white w-full rounded-xl">
                <DataTable
                    columns={columns}
                    data={organizations || []}
                    searchKey="name"
                    searchPlaceholder="Search organizations..."
                    onSearch={handleSearchTerm}
                    loading={loading}
                    serverSide={true}
                    pagination={pagination}
                    onPageChange={handlePage}
                    onRowClick={(row) => {
                        router.push(`/admin/organizations/${row.id}`);
                    }}
                />
            </Card>

            <ConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                title="Delete Organization"
                description={
                    organizationToDelete
                        ? `Are you sure you want to delete "${organizationToDelete.name}"? This action cannot be undone.`
                        : "Are you sure you want to delete this organization? This action cannot be undone."
                }
                onConfirm={handleConfirmDelete}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={deleting}
                loadingText="Deleting..."
            />
        </div>
    );
}

