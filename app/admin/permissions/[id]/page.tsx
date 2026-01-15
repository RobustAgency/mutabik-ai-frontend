"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  EditPermissionDialog,
  PermissionKey,
  PermissionRow,
} from "@/components/admin/permissions/EditPermissionDialog";
import { AddRoleDialog } from "@/components/admin/permissions/AddRoleDialog";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

/* MOCK PERMISSIONS */
const usePermissions = () => ({
  can: (p: string) => p === "roles.edit_permissions",
});

const AVAILABLE_ROLES = [
  "CatalogProduct",
  "Categories",
  "Orders",
  "Users",
  "Reports",
];

const PERMISSIONS: PermissionKey[] = [
  "none",
  "list",
  "details",
  "create",
  "edit",
  "delete",
];

export default function RolePermissionsPage() {
  const params = useParams();
  const roleId = Number(params.id);

  const { can } = usePermissions();
  const canEdit = can("roles.edit_permissions");

  const [rows, setRows] = React.useState<PermissionRow[]>([
    {
      resource: "CatalogProduct",
      permissions: {
        none: false,
        list: true,
        details: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
  ]);

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [activeRow, setActiveRow] = React.useState<PermissionRow | null>(null);

  // ConfirmationDialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState<PermissionRow | null>(
    null
  );

  // Add a new role
  const addRole = (role: string) => {
    setRows((prev) => [
      ...prev,
      {
        resource: role,
        permissions: {
          none: true,
          list: false,
          details: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    ]);
  };

  // Remove role (called from ConfirmationDialog)
  const confirmDelete = () => {
    if (!rowToDelete) return;

    setRows((prev) =>
      prev.filter((row) => row.resource !== rowToDelete.resource)
    );
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  // Save edited permissions
  const saveEdit = (updated: PermissionRow) => {
    setRows((prev) =>
      prev.map((row) => (row.resource === updated.resource ? updated : row))
    );
    setEditOpen(false);
    setActiveRow(null);
  };

  const columns = React.useMemo<ColumnDef<PermissionRow>[]>(
    () => [
      {
        accessorKey: "resource",
        header: "Role name",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-[#1D2939]">
            {row.original.resource}
          </div>
        ),
      },
      ...PERMISSIONS.map((permission) => ({
        id: permission,
        header: permission,
        cell: ({ row }: any) => (
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => {
              if (!canEdit) return;
              setActiveRow(row.original);
              setEditOpen(true);
            }}
          >
            <Checkbox
              checked={row.original.permissions[permission]}
              disabled={!canEdit}
            />
          </div>
        ),
      })),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            disabled={!canEdit}
            className="text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              setRowToDelete(row.original);
              setDeleteDialogOpen(true);
            }}
          >
            Remove
          </Button>
        ),
      },
    ],
    [canEdit]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectableRoles = AVAILABLE_ROLES.filter(
    (role) => !rows.some((row) => row.resource === role)
  );

  return (
    <>
      <Card className="w-full rounded-2xl bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Role permissions
              </h2>
              <p className="text-sm text-[#667085]">
                Manage role based permissions
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              disabled={!canEdit}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add role
            </Button>
          </div>

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddRoleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        availableRoles={selectableRoles}
        onAdd={addRole}
      />

      <EditPermissionDialog
        open={editOpen}
        canEdit={canEdit}
        activeRow={activeRow}
        onClose={() => {
          setEditOpen(false);
          setActiveRow(null);
        }}
        onSave={saveEdit}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setRowToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remove Role"
        description={`Are you sure you want to remove "${rowToDelete?.resource}" permissions? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </>
  );
}
