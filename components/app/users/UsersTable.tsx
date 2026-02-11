"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  useGetOrganizationUsersQuery,
  User,
  useDeleteUserMutation,
} from "@/app/lib/features/usersApi";
import { Button } from "@/components/ui/button";

import InviteUsersDialog from "./InviteUsersDialog";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { ManageUserAccessDialog } from "@/components/app/users/ManageUserAccessDialog";
import { ManageUserRoleDialog } from "@/components/app/users/ManageUserRoleDialog";
import { UsersImportDialog } from "@/components/app/users/UsersImportDialog";
import { UserActionsCell } from "@/components/app/users/UserActionsCell";
import { UserRoleBadge } from "@/components/app/users/UserRoleBadge";

const UsersTable: React.FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [roleDialogUser, setRoleDialogUser] = React.useState<User | null>(null);
  const [permissionDialogUser, setPermissionDialogUser] =
    React.useState<User | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  
  const queryParams = React.useMemo(
    () => ({ per_page: 10, page: currentPage }),
    [currentPage]
  );

  const { data, isLoading } = useGetOrganizationUsersQuery(queryParams);
  const users = data?.data ?? [];
  const pagination = data?.pagination;
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleManageRoleClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setRoleDialogUser(user);
  };

  const handleManagePermissionsClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setPermissionDialogUser(user);
  };

  const confirmDelete = async () => {
    if (userToDelete?.id) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-sm font-medium text-[#667085]">Name</div>,
      cell: ({ getValue }) => <div className="text-sm font-medium text-[#1D2939]">{getValue() as string}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="text-sm font-medium text-[#667085]">Email</div>,
      cell: ({ getValue }) => <div className="text-sm text-[#667085]">{getValue() as string}</div>,
    },
//     {
//   accessorKey: "role",
//   header: () => (
//     <div className="text-sm font-medium text-[#667085]">Role</div>
//   ),
//   cell: ({ row }) => getRoleBadge(row.original.role),
// },
 {
      accessorKey: "created_at",
      header: () => <div className="text-sm font-medium text-[#667085]">Created</div>,
      cell: ({ getValue }) => {
        const val = getValue() as string | undefined;
        if (!val) return <div className="text-sm text-[#667085]">—</div>;
        const d = new Date(val);
        return <div className="text-sm text-[#667085]">{d.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      accessorKey: "id",
      header: () => (
        <div className="text-sm font-medium text-[#667085]">Actions</div>
      ),
      cell: ({ row }) => (
        <UserActionsCell
          user={row.original}
          onManageRole={handleManageRoleClick}
          onManagePermissions={handleManagePermissionsClick}
          onDelete={handleDeleteClick}
          isDeleting={isDeleting}
        />
      ),
    },
  ];

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-medium text-sm text-[#000000]">Users</h2>
              <p className="text-sm text-[#667085]">Manage organization users</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
                className="h-10 text-sm font-medium px-4 border-gray-300"
              >
                Import CSV
              </Button>
              <Button 
                onClick={() => setInviteDialogOpen(true)}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                Invite
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={users}
            serverSide={true}
            loading={isLoading}
            variant="compact"
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
            emptyState={{ title: 'No users', description: 'No users found' }}
          />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />

      <InviteUsersDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInviteSuccess={() => setCurrentPage(1)}
      />

      <UsersImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImportSuccess={() => setCurrentPage(1)}
      />

      <ManageUserRoleDialog
        user={roleDialogUser}
        open={Boolean(roleDialogUser)}
        onOpenChange={(open) => {
          if (!open) {
            setRoleDialogUser(null);
          }
        }}
      />

      <ManageUserAccessDialog
        user={permissionDialogUser}
        open={Boolean(permissionDialogUser)}
        onOpenChange={(open) => {
          if (!open) {
            setPermissionDialogUser(null);
          }
        }}
      />
    </>
  );
};

export default UsersTable;
