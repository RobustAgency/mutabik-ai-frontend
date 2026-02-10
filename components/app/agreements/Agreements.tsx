"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetAgreementsQuery,
  useDeleteAgreementMutation,
  useGetAgreementStatisticsQuery,
  Agreement,
} from "@/app/lib/features/agreementsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { StatisticsCard } from "@/components/custom/StatisticsCard";
import { StatisticsCardSkeleton } from "@/components/custom/StatisticsCardSkeleton";
import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const Agreements: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });

  const { data, isLoading } = useGetAgreementsQuery({
    page: currentPage,
    per_page: 15,
  });
  const { data: statistics, isLoading: isStatisticsLoading } = useGetAgreementStatisticsQuery();
  const [deleteAgreement, { isLoading: isDeleting }] = useDeleteAgreementMutation();

  const agreements = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (e: React.MouseEvent, agreement: Agreement) => {
    e.stopPropagation();
    router.push(`/core-assets/agreements/${agreement.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, agreement: Agreement) => {
    e.stopPropagation();
    setDeleteDialogState({ isOpen: true, id: agreement.id });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.id) {
      try {
        await deleteAgreement(deleteDialogState.id).unwrap();
        setDeleteDialogState({ isOpen: false, id: null });
      } catch (error) {
        console.error("Failed to delete agreement:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({ isOpen: false, id: null });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<Agreement>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Agreement ID
        </div>
      ),
      cell: ({ getValue, row }) => {
        const displayId = getValue() as string | undefined;
        return (
          <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
            {displayId || `AG-${String(row.original.id).padStart(6, "0")}`}
          </div>
        );
      },
    },
    {
      accessorKey: "agreement_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          msa: "MSA",
          dpa: "DPA",
          order_form: "Order Form",
          addendum: "Addendum",
          sla: "SLA",
          nda: "NDA",
          sow: "SOW",
          other: "Other",
        };
        const colorMap: Record<string, string> = {
          msa: "bg-[#F3F4F6] text-[#374151]",
          dpa: "bg-[#DBEAFE] text-[#1D4ED8]",
          order_form: "bg-[#E0E7FF] text-[#4338CA]",
          addendum: "bg-[#FEF3C7] text-[#D97706]",
          sla: "bg-[#ECFDF3] text-[#047857]",
          other: "bg-[#F2F4F7] text-[#667085]",
        };
        const label = labelMap[type] || type;
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${colorMap[type] || "bg-[#F2F4F7] text-[#667085]"
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
          draft: "Draft",
          under_review: "Under Review",
          pending_signature: "Pending Signature",
          active: "Active",
          expired: "Expired",
          terminated: "Terminated",
          suspended: "Suspended",
        };
        const statusColors: Record<string, string> = {
          draft: "bg-[#FEF3C7] text-[#D97706]",
          under_review: "bg-[#DBEAFE] text-[#1D4ED8]",
          pending_signature: "bg-[#FDE68A] text-[#F59E0B]",
          active: "bg-[#ECFDF3] text-[#047857]",
          expired: "bg-[#F3F4F6] text-[#374151]",
          terminated: "bg-[#FEE2E2] text-[#DC2626]",
          suspended: "bg-[#FEE2E2] text-[#DC2626]",
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
      accessorKey: "effective_from",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Effective From
        </div>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
        const formatted = date ? new Date(date).toLocaleDateString() : "—";
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "effective_to",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Effective To
        </div>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
        const formatted = date ? new Date(date).toLocaleDateString() : "—";
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "vendor_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Vendor
        </div>
      ),
      cell: ({ row }) => {
        const vendor = row.original.vendor;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {vendor?.vendor_name || `Vendor #${row.original.vendor_id}`}
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
            <PermissionGate permission={PERMISSIONS.AGREEMENTS_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.AGREEMENTS_DELETE}>
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
    {isStatisticsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <StatisticsCardSkeleton />
              <StatisticsCardSkeleton />
              <StatisticsCardSkeleton />
              <StatisticsCardSkeleton />
            </div>
          ) : (
            statistics && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <StatisticsCard
                  label="Total Agreements"
                  value={statistics.total_agreements}
                  icon={FileText}
                  iconColor="text-[#667085]"
                  valueColor="text-[#1D2939]"
                />
                <StatisticsCard
                  label="Active"
                  value={statistics.active_agreements}
                  icon={CheckCircle}
                  iconColor="text-[#039855]"
                  valueColor="text-[#039855]"
                />
                <StatisticsCard
                  label="Expiring in 90 Days"
                  value={statistics.expiring_in_90_days}
                  icon={Clock}
                  iconColor="text-[#F59E0B]"
                  valueColor="text-[#F59E0B]"
                />
                <StatisticsCard
                  label="Pending Signature"
                  value={statistics.pending_signature_count}
                  icon={AlertCircle}
                  iconColor="text-[#F59E0B]"
                  valueColor="text-[#F59E0B]"
                />
              </div>
            )
          )}
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                All Agreements
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage contracts, DPAs and SLAs
              </p>
            </div>
            <PermissionGate permission={PERMISSIONS.AGREEMENTS_CREATE}>
              <Button
                onClick={() => router.push("/core-assets/agreements/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Agreement
              </Button>
            </PermissionGate>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={agreements}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) => router.push(`/core-assets/agreements/${row.id}/details`)}
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
                title: "No agreements found",
                description: "Get started by creating your first agreement",
                action: (
                  <PermissionGate permission={PERMISSIONS.AGREEMENTS_CREATE}>
                    <Button onClick={() => router.push("/core-assets/agreements/create")}>Create Agreement</Button>
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
        title="Delete Agreement"
        description={`Are you sure you want to delete this agreement? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default Agreements;


