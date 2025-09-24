import React from "react";

interface ProjectContainerProps {
  step?: number; // required prop
  title: string
  description: string
}

const ProjectContainer = ({ step, title, description }: ProjectContainerProps) => {
  return (
    <div>
      <div className="gap-1 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col justify-center sm:justify-start">
          <h1 className="font-sans text-center sm:text-start font-semibold text-xl leading-7 tracking-normal text-[#1D2939]">
            {title}
          </h1>
          <p className="font-sans text-center sm:text-start font-normal text-sm leading-5 tracking-normal text-[#667085]">
           {description}
          </p>
        </div>
        {step &&  <p className="font-sans font-medium not-italic text-sm leading-5 tracking-normal">
          Step {step}/3
        </p> }
       
      </div>

      {/* Step value server component se CreateProject ko pass karo */}
      
    </div>
  );
};

export default ProjectContainer;
