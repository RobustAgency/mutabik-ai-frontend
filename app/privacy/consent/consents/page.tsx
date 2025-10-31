"use client";



import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetUserConsentsQuery, useDeleteUserConsentMutation, UserConsent } from "@/app/lib/features/userConsentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const UserConsentsPage: React.FC = () => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    consentId: string | null;
    consentName: string;
  }>({
    isOpen: false,
    consentId: null,
    consentName: "",
  });

  const [deleteConsent, { isLoading: isDeleting }] = useDeleteUserConsentMutation();
  const { data: consents, isLoading } = useGetUserConsentsQuery();

  const handleDeleteClick = (e: React.MouseEvent, consent: UserConsent) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      consentId: consent.id,
      consentName: consent.subject_key,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.consentId) {
      try {
        await deleteConsent(deleteDialogState.consentId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          consentId: null,
          consentName: "",
        });
      } catch (error) {
        console.error("Failed to delete consent:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        consentId: null,
        consentName: "",
      });
    }
  };

  const columns: ColumnDef<UserConsent>[] = [
    {
      accessorKey: "subject_key",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Subject Key
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "subject_realm",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Realm
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "consent_status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const colorMap: Record<string, string> = {
          granted: "bg-[#ECFDF3] text-[#039855]",
          denied: "bg-[#FEF3F2] text-[#F04438]",
          withdrawn: "bg-[#FEF3F2] text-[#F79009]",
          expired: "bg-[#F2F4F7] text-[#667085]",
          not_obtained: "bg-[#FEF3F2] text-[#F04438]",
        };
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${colorMap[status] || "bg-[#F2F4F7] text-[#667085]"}`}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "legal_basis",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Legal Basis
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">User Consents</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Subject-level consent records (System of Record)</p>
            </div>
            <Button
              onClick={() => router.push("/privacy/consent/consents/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Consent
            </Button>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={consents ?? []}
              variant="projects"
              loading={isLoading}
              emptyState={{
                title: "No user consents found",
                description: "User consents are the foundation for GDPR/PDPL compliance",
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User Consent"
        description={`Are you sure you want to delete consent for "${deleteDialogState.consentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default UserConsentsPage;

