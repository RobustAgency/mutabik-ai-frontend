"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { useGetRolesQuery } from "@/app/lib/features/rolesApi";
import type { UserRole } from "@/interfaces/UserRole";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const RolesTable: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useGetRolesQuery({ page, per_page: 15 });

  const roles: UserRole[] = data?.data ?? [];
  const pagination = data?.meta;

  const columns: ColumnDef<UserRole>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Role name
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Permissions count
        </div>
      ),
      cell: ({ row }) => {
        const count = row.original.permissions?.length ?? 0;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {count}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/administration/users/${row.original.id}/edit`);
            }}
          >
            Manage permissions
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (role: UserRole) => {
    router.push(`/administration/users/${role.id}/edit`);
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
          Users &amp; Roles
        </h2>
        <PermissionGate permission={PERMISSIONS.ADMIN_ROLES_CREATE}>
          <Button
            onClick={() => router.push("/administration/users/create")}
            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
          >
            Add role
          </Button>
        </PermissionGate>
      </div>
      <Card className="bg-white w-full rounded-xl border-0 py-0">
        <DataTable
          columns={columns}
          data={roles}
          loading={isLoading}
          onRowClick={handleRowClick}
          serverSide={true}
          pagination={
            pagination
              ? {
                  page: pagination.current_page,
                  limit: pagination.per_page,
                  total: pagination.total,
                  totalPages: pagination.last_page ?? 1,
                }
              : undefined
          }
          onPageChange={setPage}
            emptyState={{
              title: "No roles found",
              description: "Get started by creating your first role",
              action: (
                <PermissionGate permission={PERMISSIONS.ADMIN_ROLES_CREATE}>
                  <Button
                    onClick={() => router.push("/administration/users/create")}
                    className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                  >
                    Add role
                  </Button>
                </PermissionGate>
              ),
            }}
        />
      </Card>
    </Card>
  );
};

export default RolesTable;


