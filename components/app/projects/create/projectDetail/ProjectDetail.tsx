"use client";

import React, { useState } from "react";
import { useGetProjectQuery } from "@/app/lib/features/projectsApi";
import { ProjectMembersList } from "./ProjectMembersList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectSettingsForm } from "./ProjectSettingsForm";
import InlineCreateModal from "@/components/custom/InlineCreateModal";
import { ComplianceEvidenceModalForm } from "@/components/app/complianceEvidences/shared/ComplianceEvidenceModalForm";
import { ComplianceEvidenceList } from "./ComplianceEvidenceList";
import { RequirementsList } from "./RequirementsList";
import { ControlsList } from "./ControlsList";
import { FileText, Plus, Users, FileCheck, SlidersHorizontal } from "lucide-react";

interface ProjectDetailsProps {
  projectId: string;
}

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const { data: currentProject, isLoading: loading, error } = useGetProjectQuery(
    parseInt(projectId),
    { skip: !projectId }
  );
  const [isComplianceDialogOpen, setIsComplianceDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMsg = (error as any)?.error?.data?.message ||
      (error as any)?.data?.message ||
      "Failed to load project";
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading project</p>
          <p className="mt-2">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center text-gray-600">
          <p className="text-lg">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons at Top */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2939]">
            {currentProject.name}
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            {currentProject.description || "No description"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsMemberDialogOpen(true)}
            variant="outline"
            className="h-10 text-sm font-medium px-4 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Add Member
          </Button>
          <Button
            onClick={() => setIsComplianceDialogOpen(true)}
            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* Project Settings */}
      <ProjectSettingsForm project={currentProject} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
                Project Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#667085]">ID:</span>
                  <span className="text-sm font-medium text-[#1D2939]">{currentProject.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#667085]">Governance Pillar:</span>
                  <span className="text-sm font-medium text-[#1D2939]">
                    {currentProject.governance_pillar?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#667085]">Progress:</span>
                  <span className="text-sm font-medium text-[#1D2939]">{currentProject.progress || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#667085]">Created:</span>
                  <span className="text-sm font-medium text-[#1D2939]">
                    {new Date(currentProject.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#667085]">Last Updated:</span>
                  <span className="text-sm font-medium text-[#1D2939]">
                    {new Date(currentProject.updated_at).toLocaleDateString()}
                  </span>
                </div>
                {currentProject.users && currentProject.users.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-[#667085]">Owner:</span>
                    <span className="text-sm font-medium text-[#1D2939]">
                      {currentProject.users.find(u => u.project_user_role === "owner")?.name || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Framework */}
          <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
                Framework
              </h2>
              {currentProject.framework ? (
                <div className="rounded-xl border border-[#E4E7EC] p-4 space-y-2 bg-[#F9FAFB]">
                  <div className="text-base font-semibold text-[#1D2939]">
                    {currentProject.framework.name}
                    {currentProject.framework.version && ` (${currentProject.framework.version})`}
                  </div>
                  {currentProject.framework.scope && (
                    <div className="text-sm text-[#667085]">
                      Scope: {currentProject.framework.scope}
                    </div>
                  )}
                  {currentProject.framework.status && (
                    <div className="text-sm text-[#667085]">
                      Status: <span className="capitalize">{currentProject.framework.status}</span>
                    </div>
                  )}
                  {currentProject.framework.jurisdictions && currentProject.framework.jurisdictions.length > 0 && (
                    <div className="text-sm text-[#667085]">
                      Jurisdictions: {currentProject.framework.jurisdictions.join(", ")}
                    </div>
                  )}
                  {currentProject.framework.effective_date && (
                    <div className="text-sm text-[#667085]">
                      Effective: {currentProject.framework.effective_date}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-[#667085]">No framework linked</div>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#667085]" />
                <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
                  Requirements
                </h2>
              </div>
              <RequirementsList
                requirements={
                  currentProject.framework?.requirements && Array.isArray(currentProject.framework.requirements)
                    ? (currentProject.framework.requirements as any)
                    : undefined
                }
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#667085]" />
                <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
                  Controls
                </h2>
              </div>
              <ControlsList
                requirements={
                  currentProject.framework?.requirements && Array.isArray(currentProject.framework.requirements)
                    ? (currentProject.framework.requirements as any)
                    : undefined
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Members */}
          <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
                Project Members
              </h2>
              <ProjectMembersList users={currentProject.users} />
            </CardContent>
          </Card>

          {/* Compliance Evidences */}
          <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-sans font-semibold text-lg text-[#1D2939]">
                  Compliance Evidences
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/compliance-evidences", "_blank")}
                  className="h-8 text-xs font-medium px-3 flex items-center gap-2"
                >
                  <FileText className="w-3 h-3" />
                  View All
                </Button>
              </div>
              <ComplianceEvidenceList projectId={currentProject.id} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {currentProject && (
        <>
          <InlineCreateModal
            isOpen={isComplianceDialogOpen}
            onClose={() => setIsComplianceDialogOpen(false)}
            onSuccess={() => {
              setIsComplianceDialogOpen(false);
            }}
            title="Upload Compliance Evidence"
            description={
              currentProject.framework
                ? `Create a new compliance evidence for this project. Framework: ${currentProject.framework.name}${currentProject.framework.version ? ` (${currentProject.framework.version})` : ""}`
                : "Create a new compliance evidence for this project"
            }
          >
            <ComplianceEvidenceModalForm
              project={currentProject}
              onSuccess={() => setIsComplianceDialogOpen(false)}
              onCancel={() => setIsComplianceDialogOpen(false)}
            />
          </InlineCreateModal>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
