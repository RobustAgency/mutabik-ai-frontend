"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  PermissionRow,
  PermissionKey,
  EditPermissionDialog,
} from "@/components/admin/permissions/EditPermissionDialog";
import { AddRoleDialog } from "@/components/admin/permissions/AddRoleDialog";

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

  const saveEdit = (updated: PermissionRow) => {
    setRows((prev) =>
      prev.map((row) =>
        row.resource === updated.resource ? updated : row
      )
    );
    setEditOpen(false);
    setActiveRow(null);
  };

  const columns = React.useMemo<ColumnDef<PermissionRow>[]>(
    () => [
      {
        accessorKey: "resource",
        header: "Role name",
      },
      ...PERMISSIONS.map((permission) => ({
        id: permission,
        header: permission,
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.original.permissions[permission]}
            disabled
          />
        ),
      })),
      {
        header:'action',
        id: "actions",
        cell: ({ row }: any) => (
          <Button
            variant="ghost"
            size="icon"
            disabled={!canEdit}
            onClick={() => {
              setActiveRow(row.original);
              setEditOpen(true);
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
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
    (rol) => !rows.some((row) => row.resource === rol)
  );

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-sm font-medium">Role permissions</h2>
            <Button size="sm" onClick={() => setAddOpen(true)} disabled={!canEdit}>
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
        onClose={() => setEditOpen(false)}
        onSave={saveEdit}
      />
    </>
  );
}
