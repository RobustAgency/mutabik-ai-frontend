"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
//import { useGetOrganizationUsersQuery, User, useDeleteUserMutation } from "@/app/lib/features/usersApi";

import { useGetOrganizationUsersQuery,  useDeleteUserMutation } from "@/app/lib/features/usersApi";
import { Button } from "@/components/ui/button";

export type User = {
  id: number; // ⬅️ change here
  name: string;
  user: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
};

export const dummyUsers: User[] = [
  {
    id: 1,
    name: "Ahmad Khokhar",
    role: "admin",
    user:'abc',
    createdAt: "2024-06-12T10:15:00Z",
  },
  {
    id: 2,
    name: "Ali Raza",
    role: "editor",
    user:'abc',
    createdAt: "2024-07-03T14:45:00Z",
  },
  {
    id: 3,
    name: "Fatima Noor",
    role: "viewer",
    user:'abc',
    createdAt: "2024-08-19T09:30:00Z",
  },
  {
    id: 4,
    name: "Usman Tariq",
    role: "editor",
    user:'abc',
    createdAt: "2024-09-01T16:10:00Z",
  },
  {
    id: 5,
    name: "Ayesha Khan",
    role: "viewer",
    user:'abc',
    createdAt: "2024-10-11T11:00:00Z",
  },
];



import InviteUsersDialog from "./AddPermissionDialog";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { useRouter } from "next/navigation";
import AddAdminUserDialog from "../adminUsers/AddAdminUserDialog";
import AddPermissionDialog from "./AddPermissionDialog";

const UsersTable: React.FC = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const router = useRouter();

  const queryParams = React.useMemo(
    () => ({ per_page: 10, page: currentPage }),
    [currentPage]
  );

 // const { data, isLoading } = useGetOrganizationUsersQuery(queryParams);
  const users = dummyUsers;
  const pagination = { current_page: currentPage, per_page: 10, total: users.length,last_page:3 };
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  



  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-sm font-medium text-[#667085]">Name</div>,
      cell: ({ getValue }) => <div className="text-sm font-medium text-[#1D2939]">{getValue() as string}</div>,
    },
    
    {
  accessorKey: "role",
  header: () => (
    <div className="text-sm font-medium text-[#667085]">Role</div>
  ),
  cell: ({ row }) => row.original.role,
},
 {
    
  accessorKey: "user",
  header: () => (
    <div className="text-sm font-medium text-[#667085]">User</div>
  ),
  cell: ({ row }) => row.original.user,
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
            className="text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-200"
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
              <h2 className="font-medium text-sm text-[#000000]">User Permissions</h2>
              <p className="text-sm text-[#667085]">Manage user permissions</p>
            </div>
            <Button 
              onClick={() => setInviteDialogOpen(true)}
              className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
            create permission
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={users}
            serverSide={true}
            
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
           onRowClick={(row) => {
            router.push(`/admin/permissions/${row.id}`);
          }}
          
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

      <AddPermissionDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        // onInviteSuccess={() => setCurrentPage(1) }
      />
    </>
  );
};

export default UsersTable;
