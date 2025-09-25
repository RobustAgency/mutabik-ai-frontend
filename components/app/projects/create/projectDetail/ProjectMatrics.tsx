import React from "react";
import Matrics from "./Matrics";
import { Brain, Users, TriangleAlert, CircleCheckBig } from "lucide-react";

const ProjectMatrices = () => {
  return (
    <div className="w-full flex flex-wrap gap-4 justify-start">
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
        icon={<CircleCheckBig className="w-6 h-6 text-[#344054]" />}
        label="Pending Approvals"
        value="2"
      />
    </div>

  );
};

export default ProjectMatrices;
