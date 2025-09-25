"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CreateProject = () => {

  const router = useRouter();
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* Project Details */}
      <Card className="w-full lg:w-1/2 rounded-2xl border border-[#E4E7EC] bg-white">
        <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-base sm:text-lg font-medium">
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="projectName"
              className="font-medium text-sm leading-5 text-[#344054]"
            >
              Project Name
            </Label>
            <Input
              id="projectName"
              className="h-[44px] rounded-lg border border-[#D0D5DD] bg-white shadow-sm px-4 py-2.5"
              placeholder="AI Credit Risk Scoring"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="projectDescription"
              className="font-medium text-sm leading-5 text-[#344054]"
            >
              Description
            </Label>
            <Textarea
              id="projectDescription"
              className="h-[134px] rounded-lg border border-[#D0D5DD] bg-white shadow-sm px-4 py-3"
              placeholder="Description"
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Settings */}
      <div className="w-full lg:w-1/2 h-1/2">
        <Card className="  rounded-2xl border border-[#E4E7EC] bg-white mb-4">
          <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
            <CardTitle className="text-base sm:text-lg font-medium">
              Project Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <Label
              htmlFor="projectSettings"
              className="font-medium text-sm leading-5 text-[#344054]"
            >
              Choose governance pillar
            </Label>
            <Select>
              <SelectTrigger className="w-full cursor-pointer h-[50px] rounded-lg border border-[#D0D5DD] px-4 py-2.5 bg-white shadow-sm">
                <SelectValue
                  placeholder="AI Governance"
                  className="font-normal text-sm text-[#1D2939]"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ai">AI Governance</SelectItem>
                  <SelectItem value="data">Data Governance</SelectItem>
                  <SelectItem value="privacy">Privacy/PDPL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            onClick={() => {

              router.push(`/projects/create/members?step=${2}`)
            }}
            className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
