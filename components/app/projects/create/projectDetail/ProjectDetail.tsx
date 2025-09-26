"use client";

import React, { useEffect } from "react";
import ProjectSummary from "@/components/app/projects/create/projectDetail/ProjectSummary";
import ProjectAlert from "./ProjectAlert";
import ProjectMetrics from "./ProjectMetrics";
import ProjectProgress from "./ProjectProgress";
import ProjectMembers from "./ProjectMembers";
import ProjectChart from "./ProjectChart";
import { useProjects } from "@/hooks/app/useProjects";
import RequirementsAndControlsMetrics from "./RequirementsAndControlsMetrics";

interface ProjectDetailsProps {
  projectId: string;
}

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const { currentProject, loading, error, fetchProject } = useProjects();

  useEffect(() => {
    if (projectId) {
      fetchProject(parseInt(projectId));
    }
  }, [projectId, fetchProject]);

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
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading project</p>
          <p className="mt-2">{error}</p>
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
      <ProjectAlert />
      <ProjectSummary project={currentProject} />
      <ProjectMetrics project={currentProject} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" col-span-1 w-full flex flex-col gap-6">
          <ProjectProgress progress={currentProject.progress || 0} />
          <RequirementsAndControlsMetrics project={currentProject} />
        </div>
        <div className="col-span-1">
          <ProjectMembers project={currentProject} />
        </div>
      </div>
      <ProjectChart />
    </div>
  );
};

export default ProjectDetails;
