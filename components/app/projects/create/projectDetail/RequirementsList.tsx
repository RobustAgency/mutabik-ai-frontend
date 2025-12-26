"use client";

import React from "react";
import type { FrameworkRequirement } from "@/app/lib/features/projectsApi";
import { FileCheck } from "lucide-react";

interface RequirementsListProps {
  requirements?: FrameworkRequirement[];
}

export const RequirementsList: React.FC<RequirementsListProps> = ({
  requirements,
}) => {
  if (!requirements || requirements.length === 0) {
    return (
      <div className="text-sm text-[#667085] py-4">
        No requirements found in this framework.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requirements.map((requirement) => (
        <div
          key={requirement.id}
          className="flex items-start justify-between p-3 rounded-lg border border-[#E4E7EC] bg-white hover:bg-[#F9FAFB] transition-colors"
        >
          <div className="flex items-start gap-3 flex-1">
            <FileCheck className="w-5 h-5 text-[#667085] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1D2939]">
                {requirement.reference || `Requirement #${requirement.id}`}
              </div>
              {requirement.requirement_text && (
                <div className="text-xs text-[#667085] mt-1 line-clamp-2">
                  {requirement.requirement_text}
                </div>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-[#667085]">
                {requirement.category && (
                  <span>Category: {requirement.category}</span>
                )}
                {requirement.priority && (
                  <span>Priority: {requirement.priority}</span>
                )}
                {requirement.controls && Array.isArray(requirement.controls) && (
                  <span>Controls: {requirement.controls.length}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
