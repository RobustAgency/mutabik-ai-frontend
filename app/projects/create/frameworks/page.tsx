import ProjectContainer from "@/components/app/projects/create/projectContainer/ProjectContainer";
import React from "react";
import ChooseFrameworks from "@/components/app/projects/create/ChooseFrameworks";

interface PageProps {
  searchParams: Promise<{ step?: string }>; // Next.js automatically pass karega
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  // string ko number me convert kar liya
  const step = params.step ? Number(params.step) : 2;

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
