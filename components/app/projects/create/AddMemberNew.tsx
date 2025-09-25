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

const AddMemberNew = () => {
  const [role, setRole] = useState("");

  return (
    <div>
      <div className="p-6">
        {/* Select */}
        <Label className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] mb-2">
          Member
        </Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full gap-2 px-4 py-2.5 rounded-md border border-[#D0D5DD] shadow-[0_1px_2px_0_#1018280D] opacity-100 cursor-pointer">
            <SelectValue
              className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]"
              placeholder="Select a role"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem className="cursor-pointer" value="owner">
                Owner
              </SelectItem>
              <SelectItem className="cursor-pointer" value="admin">
                Admin
              </SelectItem>
              <SelectItem className="cursor-pointer" value="member">
                Member
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Radio Group */}
        <Label className="font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] mt-6 mb-2">
          Role
        </Label>
        <RadioGroup className="flex space-x-4" defaultValue="owner">
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
        <div className="flex justify-end">
            <Button className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white mt-6 cursor-pointer">Add New Member</Button>
          </div>
      </div>
    </div>
  );
};

export default AddMemberNew;
