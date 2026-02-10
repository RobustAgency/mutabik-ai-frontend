"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetStakeholdersQuery, useDeleteStakeholderMutation, useGetStakeholderStatisticsQuery, StakeholderFilters } from "@/app/lib/features/stakeholdersApi";
import { Stakeholder } from "@/app/lib/features/stakeholdersApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { StatisticsCard } from "@/components/custom/StatisticsCard";
import { StatisticsCardSkeleton } from "@/components/custom/StatisticsCardSkeleton";
import { Users, Building2, UserCheck } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const Stakeholders: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<StakeholderFilters>({});

  type TabValue = "all" | "person" | "team" | "committee" | "vendor" | "regulator";
  const [activeTab] = React.useState<TabValue>("all");
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    stakeholderId: number | null;
    stakeholderName: string;
  }>({
    isOpen: false,
    stakeholderId: null,
    stakeholderName: "",
  });

  const [deleteStakeholder, { isLoading: isDeleting }] = useDeleteStakeholderMutation();

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleEditClick = (e: React.MouseEvent, stakeholder: Stakeholder) => {
    e.stopPropagation(); // Prevent row click navigation
    router.push(`/core-assets/stakeholders/${stakeholder.id}/edit`);
  };

  // Handler for delete button click
  const handleDeleteClick = (e: React.MouseEvent, stakeholder: Stakeholder) => {
    e.stopPropagation(); // Prevent row click navigation
    setDeleteDialogState({
      isOpen: true,
      stakeholderId: stakeholder.id,
      stakeholderName: stakeholder.display_name,
    });
  };

  // Handler for confirm delete
  const handleConfirmDelete = async () => {
    if (deleteDialogState.stakeholderId) {
      try {
        await deleteStakeholder(deleteDialogState.stakeholderId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          stakeholderId: null,
          stakeholderName: "",
        });
      } catch (error) {
        console.error("Failed to delete stakeholder:", error);
      }
    }
  };

  // Handler for cancel delete
  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        stakeholderId: null,
        stakeholderName: "",
      });
    }
  };

  // Map UI tab to API types
  const mapTabToApiType = (tab: TabValue) => {
    switch (tab) {
      case "person":
        return "person" as const;
      case "team":
        return "team" as const;
      case "committee":
        return "committee_secretariat" as const;
      case "vendor":
        return "vendor_org" as const;
      case "regulator":
        return "regulator" as const;
      default:
        return undefined;
    }
  };

  const apiType = mapTabToApiType(activeTab);
  const queryFilters = React.useMemo(() => {
    const baseFilters: StakeholderFilters = {
      ...filters,
      page: currentPage,
      per_page: 10,
    };
    if (apiType) {
      baseFilters.type = apiType;
    }
    return baseFilters;
  }, [apiType, filters, currentPage]);

  const { data, isLoading } = useGetStakeholdersQuery(queryFilters);
  const { data: statistics, isLoading: isStatisticsLoading } = useGetStakeholderStatisticsQuery();
  const stakeholders = data?.data ?? [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<Stakeholder>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Stakeholder ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string || "-"}
        </div>
      ),
    },
    {
      accessorKey: "display_name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Display Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      id: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Name
        </div>
      ),
      cell: ({ row }) => {
        const first_name = row.original.first_name || "";
        const last_name = row.original.last_name || "";
        const fullName = `${first_name} ${last_name}`.trim() || "-";
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {fullName}
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
      cell: ({ getValue }) => {
        const type = getValue() as string;
        const typeLabels: Record<string, string> = {
          person: "Person",
          team: "Team",
          vendor_org: "Vendor",
          regulator: "Regulator",
          customer_group: "Customer Group",
          committee_secretariat: "Committee",
        };
        const typeLabel = typeLabels[type] || type;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2 whitespace-nowrap">
            {typeLabel}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Email
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "org_unit",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Org Unit
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "classification",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Classification
        </div>
      ),
      cell: ({ getValue }) => {
        const classification = getValue() as string;
        const classificationLabel = classification === "internal" ? "Internal" : "External";
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085] capitalize">
            {classificationLabel}
          </div>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const statusLabels: Record<string, string> = {
          active: "Active",
          in_active: "In Active",
          on_leave: "On Leave",
          off_boarded: "Off Boarded",
        };
        const statusLabel = statusLabels[status] || status;
        const isActive = status === "active";
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              isActive
                ? "bg-[#ECF3FF] text-[#465FFF]"
                : "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {statusLabel}
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
            <PermissionGate permission={PERMISSIONS.STAKEHOLDERS_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.STAKEHOLDERS_DELETE}>
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
              label="Total Stakeholders"
              value={statistics.total_count}
              icon={Users}
              iconColor="text-[#667085]"
              valueColor="text-[#1D2939]"
            />
            <StatisticsCard
              label="Internal"
              value={statistics.internal_count}
              icon={Building2}
              iconColor="text-[#039855]"
              valueColor="text-[#039855]"
            />
            <StatisticsCard
              label="External"
              value={statistics.external_count}
              icon={UserCheck}
              iconColor="text-[#667085]"
              valueColor="text-[#1D2939]"
            />
          </>
        ) : null}
      </div>

      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Stakeholders</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Authoritative registry referenced across the platform</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <DynamicFilter
                filterType="stakeholders"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as StakeholderFilters)}
              />
              <PermissionGate permission={PERMISSIONS.STAKEHOLDERS_CREATE}>
                <Button
                  onClick={() => router.push("/core-assets/stakeholders/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4 whitespace-nowrap"
                >
                  New Stakeholder
                </Button>
              </PermissionGate>
            </div>
          </div>
          {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            <Tab
              tabsData={tabsData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div> */}
          <Card className="bg-white w-full rounded-xl border-0 py-0 overflow-x-auto">
            <DataTable
              columns={columns}
              data={stakeholders}
              variant="projects"
              loading={isLoading}
              serverSide={true}
              onRowClick={(row) =>
                router.push(`/core-assets/stakeholders/${row.id}/details`)
              }
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
                title: "No stakeholders found",
                description: "Get started by creating your first stakeholder",
                action: (
                  <PermissionGate permission={PERMISSIONS.STAKEHOLDERS_CREATE}>
                    <Button
                      onClick={() =>
                        router.push("/core-assets/stakeholders/create")
                      }
                    >
                      Create Stakeholder
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
        title="Delete Stakeholder"
        description={`Are you sure you want to delete "${deleteDialogState.stakeholderName}"? This action cannot be undone and will remove the stakeholder from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default Stakeholders;
