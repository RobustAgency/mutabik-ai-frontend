"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetOrganizationUsersQuery, User, useDeleteUserMutation } from "@/app/lib/features/usersApi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import InviteUsersDialog from "./InviteUsersDialog";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const UsersTable: React.FC = () => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const queryParams = React.useMemo(() => ({ per_page: 10 }), []);

  const { data: users = [], isLoading } = useGetOrganizationUsersQuery(queryParams);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // const handleRowClick = (user: User) => {
  //   router.push(`/users/${user.id}`);
  // };

  const handleDeleteClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setUserToDelete(user);
    setDeleteDialogOpen(true);
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

  const getRoleBadge = (role?: string) => {
  if (!role) {
    return <Badge variant="light" className="bg-gray-100 text-gray-700">—</Badge>;
  }

  const config: Record<
    string,
    { label: string; className: string }
  > = {
    PROJECT_LEAD: {
      label: "Project Lead",
      className: "bg-blue-100 text-blue-800",
    },
    REVIEWER: {
      label: "Reviewer",
      className: "bg-purple-100 text-purple-800",
    },
    CONTRIBUTOR: {
      label: "Contributor",
      className: "bg-green-100 text-green-800",
    },
    AUDITOR: {
      label: "Auditor",
      className: "bg-yellow-100 text-yellow-800",
    },
  };

  const roleConfig = config[role];

  if (!roleConfig) {
    return (
      <Badge variant="light" className="bg-gray-100 text-gray-700">
        {role}
      </Badge>
    );
  }

  return (
    <Badge variant="light" className={roleConfig.className}>
      {roleConfig.label}
    </Badge>
  );
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
    {
  accessorKey: "role",
  header: () => (
    <div className="text-sm font-medium text-[#667085]">Role</div>
  ),
  cell: ({ row }) => getRoleBadge(row.original.role),
},
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
      header: () => <div className="text-sm font-medium text-[#667085]">Actions</div>,
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => handleDeleteClick(e, row.original)}
            disabled={isDeleting}
            className="text-gray-500 hover:text-gray-700  border-1 border-gray-200 hover:bg-gray-200 outline-2"
          >
            <span>Remove</span>
          </Button>
        </div>
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
            <Button 
              onClick={() => setInviteDialogOpen(true)}
              className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              Invite
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={users}
            serverSide={false}
            loading={isLoading}
            // onRowClick={handleRowClick}
            variant="compact"
            emptyState={{ title: 'No users', description: 'No users found' }}
          />
        </CardContent>
      </Card>

      {/* <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
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
        
        
      <InviteUsersDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
    </>
  );
};

export default UsersTable;
