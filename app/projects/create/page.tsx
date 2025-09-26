import ProjectContainer from "@/components/app/projects/create/projectContainer/ProjectContainer";

import React from "react";
import CreateProject from "@/components/app/projects/create/CreateProject";

interface PageProps {
  searchParams: { step?: string }; // Next.js automatically pass karega
}

const Page = ({ searchParams }: PageProps) => {
  // string ko number me convert kar liya
  const step = searchParams.step ? Number(searchParams.step) : 2;

  return (
    <>
      <ProjectContainer
        step={step}
        title="Create a new project"
        description="Projects are the unit of work, give your project a unique name and description."
      />
      <CreateProject />
    </>
  );
};

export default Page;
