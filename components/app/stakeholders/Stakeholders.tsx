"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetStakeholdersQuery, useDeleteStakeholderMutation, StakeholderFilters } from "@/app/lib/features/stakeholdersApi";
import { Stakeholder } from "@/app/lib/features/stakeholdersApi";
import Tab from "@/components/app/projects/Tab"
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const Stakeholders: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState<StakeholderFilters>({});

  // Tabs: All, Person, Team, Committee, Vendor, Regulator
  interface TabData { value: string; label: string }
  const tabsData: TabData[] = [
    { value: "all", label: "All" },
    { value: "person", label: "Person" },
    { value: "team", label: "Team" },
    { value: "committee", label: "Committee" },
    { value: "vendor", label: "Vendor" },
    { value: "regulator", label: "Regulator" },
  ];

  type TabValue = TabData["value"];
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    stakeholderId: string | null;
    stakeholderName: string;
  }>({
    isOpen: false,
    stakeholderId: null,
    stakeholderName: "",
  });

  const [deleteStakeholder, { isLoading: isDeleting }] = useDeleteStakeholderMutation();

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
    const baseFilters: StakeholderFilters = { ...filters };
    if (apiType) {
      baseFilters.type = apiType;
    }
    return baseFilters;
  }, [apiType, filters]);

  const { data: stakeholders, isLoading } = useGetStakeholdersQuery(queryFilters);

  const columns: ColumnDef<Stakeholder>[] = [
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
      accessorKey: "type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
            {type}
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
          Organization Unit
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "classification",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Classification
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const active = getValue() as boolean;
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${active
              ? "bg-[#ECF3FF] text-[#465FFF]"
              : "bg-[#F2F4F7] text-[#667085]"
              }`}
          >
            {active ? "Active" : "Inactive"}
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
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleEditClick(e, row.original)}
            >
              Edit
            </Button>
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleDeleteClick(e, row.original)}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Stakeholders</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Authoritative registry referenced across the platform</p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="stakeholders"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as StakeholderFilters)}
              />
              <Button
                onClick={() => router.push("/core-assets/stakeholders/create")}
                className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Stakeholder
              </Button>
            </div>
          </div>
          {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
            <Tab
              tabsData={tabsData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div> */}
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={stakeholders ?? []}

              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/core-assets/stakeholders/${row.id}/details`)
              }
              emptyState={{
                title: "No stakeholders found",
                description: "Get started by creating your first stakeholder",
                action: (
                  <Button
                    onClick={() =>
                      router.push("/core-assets/stakeholders/create")
                    }
                  >
                    Create Stakeholder
                  </Button>
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
