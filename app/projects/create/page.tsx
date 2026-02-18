import ProjectContainer from "@/components/app/projects/create/projectContainer/ProjectContainer";
import React from "react";
import CreateProject from "@/components/app/projects/create/CreateProject";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface PageProps {
  searchParams: Promise<{ step?: string; project_id?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const step = params.step ? Number(params.step) : 1;

  return (
    <PermissionPage permission={PERMISSIONS.PROJECTS_CREATE}>
      <ProjectContainer
        step={step}
        title="Create a new project"
        description="Projects are the unit of work, give your project a unique name and description."
      />
      <CreateProject />
    </PermissionPage>
  );
};

export default Page;
