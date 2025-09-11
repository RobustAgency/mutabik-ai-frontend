import React from "react";
import Overview from "./Overview";
import Guidance from "./Guidance";
import Associations from "./Associations";

interface ControlsDetailsProps {
  controlId: string;
}

const ControlsDetails = ({ controlId }: ControlsDetailsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Overview controlId={controlId} />
        <Guidance controlId={controlId} />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1">
        <Associations controlId={controlId} />
      </div>
    </div>
  );
};

export default ControlsDetails;
