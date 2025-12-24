"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useFrameworks } from "@/hooks/app/useFrameworks";

interface FrameworksStepProps {
  selectedFrameworkId: number | null;
  onSelectFramework: (id: number | null) => void;
}

export const FrameworksStep: React.FC<FrameworksStepProps> = ({
  selectedFrameworkId,
  onSelectFramework,
}) => {
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const { frameworks, loading: frameworksLoading, fetchFrameworks } =
    useFrameworks();

  useEffect(() => {
    fetchFrameworks();
  }, [fetchFrameworks]);

  const toggleDetails = (id: number) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="px-0 py-2">
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white">
        <CardHeader className="flex justify-end border-b border-[#E4E7EC] px-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 h-11 border border-[#D0D5DD] bg-[#F9FAFB] text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {frameworksLoading && (
            <div className="flex justify-center py-8">
              <div className="text-sm text-gray-500">Loading frameworks...</div>
            </div>
          )}

          {!frameworksLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {frameworks.map((framework) => {
                const isSelected = selectedFrameworkId === framework.id;
                const isOpen = openCardId === framework.id;

                return (
                  <Card
                    key={framework.id}
                    className={`py-0 gap-0 relative min-h-[315px] flex flex-col rounded-2xl transition-all duration-200 ${
                      isSelected
                        ? "border-[3px] border-[#4FD58F] shadow-md"
                        : "border border-[#E4E7EC]"
                    }`}
                    onClick={() =>
                      onSelectFramework(
                        isSelected ? null : (framework.id as number),
                      )
                    }
                  >
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 border border-[#4FD58F] bg-[#4FD58F] px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="font-sans font-medium text-sm text-white">
                          Selected
                        </span>
                      </div>
                    )}

                    <CardHeader className="bg-[#F8FAFB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border-b rounded-tl-2xl rounded-tr-2xl">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            framework.media?.[0]?.original_url ||
                            "/projects/fraemwork-logo.png"
                          }
                          alt={`${framework.name} logo`}
                          width={50}
                          height={50}
                        />
                        <div>
                          <CardTitle className="font-bold text-lg text-[#1D2939]">
                            {framework.name}
                          </CardTitle>
                          <span className="text-sm text-[#98A2B3]">
                            {framework.geography} · {framework.type}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <div
                        className="text-sm text-[#344054] mb-4 line-clamp-3 min-h-10"
                        dangerouslySetInnerHTML={{
                          __html:
                            framework.description || "No description available",
                        }}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDetails(framework.id);
                        }}
                        className="cursor-pointer flex items-center justify-between w-full text-xs font-medium uppercase text-gray-400"
                      >
                        {isOpen ? "Hide Additional Details" : "Show Additional Details"}
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">
                              Type:
                            </span>
                            <span className="text-[#667085]">
                              {framework.type || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">
                              Category:
                            </span>
                            <span className="text-[#667085]">
                              {framework.category || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">
                              Geography:
                            </span>
                            <span className="text-[#667085]">
                              {framework.geography || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">
                              Authority/Publisher:
                            </span>
                            <span className="text-[#667085]">
                              {framework.authority_publisher || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">
                              Version:
                            </span>
                            <span className="text-[#667085]">
                              {framework.version || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">
                              Binding Level:
                            </span>
                            <span className="text-[#667085]">
                              {framework.binding_level || "N/A"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/projects/Frame-1.png"
                            alt="Requirements"
                            width={37}
                            height={37}
                          />
                          <div>
                            <p className="text-lg font-medium text-[#667085]">
                              {framework.requirements_count || 0}
                            </p>
                            <p className="text-xs text-[#667085]">
                              Requirements
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/projects/Frame-2.png"
                            alt="Controls"
                            width={37}
                            height={37}
                          />
                          <div>
                            <p className="text-lg font-medium text-[#667085]">
                              {framework.controls_count || 0}
                            </p>
                            <p className="text-xs text-[#667085]">Controls</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


