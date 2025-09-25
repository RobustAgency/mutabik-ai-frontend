import ProjectContainer from "@/components/app/projects/create/projectContainer/ProjectContainer";
import React from "react";
import ChooseFrameworks from "@/components/app/projects/create/ChooseFrameworks";

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
        title="Choose frameworks"
        description="In order to be compliant, choose the frameworks suitable for your project."
      />
      <ChooseFrameworks />
    </>
  );
};

export default Page;
