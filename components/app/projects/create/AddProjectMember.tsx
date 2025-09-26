"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Member } from "@/service/app/members";

interface AddProjectMemberProps {
  members: Member[];
  projectMembers: Member[];
  onAddMember: (member: Member, role: string) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const AddProjectMember = ({ members, projectMembers, onAddMember, onClose, loading }: AddProjectMemberProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("editor");

  // Filter out members who are already in the project
  const filteredMembers = members.filter(member => 
    !projectMembers.some(projectMember => projectMember.id === member.id)
  );

  const handleAddMember = async () => {
    if (!selectedMemberId) {
      return;
    }

    const member = filteredMembers.find(m => m.id === parseInt(selectedMemberId));
    if (member) {
      await onAddMember(member, selectedRole);
    }
  };

  return (
    <div>
      <div className="p-6">
        {/* Select Member */}
        <Label className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] mb-2">
          Member
        </Label>
        <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
          <SelectTrigger className="w-full gap-2 px-4 py-2.5 rounded-md border border-[#D0D5DD] shadow-[0_1px_2px_0_#1018280D] opacity-100 cursor-pointer">
            <SelectValue
              className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]"
              placeholder="Select a member"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Members</SelectLabel>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <SelectItem
                    key={member.id}
                    className="cursor-pointer"
                    value={member.id.toString()}
                  >
                    {member.name} ({member.email})
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-gray-500">
                  All organization members are already in this project
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Radio Group */}
        <Label className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] mt-6 mb-2">
          Role
        </Label>
        <RadioGroup
          className="flex space-x-4"
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              className="w-5 h-5 rounded-[10px] data-[state=checked]:bg-[#465FFF] border-[1.25px] border-[#D0D5DD] opacity-100"
              value="owner"
              id="owner"
            />
            <Label
              className="font-medium text-sm leading-5 tracking-normal text-[#344054]"
              htmlFor="owner"
            >
              Owner
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              className="w-5 h-5 rounded-[10px] data-[state=checked]:bg-[#465FFF] border-[1.25px] border-[#D0D5DD] opacity-100"
              value="auditor"
              id="auditor"
            />
            <Label
              className="font-medium text-sm leading-5 tracking-normal text-[#344054]"
              htmlFor="auditor"
            >
              Auditor
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              className="w-5 h-5 rounded-[10px] data-[state=checked]:bg-[#465FFF] border-[1.25px] border-[#D0D5DD] opacity-100"
              value="reviewer"
              id="reviewer"
            />
            <Label
              className="font-medium text-sm leading-5 tracking-normal text-[#344054]"
              htmlFor="reviewer"
            >
              Reviewer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              className="w-5 h-5 rounded-[10px] data-[state=checked]:bg-[#465FFF] border-[1.25px] border-[#D0D5DD] opacity-100"
              value="editor"
              id="editor"
            />
            <Label
              className="font-medium text-sm leading-5 tracking-normal text-[#344054]"
              htmlFor="editor"
            >
              Editor
            </Label>
          </div>
        </RadioGroup>
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="h-[44px] border border-[#D0D5DD] bg-white text-[#344054] mt-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMember}
            disabled={loading || !selectedMemberId || filteredMembers.length === 0}
            className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : filteredMembers.length === 0 ? 'No Members Available' : 'Add New Member'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectMember;
