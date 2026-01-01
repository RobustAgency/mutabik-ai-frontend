"use client";

import React, { useMemo } from "react";
import type { FrameworkRequirement, FrameworkControl } from "@/app/lib/features/projectsApi";
import { SlidersHorizontal } from "lucide-react";

interface ControlsListProps {
  requirements?: FrameworkRequirement[];
}

export const ControlsList: React.FC<ControlsListProps> = ({
  requirements,
}) => {
  // Extract all controls from all requirements
  const allControls = useMemo(() => {
    if (!requirements || !Array.isArray(requirements)) {
      return [];
    }

    const controls: FrameworkControl[] = [];
    requirements.forEach((req) => {
      if (req.controls && Array.isArray(req.controls)) {
        controls.push(...req.controls);
      }
    });

    // Remove duplicates by id
    return Array.from(
      new Map(controls.map((ctrl) => [ctrl.id, ctrl])).values()
    );
  }, [requirements]);

  if (allControls.length === 0) {
    return (
      <div className="text-sm text-[#667085] py-4">
        No controls found in this framework.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allControls.map((control) => (
        <div
          key={control.id}
          className="flex items-start justify-between p-3 rounded-lg border border-[#E4E7EC] bg-white hover:bg-[#F9FAFB] transition-colors"
        >
          <div className="flex items-start gap-3 flex-1">
            <SlidersHorizontal className="w-5 h-5 text-[#667085] mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1D2939]">
                {control.reference || `Control #${control.id}`}
                {control.name && (
                  <span className="text-[#667085] ml-2">- {control.name}</span>
                )}
              </div>
              {control.objective && (
                <div className="text-xs text-[#667085] mt-1 line-clamp-2">
                  {control.objective}
                </div>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-[#667085]">
                {control.testing_method && (
                  <span>Method: {control.testing_method}</span>
                )}
                {control.testing_frequency && (
                  <span>Frequency: {control.testing_frequency}</span>
                )}
                {control.status && (
                  <span className="capitalize">Status: {control.status}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};