"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDatasetSubjectPopulationsQuery, useDeleteDatasetSubjectPopulationMutation } from "@/app/lib/features/datasetSubjectPopulationApi";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const DatasetSubjectPopulationList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: populationData, isLoading, error } = useGetDatasetSubjectPopulationsQuery({ page: currentPage, per_page: 15 });
  const [deletePopulation, { isLoading: isDeleting }] = useDeleteDatasetSubjectPopulationMutation();

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deletePopulation(deleteId).unwrap();
        setDeleteId(null);
      } catch (error) {
        console.error("Failed to delete dataset subject population:", error);
      }
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
      accessorKey: "dataset",
      header: "Dataset",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-[#1D2939]">{row.original.dataset?.name || "—"}</p>
          <p className="text-xs text-[#667085]">ID: {row.original.dataset_id}</p>
        </div>
      ),
    },
    {
      accessorKey: "snapshot",
      header: "Snapshot",
      cell: ({ row }) => (
        row.original.snapshot ? (
          <div>
            <p className="font-medium text-[#1D2939]">{row.original.snapshot.version_tag}</p>
            <p className="text-xs text-[#667085]">ID: {row.original.snapshot_id}</p>
          </div>
        ) : (
          <span className="text-[#667085]">—</span>
        )
      ),
    },
    {
      accessorKey: "subject_realm",
      header: "Subject Realm",
      cell: ({ row }) => <Badge variant="light">{row.original.subject_realm}</Badge>,
    },
    {
      accessorKey: "jurisdiction",
      header: "Jurisdiction",
      cell: ({ row }) => <Badge variant="outline">{row.original.jurisdiction}</Badge>,
    },
    {
      accessorKey: "subjects_total",
      header: "Total Subjects",
      cell: ({ row }) => (
        <span className="font-semibold text-[#039855]">{row.original.subjects_total.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "as_of",
      header: "As Of",
      cell: ({ row }) => new Date(row.original.as_of).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/core-assets/data/subject-population/${row.original.id}/details`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/core-assets/data/subject-population/${row.original.id}/edit`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(String(row.original.id))}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading dataset subject populations...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load dataset subject populations</p>
            <Button onClick={() => window.location.reload()} className="bg-[#4FD58F] text-white">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Dataset Subject Population</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Denominator facts by dataset/snapshot/realm/jurisdiction
              </p>
            </div>
            <Button
              onClick={() => router.push("/core-assets/data/subject-population/create")}
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
            >
              + Add Population Record
            </Button>
          </div>

          <CardContent className="p-0 pt-6">
            <DataTable
              columns={columns}
              data={populationData?.data || []}
              currentPage={currentPage}
              totalPages={populationData?.last_page || 1}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Dataset Subject Population"
        description="Are you sure you want to delete this population record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DatasetSubjectPopulationList;

