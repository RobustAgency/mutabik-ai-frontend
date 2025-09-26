import ProjectContainer from "@/components/app/projects/create/projectContainer/ProjectContainer";
import MembersAdd from "@/components/app/projects/create/ProjectMembersTable";
import React from "react";

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
        title="Add members"
        description="Add member to work on this project and assign their roles. You can
            always add more members later and change their roles."
      />
      <MembersAdd />
    </>
  );
};

export default Page;
