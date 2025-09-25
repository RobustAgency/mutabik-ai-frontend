import React from "react";
import Matrics from "./Matrics";
import { Brain,  Users, TriangleAlert, CircleCheckBig } from "lucide-react";

const ProjectMatrices = () => {
  return (
    <>
      <Matrics
      icon={<Brain className="w-6 h-6 text-[#344054]" />}
      label="AI Models"
      value="4"
    />
    <Matrics
      icon={<Users className="w-6 h-6 text-[#344054]" />}
      label="Use Cases"
      value="9"
    />
    <Matrics
      icon={< TriangleAlert className="w-6 h-6 text-[#344054]" />}
      label="Open Incidents"
      value="5"
    />
    <Matrics
      icon={<CircleCheckBig  className="w-6 h-6 text-[#344054]" />}
      label="Pending Approvals"
      value="2"
    />
    </>
  
  );
};

export default ProjectMatrices;
