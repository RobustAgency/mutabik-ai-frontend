import CreateProject from "@/components/app/projects/CreateProject";
import React from "react";

interface PageProps {
  searchParams: { step?: string }; // Next.js automatically pass karega
}

const Page = ({ searchParams }: PageProps) => {
  const step = searchParams.step || "1"; 

  return (
    <div>
      <div className="gap-1 mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-sans font-semibold text-xl leading-7 tracking-normal text-[#1D2939]">
            Create a new project
          </h1>
          <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            Projects are the unit of work, give your project a unique name and
            description.
          </p>
        </div>
        <p className="font-sans font-medium not-italic text-sm leading-5 tracking-normal">
          Step {step}/3
        </p>
      </div>

      {/* Step value server component se CreateProject ko pass karo */}
      <CreateProject />
    </div>
  );
};

export default Page;
