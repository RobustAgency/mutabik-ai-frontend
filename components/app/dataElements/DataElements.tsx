"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDataElementsQuery, useDeleteDataElementMutation, DataElement, DataElementFilters } from "@/app/lib/features/dataElementsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import InlineCreateModal from "@/components/custom/InlineCreateModal";
import AssociateElementWithDatasetModal from "@/components/app/dataElements/map/AssociateElementWithDatasetModal";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const DataElements: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<DataElementFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    dataElementId: number | null;
    dataElementName: string;
  }>({
    isOpen: false,
    dataElementId: null,
    dataElementName: "",
  });

  const [deleteDataElement, { isLoading: isDeleting }] = useDeleteDataElementMutation();

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data: dataElementsData, isLoading } = useGetDataElementsQuery(queryParams);
  const dataElements = dataElementsData?.data || [];
  const pagination = dataElementsData?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [associateState, setAssociateState] = React.useState<{ isOpen: boolean; dataElementId: number | null }>({ isOpen: false, dataElementId: null });

  const handleEditClick = (e: React.MouseEvent, dataElement: DataElement) => {
    e.stopPropagation();
    router.push(`/core-assets/data/elements/${dataElement.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, dataElement: DataElement) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      dataElementId: dataElement.id,
      dataElementName: dataElement.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.dataElementId !== null) {
      try {
        await deleteDataElement(deleteDialogState.dataElementId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          dataElementId: null,
          dataElementName: "",
        });
      } catch (error) {
        console.error("Failed to delete data element:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        dataElementId: null,
        dataElementName: "",
      });
    }
  };

  const columns: ColumnDef<DataElement>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Element ID
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
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "data_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "sensitivity",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Sensitivity
        </div>
      ),
      cell: ({ getValue }) => {
        const sensitivity = getValue() as string;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#FEF3F2] text-[#F04438] text-xs font-medium px-2">
            {sensitivity}
          </div>
        );
      },
    },
    {
      accessorKey: "pii_flag",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          PII
        </div>
      ),
      cell: ({ getValue }) => {
        const piiFlag = getValue() as string;
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${piiFlag === "Yes" ? "bg-[#FEF3F2] text-[#F04438]" : "bg-[#F2F4F7] text-[#667085]"
            }`}>
            {piiFlag}
          </div>
        );
      },
    },
    {
      accessorKey: "cde_flag",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          CDE
        </div>
      ),
      cell: ({ getValue }) => {
        const cdeFlag = getValue() as string;
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${cdeFlag === "Yes" ? "bg-[#ECF3FF] text-[#465FFF]" : "bg-[#F2F4F7] text-[#667085]"
            }`}>
            {cdeFlag}
          </div>
        );
      },
    },
    {
      accessorKey: "owner_team",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Owner Team
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
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
              onClick={(e) => {
                e.stopPropagation();
                setAssociateState({ isOpen: true, dataElementId: Number(row.original.id) });
              }}
            >
              Associate
            </Button>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Data Elements</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Enterprise data dictionary with canonical definitions and PII/CDE stewardship</p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="data-elements"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as DataElementFilters)}
              />
              <Button
                onClick={() => router.push("/core-assets/data/elements/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Data Element
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={dataElements}
              variant="projects"
              loading={isLoading}
              serverSide={true}
              pagination={pagination ? {
                page: pagination.current_page,
                limit: pagination.per_page,
                total: pagination.total,
                totalPages: pagination.last_page,
              } : undefined}
              onPageChange={handlePageChange}
              onRowClick={(row) =>
                router.push(`/core-assets/data/elements/${row.id}/details`)
              }
              emptyState={{
                title: "No data elements found",
                description: "Get started by creating your first data element",
                action: (
                  <Button
                    onClick={() =>
                      router.push("/core-assets/data/elements/create")
                    }
                  >
                    Create Data Element
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
        title="Delete Data Element"
        description={`Are you sure you want to delete "${deleteDialogState.dataElementName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />

      <InlineCreateModal
        isOpen={associateState.isOpen}
        onClose={() => setAssociateState({ isOpen: false, dataElementId: null })}
        onSuccess={() => setAssociateState({ isOpen: false, dataElementId: null })}
        title="Associate Data Element with Dataset"
        description="Create a mapping between this canonical element and a dataset column."
      >
        <AssociateElementWithDatasetModal
          dataElementId={Number(associateState.dataElementId || 0)}
          onClose={() => setAssociateState({ isOpen: false, dataElementId: null })}
          onSuccess={() => setAssociateState({ isOpen: false, dataElementId: null })}
        />
      </InlineCreateModal>
    </>
  );
};

export default DataElements;

