"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useFrameworks } from "@/hooks/app/useFrameworks";
import { useProjects } from "@/hooks/app/useProjects";

const ChooseFrameworks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [selectedFramework, setSelectedFramework] = useState<number | null>(null);
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  const { frameworks, loading: frameworksLoading, fetchFrameworks } = useFrameworks();
  console.log("🚀 ~ ChooseFrameworks ~ frameworks:", frameworks)
  const { addFrameworks, loading: projectLoading } = useProjects();

  useEffect(() => {
    fetchFrameworks();
  }, [fetchFrameworks]);

  // Toggle selection (only one at a time)
  const toggleFramework = (id: number) => {
    setSelectedFramework((prev) => (prev === id ? null : id));
  };

  // Toggle details expand (only one open at a time)
  const toggleDetails = (id: number) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  // Handle creating project with frameworks
  const handleCreateProject = async () => {
    if (!projectId || !selectedFramework) {
      console.error('Project ID and selected framework is required');
      return;
    }

    const success = await addFrameworks(parseInt(projectId), {
      framework_id: selectedFramework.toString()
    });

    if (success) {
      router.push(`/projects/${projectId}/details`);
    }
  };

  return (
    <div className="px-4 sm:px-0 lg:px-0 py-6">
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
                const isSelected = selectedFramework === framework.id;
                const isOpen = openCardId === framework.id;

                return (
                  <Card
                    key={framework.id}
                    className={`py-0 gap-0 relative min-h-[315px] flex flex-col rounded-2xl transition-all duration-200 ${isSelected
                      ? "border-[3px] border-[#4FD58F] shadow-md"
                      : "border border-[#E4E7EC]"
                      }`}
                  >
                    {/* Selected Badge */}
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
                          src={framework.media?.[0]?.original_url || "/projects/fraemwork-logo.png"}
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
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleFramework(framework.id)}
                        className="w-5 h-5 rounded-[6px] border border-[#D0D5DD]"
                      />
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <div
                        className="text-sm text-[#344054] mb-4 line-clamp-3 min-h-10"
                        dangerouslySetInnerHTML={{
                          __html: framework.description || 'No description available'
                        }}
                      />

                      {/* Show Additional Details Toggle */}
                      <button
                        onClick={() => toggleDetails(framework.id)}
                        className="cursor-pointer flex items-center justify-between w-full text-xs font-medium uppercase text-gray-400"
                      >
                        {isOpen ? "Hide Additional Details" : "Show Additional Details"}
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {/* Expanded Details */}
                      {isOpen && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">Type:</span>
                            <span className="text-[#667085]">{framework.type || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">Category:</span>
                            <span className="text-[#667085]">{framework.category || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">Geography:</span>
                            <span className="text-[#667085]">{framework.geography || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">Authority/Publisher:</span>
                            <span className="text-[#667085]">{framework.authority_publisher || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">Version:</span>
                            <span className="text-[#667085]">{framework.version || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 pb-1">
                            <span className="font-medium text-[#344054]">Binding Level:</span>
                            <span className="text-[#667085]">{framework.binding_level || 'N/A'}</span>
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                        <div className="flex items-center gap-2">
                          <Image src="/projects/Frame-1.png" alt="Requirements" width={37} height={37} />
                          <div>
                            <p className="text-lg font-medium text-[#667085]">{framework.requirements_count || 0}</p>
                            <p className="text-xs text-[#667085]">Requirements</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image src="/projects/Frame-2.png" alt="Controls" width={37} height={37} />
                          <div>
                            <p className="text-lg font-medium text-[#667085]">{framework.controls_count || 0}</p>
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

      {/* Footer Button */}
      <div className="flex justify-end w-full mt-6">
        <Button
          onClick={handleCreateProject}
          disabled={projectLoading || !selectedFramework}
          className="h-11 border border-[#4FD58F] bg-[#4FD58F] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {projectLoading ? 'Adding Frameworks...' : 'Create Project'}
        </Button>
      </div>
    </div>
  );
};

export default ChooseFrameworks;
