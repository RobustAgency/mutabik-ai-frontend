"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import AddProjectMember from "@/components/app/projects/create/AddProjectMember";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Member } from "@/service/app/members";
import { formatRole } from "@/utils/formatRole";

export interface ProjectMemberData {
  id: number;
  name: string;
  email: string;
  role: string;
  actionPerform: string;
}

const MembersAdd = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [open, setOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<Member[]>([]);

  const { members, loading: membersLoading, fetchMembers } = useMembers();
  const { addMember, loading: projectLoading, fetchProject, currentProject } = useProjects();

  useEffect(() => {
    // Fetch organization members for the add member modal
    fetchMembers();

    // Fetch project details to get current project members
    if (projectId) {
      fetchProject(parseInt(projectId));
    }
  }, [fetchMembers, fetchProject, projectId]);

  useEffect(() => {
    // Update project members when project data is loaded
    if (currentProject?.users) {
      setProjectMembers(currentProject.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.pivot?.role || user.role,
        supabase_id: '', // Will be populated from backend if needed
        is_approved: true,
        created_at: '',
        updated_at: '',
        stripe_id: null,
        pm_type: null,
        pm_last_four: null,
        trial_ends_at: null,
        organization_id: 0,
        is_organization_active: true
      } as Member)));
    }
  }, [currentProject]);

  const handleAddMemberToProject = async (member: Member, role: string) => {
    if (!projectId) {
      console.error('Project ID is required');
      return;
    }

    const success = await addMember(parseInt(projectId), {
      user_id: member.id,
      role: role
    });

    if (success) {
      // Add the new member to the project members list
      const newProjectMember: Member = {
        ...member,
        role: role
      };
      setProjectMembers(prev => [...prev, newProjectMember]);
      setOpen(false);
    }
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="pl-4 font-sans font-medium text-xs leading-4 text-[#667085] px-0 py-1 rounded">
          Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 text-[#344054]">
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
      accessorKey: "role",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
          Project Role
        </div>
      ),
      cell: ({ row }) => {
        return (
          <p>{formatRole(row.original.role)}</p>
        );
      },
    },
    // {
    //   accessorKey: "role",
    //   header: () => (
    //     <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
    //       Project Role
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     const currentRole = row.original.role;
    //     const handleRoleChange = (newRole: string) => {
    //       // Update the role in the local state
    //       setProjectMembers(prev =>
    //         prev.map(member =>
    //           member.id === row.original.id
    //             ? { ...member, role: newRole }
    //             : member
    //         )
    //       );
    //       // TODO: You might want to call an API to update the member role in the project
    //     };

    //     return (
    //       <Select value={currentRole} onValueChange={handleRoleChange}>
    //         <SelectTrigger className="w-[93px] h-[36px] gap-2 pt-[6px] pr-[10px] pb-[6px] pl-[12px] font-sans font-normal text-sm leading-5 tracking-normal  rounded-lg border border-[#D0D5DD] bg-white opacity-100 shadow-[0_1px_2px_0_#1018280D] cursor-pointer">
    //           <SelectValue placeholder={currentRole} />
    //         </SelectTrigger>
    //         <SelectContent>
    //           <SelectGroup>
    //             <SelectItem className="cursor-pointer" value="owner">
    //               Owner
    //             </SelectItem>
    //             <SelectItem className="cursor-pointer" value="editor">
    //               Editor
    //             </SelectItem>
    //             <SelectItem className="cursor-pointer" value="reviewer">
    //               Reviewer
    //             </SelectItem>
    //             <SelectItem className="cursor-pointer" value="auditor">
    //               Auditor
    //             </SelectItem>
    //           </SelectGroup>
    //         </SelectContent>
    //       </Select>
    //     );
    //   },
    // },
    {
      id: "actions",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
          Action
        </div>
      ),
      cell: ({ row }) => {
        const member = row.original;

        const handleRemoveMember = () => {
          // Remove member from project members list
          setProjectMembers(prev => prev.filter(pm => pm.id !== member.id));
          // TODO: You might want to call an API to remove the member from the project
        };

        return (
          <Button
            onClick={handleRemoveMember}
            disabled={projectLoading}
            variant="outline"
            className="text-[#344054]"
          >
            Remove
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white  flex flex-col justify-start mx-0 gap-0 px-4 sm:px-6 py-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-medium">
            Project Settings
          </CardTitle>
          <Button
            onClick={() => setOpen(true)}
            className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white"
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
              <div className="text-sm text-gray-500">Loading project members...</div>
            </div>
          )}
          {projectMembers.length === 0 && !membersLoading && !projectLoading && (
            <div className="flex justify-center py-8">
              <div className="text-sm text-gray-500">No members added to this project yet.</div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end w-full max-w-6xl mt-6">
        <Button
          onClick={() => {
            router.push(
              `/projects/create/frameworks?step=${3}&project_id=${projectId}`
            );
          }}
          className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white"
        >
          Continue
        </Button>
      </div>

      {/* ✅ Modal for AddMemberNew */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full p-0 gap-0 opacity-100 rounded-2xl border border-[#E4E7EC]">
          <DialogHeader className="opacity-100 px-6 py-5 border-b border-[#E4E7EC]">
            <DialogTitle className="font-sans font-semibold text-xl leading-7 tracking-normal text-[#1D2939] ">
              Add New Member
            </DialogTitle>
          </DialogHeader>
          <AddProjectMember
            members={members}
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

export default MembersAdd;
