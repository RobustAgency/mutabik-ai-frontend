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
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/app/useProjects";
import { GovernancePillar } from "@/utils/governancePillar";

const CreateProject = () => {
  const router = useRouter();
  const { createProject, loading } = useProjects();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    governance_pillar: '' as GovernancePillar | ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateProject = async () => {
    if (!formData.name || !formData.description || !formData.governance_pillar) {
      console.error('All fields are required');
      return;
    }

    const projectData = {
      name: formData.name,
      description: formData.description,
      governance_pillar: formData.governance_pillar as GovernancePillar
    };

    const success = await createProject(projectData);
    if (success) {
      // For now, we'll pass a placeholder project ID. In a real scenario, 
      // the API would return the created project ID
      router.push(`/projects/create/members?step=2&project_id=1`);
    }
  };
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
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
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
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
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
            <Select value={formData.governance_pillar} onValueChange={(value) => handleInputChange('governance_pillar', value)}>
              <SelectTrigger className="w-full cursor-pointer h-[50px] rounded-lg border border-[#D0D5DD] px-4 py-2.5 bg-white shadow-sm">
                <SelectValue
                  placeholder="Select governance pillar"
                  className="font-normal text-sm text-[#1D2939]"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={GovernancePillar.AI_GOVERNANCE}>AI Governance</SelectItem>
                  <SelectItem value={GovernancePillar.DATA_GOVERNANCE}>Data Governance</SelectItem>
                  <SelectItem value={GovernancePillar.PRIVACY_PDPL}>Privacy/PDPL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            onClick={handleCreateProject}
            disabled={loading || !formData.name || !formData.description || !formData.governance_pillar}
            className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
