"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetPdpProcessingRegistersQuery, useDeletePdpProcessingRegisterMutation, PdpProcessingRegister } from "@/app/lib/features/pdpProcessingRegisterApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const PdpProcessingRegisterPage: React.FC = () => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    registerId: string | null;
    registerName: string;
  }>({
    isOpen: false,
    registerId: null,
    registerName: "",
  });

  const [deleteRegister, { isLoading: isDeleting }] = useDeletePdpProcessingRegisterMutation();
  const { data: registers, isLoading } = useGetPdpProcessingRegistersQuery();

  const handleEditClick = (e: React.MouseEvent, register: PdpProcessingRegister) => {
    e.stopPropagation();
    router.push(`/privacy/pdp-register/${register.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, register: PdpProcessingRegister) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      registerId: register.id,
      registerName: register.purpose,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.registerId) {
      try {
        await deleteRegister(deleteDialogState.registerId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          registerId: null,
          registerName: "",
        });
      } catch (error) {
        console.error("Failed to delete register:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        registerId: null,
        registerName: "",
      });
    }
  };

  const columns: ColumnDef<PdpProcessingRegister>[] = [
    {
      accessorKey: "purpose",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Processing Purpose
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "controller_role",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Controller Role
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "lawful_basis",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Lawful Basis
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
          {getValue() as string}
        </div>
      ),
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
        const colorMap: Record<string, string> = {
          Active: "bg-[#ECFDF3] text-[#039855]",
          Inactive: "bg-[#F2F4F7] text-[#667085]",
          Archived: "bg-[#FEF3F2] text-[#F04438]",
        };
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${colorMap[status] || "bg-[#F2F4F7] text-[#667085]"}`}>
            {status}
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">PDP Processing Register</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Record of Personal Data Processing Activities (GDPR Art.30 / PDPL)</p>
            </div>
            <Button
              onClick={() => router.push("/privacy/pdp-register/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Register
            </Button>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={registers ?? []}
              variant="projects"
              loading={isLoading}
              emptyState={{
                title: "No processing registers found",
                description: "Processing register links datasets and AI use cases to declared processing purposes",
              }}
              onRowClick={(register) => router.push(`/privacy/pdp-register/${register.id}`)}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Processing Register"
        description={`Are you sure you want to delete processing register "${deleteDialogState.registerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default PdpProcessingRegisterPage;

