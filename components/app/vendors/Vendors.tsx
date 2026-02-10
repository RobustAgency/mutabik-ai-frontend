"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetVendorsQuery,
  useDeleteVendorMutation,
  useGetVendorStatisticsQuery,
  Vendor,
  VendorFilters,
  VendorType,
} from "@/app/lib/features/vendorsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { StatisticsCard } from "@/components/custom/StatisticsCard";
import { StatisticsCardSkeleton } from "@/components/custom/StatisticsCardSkeleton";
import { Building2, CheckCircle, AlertCircle } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const Vendors: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<VendorFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    vendorId: number | null;
    vendorName: string;
  }>({
    isOpen: false,
    vendorId: null,
    vendorName: "",
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetVendorsQuery(queryParams);
  const { data: statistics, isLoading: isStatisticsLoading } = useGetVendorStatisticsQuery();
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

  const vendors = data?.data ?? [];
  const pagination = data?.pagination;

  const getTypeLabels = (types: VendorType[]): string => {
    const typeLabels: Record<VendorType, string> = {
      model_provider: "Model Provider",
      dataset_provider: "Dataset Provider",
      infrastructure_cloud: "Infrastructure/Cloud",
      saas_platform: "SaaS Platform",
      consulting_services: "Consulting Services",
      hardware_provider: "Hardware Provider",
      api_service: "API Service",
      annotation_labeling: "Annotation/Labeling",
      other: "Other",
    };
    return types.map((t) => typeLabels[t] || t).join(", ");
  };

  const handleEditClick = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    router.push(`/core-assets/vendors/${vendor.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, vendor: Vendor) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      vendorId: vendor.id,
      vendorName: vendor.vendor_name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.vendorId) {
      try {
        await deleteVendor(deleteDialogState.vendorId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          vendorId: null,
          vendorName: "",
        });
      } catch (error) {
        console.error("Failed to delete vendor:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        vendorId: null,
        vendorName: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Vendor ID
        </div>
      ),
      cell: ({ getValue }) => {
        const displayId = getValue() as string | undefined;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {displayId || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "vendor_name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Vendor Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "legal_name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Legal Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "hq_country",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          HQ Country
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "risk_tier",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Risk Tier
        </div>
      ),
      cell: ({ getValue }) => {
        const tierCode = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          tier_1: "Tier 1",
          tier_2: "Tier 2",
          tier_3: "Tier 3",
          tier_4: "Tier 4",
        };
        const colorMap: Record<string, string> = {
          tier_1: "bg-[#FEF3C7] text-[#D97706]",
          tier_2: "bg-[#FDE68A] text-[#F59E0B]",
          tier_3: "bg-[#FCD34D] text-[#B45309]",
          tier_4: "bg-[#FBBF24] text-[#92400E]",
        };
        const label = labelMap[tierCode] || tierCode;
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${colorMap[tierCode] || "bg-[#F2F4F7] text-[#667085]"
              }`}
          >
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const code = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          evaluating: "Evaluating",
          approved: "Approved",
          conditionally_approved: "Conditionally Approved",
          restricted: "Restricted",
          suspended: "Suspended",
          terminated: "Terminated",
        };
        const statusColors: Record<string, string> = {
          evaluating: "bg-[#FEF3C7] text-[#D97706]",
          approved: "bg-[#ECFDF3] text-[#047857]",
          conditionally_approved: "bg-[#DBEAFE] text-[#1D4ED8]",
          restricted: "bg-[#F3F4F6] text-[#374151]",
          suspended: "bg-[#FEE2E2] text-[#DC2626]",
          terminated: "bg-[#F3F4F6] text-[#6B7280]",
        };
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${statusColors[code] || "bg-[#F2F4F7] text-[#667085]"
              }`}
          >
            {labelMap[code] || code}
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
      cell: ({ row }) => {
        const types = row.original.type;
        if (!types || types.length === 0) {
          return (
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              —
            </div>
          );
        }
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {getTypeLabels(types)}
          </div>
        );
      },
    },
    {
      accessorKey: "data_processing_role",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Processing Role
        </div>
      ),
      cell: ({ getValue }) => {
        const role = getValue() as string | null;
        if (!role) {
          return (
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              —
            </div>
          );
        }
        const roleLabels: Record<string, string> = {
          controller: "Controller",
          processor: "Processor",
          sub_processor: "Sub Processor",
          not_applicable: "Not Applicable",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {roleLabels[role] || role}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <PermissionGate permission={PERMISSIONS.VENDORS_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.VENDORS_DELETE}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleDeleteClick(e, row.original)}
              >
                Remove
              </Button>
            </PermissionGate>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {isStatisticsLoading ? (
          <>
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
            <StatisticsCardSkeleton />
          </>
        ) : statistics ? (
          <>
            <StatisticsCard
              label="Total Vendors"
              value={statistics.total_count}
              icon={Building2}
              iconColor="text-[#667085]"
              valueColor="text-[#1D2939]"
            />
            <StatisticsCard
              label="Approved"
              value={statistics.approved_count}
              icon={CheckCircle}
              iconColor="text-[#039855]"
              valueColor="text-[#039855]"
            />
            <StatisticsCard
              label="Evaluating"
              value={statistics.evaluating_count}
              icon={AlertCircle}
              iconColor="text-[#F59E0B]"
              valueColor="text-[#F59E0B]"
            />
          </>
        ) : null}
      </div>

      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                All Vendors
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage vendor registry and relationships
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="vendors"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as VendorFilters);
                  setCurrentPage(1); // Reset to first page when filters change
                }}
              />
              <PermissionGate permission={PERMISSIONS.VENDORS_CREATE}>
                <Button
                  onClick={() => router.push("/core-assets/vendors/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Vendor
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={vendors}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) => router.push(`/core-assets/vendors/${row.id}/details`)}
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
              onPageChange={handlePageChange}
              emptyState={{
                title: "No vendors found",
                description: "Get started by creating your first vendor",
                action: (
                  <PermissionGate permission={PERMISSIONS.VENDORS_CREATE}>
                    <Button
                      onClick={() => router.push("/core-assets/vendors/create")}
                    >
                      Create Vendor
                    </Button>
                  </PermissionGate>
                ),
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Vendor"
        description={`Are you sure you want to delete "${deleteDialogState.vendorName}"? This action cannot be undone and will remove the vendor from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default Vendors;

