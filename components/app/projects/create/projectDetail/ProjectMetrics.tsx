import React from "react";
import Matrics from "./Metrics";
import { Brain, Users, TriangleAlert, CircleCheckBig } from "lucide-react";
import { Project } from "@/app/lib/features/projectsApi";

interface ProjectMatricesProps {
  project: Project;
}

const ProjectMetrics = ({ project }: ProjectMatricesProps) => {
  return (
    <div className="w-full flex flex-wrap gap-4 justify-start">
      <Matrics
        icon={<Brain className="w-6 h-6 text-[#344054]" />}
        label="AI Models"
        value={project.frameworks?.filter(f => f.category === 'ai' || f.type === 'ai')?.length?.toString() || "0"}
      />
      <Matrics
        icon={<Users className="w-6 h-6 text-[#344054]" />}
        label="Team Members"
        value={project.users?.length?.toString() || "0"}
      />
      <Matrics
        icon={< TriangleAlert className="w-6 h-6 text-[#344054]" />}
        label="Open Incidents"
        value="0"
      />
      <Matrics
        icon={<CircleCheckBig className="w-6 h-6 text-[#344054]" />}
        label="Frameworks"
        value={project.frameworks?.length?.toString() || "0"}
      />
    </div>

  );
};

export default ProjectMetrics;
