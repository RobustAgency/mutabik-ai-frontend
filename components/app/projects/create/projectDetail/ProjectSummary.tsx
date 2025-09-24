"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Type for project details
interface ProjectDetail {
  label: string;
  value: string;
}

const projectDetails: ProjectDetail[] = [
  { label: "ID", value: "30029" },
  { label: "Pillar", value: "AI Governance" },
  { label: "Owner", value: "Ahmad Raza" },
  { label: "My Role", value: "Reviewer" },
  { label: "Created", value: "2025-06-01 11:34" },
  { label: "Last Activity", value: "2025-08-22 10:22" },
];

// Reusable component
const DetailItem: React.FC<ProjectDetail> = ({ label, value }) => (
  <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
    <p className="font-sans font-normal text-sm leading-5 text-[#667085]">{label}</p>
    <p className="font-sans font-semibold text-base leading-6 text-[#344054]">{value}</p>
  </div>
);

const ProjectDetailCard: React.FC = () => {
  return (
    <div className="">
      <Card className="w-full rounded-2xl p-0 border border-[#E4E7EC] bg-white gap-0">
        <CardHeader className="flex items-center border-b border-[#E4E7EC] px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-base sm:text-lg font-medium">
            Project Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-4 justify-between">
            {projectDetails.map((detail) => (
              <DetailItem
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>
            
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailCard;
