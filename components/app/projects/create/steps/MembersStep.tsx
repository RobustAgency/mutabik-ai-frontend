"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMembers } from "@/hooks/app/useMembers";
import { useProjects } from "@/hooks/app/useProjects";
import type { Member } from "@/service/app/members";
import AddProjectMember from "@/components/app/projects/create/AddProjectMember";
import { formatRole } from "@/utils/formatRole";

interface MembersStepProps {
  projectId: number | null;
}

export const MembersStep: React.FC<MembersStepProps> = ({ projectId }) => {
  const [open, setOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<Member[]>([]);

  const {
    members,
    loading: membersLoading,
    fetchMembers,
  } = useMembers();
  const {
    addMember,
    loading: projectLoading,
    fetchProject,
    currentProject,
  } = useProjects();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (currentProject?.users) {
      setProjectMembers(
        currentProject.users.map(
          (user) =>
            ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.pivot?.role || user.role || "member",
              project_user_role: user.project_user_role || "member",
              supabase_id: "",
              is_approved: true,
              created_at: "",
              updated_at: "",
              stripe_id: null,
              pm_type: null,
              pm_last_four: null,
              trial_ends_at: null,
              organization_id: 0,
              is_organization_active: true,
            } as Member),
        ),
      );
    }
  }, [currentProject]);

  const handleAddMemberToProject = async (member: Member, role: string) => {
    if (!projectId) {
      console.error("Project ID is required");
      return;
    }

    const success = await addMember(projectId, {
      user_id: member.id,
      role,
    });

    if (success) {
      const newProjectMember: Member = {
        ...member,
        role,
        project_user_role: role,
      };
      setProjectMembers((prev) => [...prev, newProjectMember]);
      setOpen(false);
    }
  };

  const handleRemoveMember = (member: Member) => {
    setProjectMembers((prev) => prev.filter((pm) => pm.id !== member.id));
    // If backend removal is required later, add API call here.
  };

  const columns: ColumnDef<Member>[] = useMemo(
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
          const role = row.original.project_user_role;
          return <p>{formatRole(role)}</p>;
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
          return (
            <Button
              onClick={() => handleRemoveMember(member)}
              disabled={projectLoading}
              variant="outline"
              className="text-[#344054]"
            >
              Remove
            </Button>
          );
        },
      },
    ],
    [projectLoading],
  );

  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col justify-start mx-0 gap-0 px-4 sm:px-6 py-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-medium">
            Project Members
          </CardTitle>
          <Button
            onClick={() => setOpen(true)}
            className="h-11 border border-[#4FD58F] bg-[#4FD58F] text-white"
          >
            <UserPlus /> Add Member
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 gap-4">
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={projectMembers}
              serverSide
              variant="projects"
            />
          </Card>
          {(membersLoading || projectLoading) && (
            <div className="flex justify-center py-4">
              <div className="text-sm text-gray-500">
                Loading project members...
              </div>
            </div>
          )}
          {projectMembers.length === 0 &&
            !membersLoading &&
            !projectLoading && (
              <div className="flex justify-center py-8">
                <div className="text-sm text-gray-500">
                  No members added to this project yet.
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full p-0 gap-0 opacity-100 rounded-2xl border border-[#E4E7EC]">
          <DialogHeader className="opacity-100 px-6 py-5 border-b border-[#E4E7EC]">
            <DialogTitle className="font-sans font-semibold text-xl leading-7 tracking-normal text-[#1D2939] ">
              Add New Member
            </DialogTitle>
          </DialogHeader>
          <AddProjectMember
            members={safeMembers}
            projectMembers={projectMembers}
            onAddMember={handleAddMemberToProject}
            onClose={() => setOpen(false)}
            loading={projectLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};


