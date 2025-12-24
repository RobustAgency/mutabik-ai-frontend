"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/app/projects/shared/ProjectForm";
import { useSearchParams } from "next/navigation";

const CreateProject: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const projectIdParam = searchParams.get("project_id");
  const initialStep = stepParam ? Number(stepParam) : 1;
  const initialProjectId = projectIdParam ? Number(projectIdParam) : null;

  return (
    <ProjectForm
      mode="create"
      title="Create a new project"
      description="Projects are the unit of work, give your project a unique name and description."
      initialStep={initialStep}
      initialProjectId={initialProjectId}
      onFinished={(projectId) => {
        router.push(`/projects/${projectId}/details`);
      }}
    />
  );
};

export default CreateProject;
