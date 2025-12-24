"use client";

import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { formatRole } from "@/utils/formatRole";
import type { ProjectUser } from "@/app/lib/features/projectsApi";

interface ProjectMembersListProps {
  users?: ProjectUser[];
  onAddMember?: () => void;
}

export const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  users = [],
  onAddMember,
}) => {
  const columns: ColumnDef<ProjectUser>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <div className="font-sans font-medium text-xs leading-4 text-[#667085] px-0 py-1 rounded">
            Name
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="pl-4 font-sans font-medium text-sm leading-5 text-[#344054]">
            {getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
            Email
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="font-sans font-normal text-sm leading-5 text-[#667085] py-1 rounded">
            {getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "project_user_role",
        header: () => (
          <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
            Role
          </div>
        ),
        cell: ({ row }) => {
          const role = row.original.project_user_role || row.original.role || "";
          return <p className="capitalize">{formatRole(role)}</p>;
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
            Action
          </div>
        ),
        cell: ({ row }) => {
          const member = row.original;
          // Don't allow removing the owner
          const role = member.project_user_role || member.role;
          if (role === "owner") {
            return null;
          }
          return (
            <Button
              onClick={() => {
                // TODO: Implement remove member functionality
                console.log("Remove member", member.id);
              }}
              variant="outline"
              className="text-[#344054]"
            >
              Remove
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={users}
        serverSide={false}
        variant="projects"
      />
      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-sm text-[#667085] mb-2">No results found</div>
          <div className="text-xs text-[#667085]">
            Try adjusting your search or filter to find what you're looking for.
          </div>
          <div className="text-xs text-[#667085] mt-2">
            No members added to this project yet.
          </div>
        </div>
      )}
    </div>
  );
};

