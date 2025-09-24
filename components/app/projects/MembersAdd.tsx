"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import AddMemberNew from "@/components/app/projects/AddMemberNew";
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

export interface ProjectData {
  id: number;
  name: string;
  email: string;
  role: string;
  actionPerform: string;
}

// ✅ dummy data outside component
const dummyProjects: ProjectData[] = [
  {
    id: 1,
    name: "Ahsan Ahmad",
    email: "sajdwq@gmail.com",
    role: "Owner",
    actionPerform: "Remove",
  },
  {
    id: 2,
    name: "Ahsan Ahmad",
    email: "sajdwq@gmail.com",
    role: "Owner",
    actionPerform: "Remove",
  },
  {
    id: 3,
    name: "Ahsan Ahmad",
    email: "sajdwq@gmail.com",
    role: "Owner",
    actionPerform: "Remove",
  },
];

const MembersAdd = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<ProjectData>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 text-[#667085] px-0 py-1 rounded">
          Project
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
          Role
        </div>
      ),
      cell: ({ row }) => {
        const currentRole = row.original.role;
        return (
          <Select defaultValue={currentRole}>
            <SelectTrigger className="w-[93px] h-[36px] gap-2 pt-[6px] pr-[10px] pb-[6px] pl-[12px] font-sans font-normal text-sm leading-5 tracking-normal  rounded-lg border border-[#D0D5DD] bg-white opacity-100 shadow-[0_1px_2px_0_#1018280D] cursor-pointer">
              <SelectValue placeholder={currentRole} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem className="cursor-pointer" value="Owner">
                  Owner
                </SelectItem>
                <SelectItem className="cursor-pointer" value="Admin">
                  Admin
                </SelectItem>
                <SelectItem className="cursor-pointer" value="Member">
                  Member
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "actionPerform",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 text-[#667085] py-1 rounded">
          Action
        </div>
      ),
      cell: ({ getValue }) => {
        return (
          <Button className="w-[70px] font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] h-[36px] gap-2 pt-2 pr-2.5 pb-2 pl-2.5 rounded-lg border border-[#D0D5DD] bg-white hover:bg-gray-100 shadow-[0_1px_2px_0_#1018280D] opacity-100">
            {getValue() as string} {/* "Remove" button */}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Card className="w-full max-w-6xl rounded-2xl border border-[#E4E7EC] bg-white  flex flex-col justify-start mx-0 gap-0 px-4 sm:px-6 py-4">
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
              data={dummyProjects}
              serverSide
              variant="projects"
            />
          </Card>
        </CardContent>
      </Card>
      <div className="flex justify-end w-full max-w-6xl mt-6">
        <Button
          onClick={() => {
            router.push(
              `/projects/create-projects/add-members/choose-frameworks?step=${3}`
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
          <AddMemberNew />
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersAdd;
