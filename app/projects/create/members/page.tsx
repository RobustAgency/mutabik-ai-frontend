

import ProjectContainer from "@/components/app/projects/create/projectContainer/ProjectContainer";
import MembersAdd from "@/components/app/projects/create/ProjectMembersTable";
import React from "react";

interface PageProps {
  searchParams: Promise<{ step?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const step = params.step ? Number(params.step) : 3;

  return (
    <>
      <ProjectContainer
        step={step}
        title="Add members"
        description="Add member to work on this project and assign their roles. You can
            always add more members later and change their roles."
      />
      <MembersAdd />
    </>
  );
};

export default Page;
