"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetConsentScopesQuery, useDeleteConsentScopeMutation, ConsentScope } from "@/app/lib/features/consentScopesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const ConsentScopesPage: React.FC = () => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    scopeId: string | null;
    scopeName: string;
  }>({
    isOpen: false,
    scopeId: null,
    scopeName: "",
  });

  const [deleteScope, { isLoading: isDeleting }] = useDeleteConsentScopeMutation();
  const { data: scopes, isLoading } = useGetConsentScopesQuery();

  const handleEditClick = (e: React.MouseEvent, scope: ConsentScope) => {
    e.stopPropagation();
    router.push(`/privacy/consent/scopes/${scope.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, scope: ConsentScope) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      scopeId: scope.id,
      scopeName: `${scope.purpose.join(', ')} - ${scope.dataset_id}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.scopeId) {
      try {
        await deleteScope(deleteDialogState.scopeId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          scopeId: null,
          scopeName: "",
        });
      } catch (error) {
        console.error("Failed to delete scope:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        scopeId: null,
        scopeName: "",
      });
    }
  };

  const columns: ColumnDef<ConsentScope>[] = [
    {
      accessorKey: "dataset_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Dataset ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "purpose",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Purpose
        </div>
      ),
      cell: ({ getValue }) => {
        const purposes = getValue() as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {purposes.map((purpose, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC]">
                {purpose}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "subject_realm",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Subject Realm
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "jurisdiction",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Jurisdiction
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "effective_from",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Effective From
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {new Date(getValue() as string).toLocaleDateString()}
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Consent Scopes</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Policy definitions for consent coverage computation</p>
            </div>
            <Button
              onClick={() => router.push("/privacy/consent/scopes/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Scope
            </Button>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={scopes ?? []}
              variant="projects"
              loading={isLoading}
              onRowClick={(scope) => router.push(`/privacy/consent/scopes/${scope.id}/details`)}
              emptyState={{
                title: "No consent scopes found",
                description: "Scopes define which consents matter for each dataset/purpose/jurisdiction",
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Consent Scope"
        description={`Are you sure you want to delete scope "${deleteDialogState.scopeName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ConsentScopesPage;

