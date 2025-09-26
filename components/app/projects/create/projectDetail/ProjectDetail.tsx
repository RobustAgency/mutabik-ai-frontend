"use client";

import React from "react";
import ProjectSummary from "@/components/app/projects/create/projectDetail/ProjectSummary";
import ProjectAlert from "./ProjectAlert";
import ProjectMatrices from "./ProjectMatrics";
import ProjectProgress from "./ProjectProgress";

import { SquareCheck } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";

import ProjectMembers from "./ProjectMembers";
import Matrics from "./Matrics";
import ProjectChart from "./ProjectChart";

const ProjectDetails = () => {
  return (
    <div className="space-y-6">
      <ProjectAlert />
      <ProjectSummary />
      <ProjectMatrices />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" col-span-1 w-full flex flex-col gap-6">
          <ProjectProgress progress={75} />
          <div className="w-full flex-wrap  flex  gap-4 justify-start">
            <Matrics icon={<SquareCheck />} label="Requirements" value={37} />
            <Matrics icon={<SlidersHorizontal />} label="Controls" value={59} />
          </div>
        </div>
        <div className="col-span-1">
          <ProjectMembers />
        </div>
      </div>
      <ProjectChart />
    </div>
  );
};

export default ProjectDetails;
