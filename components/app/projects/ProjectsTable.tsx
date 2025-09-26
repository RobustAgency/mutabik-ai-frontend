"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Tab from "@/components/app/projects/Tab"
import Image from "next/image";
import { useProjects } from "@/hooks/app/useProjects";
import { Project } from "@/service/app/projects";
import { getGovernancePillarLabel, GovernancePillar } from "@/utils/governancePillar";

interface TabData {
  value: string;
  label: string;
}

export interface ProjectData {
  id: number;
  name: string;
  pillar: string;
  frameworks: string[];
  owner: string;
  lastModified: string;
  progress: string;
}

const ProjectsTable: React.FC = () => {
  const tabsData: TabData[] = [
    { value: "all", label: "All Projects" },
    { value: "ai", label: "AI Governance" },
    { value: "data", label: "Data Governance" },
    { value: "privacy", label: "Privacy/PDPL" },
  ];

  const [activeTab, setActiveTab] = React.useState<string>("all");
  const router = useRouter();

  const { projects, loading, fetchProjects } = useProjects();

  React.useEffect(() => {
    const pillar = getGovernancePillarFromTab(activeTab);
    const filters = activeTab === "all" ? {} : pillar ? { governance_pillar: pillar } : {};
    fetchProjects(filters);
  }, [activeTab, fetchProjects]);

  const getGovernancePillarFromTab = (tab: string): GovernancePillar | undefined => {
    switch (tab) {
      case "ai":
        return GovernancePillar.AI_GOVERNANCE;
      case "data":
        return GovernancePillar.DATA_GOVERNANCE;
      case "privacy":
        return GovernancePillar.PRIVACY_PDPL;
      default:
        return undefined;
    }
  };

  const handleRowClick = (project: Project) => {
    router.push(`/projects/${project.id}/details`);
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085] px-0  py-1 rounded">
          Project
        </div>
      ),
      cell: ({ getValue }) => {
        return (
          <div
            className={`pl-4 font-sans font-medium text-sm leading-5 tracking-normal  `}
          >
            {getValue() as string}
          </div>
        );
      },
    },
    {
      accessorKey: "governance_pillar",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Pillar
        </div>
      ),
      cell: ({ getValue }) => {
        const pillarValue = getValue() as string;
        return (
          <div
            className={`font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]   py-1 rounded `}
          >
            {getGovernancePillarLabel(pillarValue)}
          </div>
        );
      },
    },
    {
      accessorKey: "frameworks",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085] py-1">
          Frameworks
        </div>
      ),
      cell: ({ row }) => {
        const frameworks = row.original.frameworks || [];
        return (
          <div className="flex gap-2">
            {frameworks.slice(0, 3).map((framework, idx) => (
              <Image
                key={idx}
                src="/projects/fraemwork-logo.png" // Default framework logo
                alt={framework.name}
                width={20}
                height={20}
                className="rounded"
                title={framework.name}
              />
            ))}
            {frameworks.length > 3 && (
              <span className="text-xs text-gray-500">+{frameworks.length - 3}</span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "users",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Owner
        </div>
      ),
      cell: ({ row }) => {
        const users = row.original.users || [];
        const owner = users.find(user => user.pivot?.role === 'owner');
        return (
          <div
            className={`font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]   py-1 rounded `}
          >
            {owner?.name || 'No Owner'}
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Last Modified
        </div>
      ),
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <div
            className={`font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]   py-1 rounded `}
          >
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Progress
        </div>
      ),
      cell: ({ getValue }) => {
        return (
          <div
            className={`w-[38px] h-[22px] opacity-100 rounded-full py-[2px] px-2 font-sans font-medium text-xs leading-4 tracking-normal text-center bg-[#ECF3FF] text-[#465FFF]`}
          >
            {getValue() as string}
          </div>
        );
      },
    },
  ];



  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Tab tabsData={tabsData} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-[44px] border border-[#D0D5DD] bg-[#F9FAFB] text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
            <Button
              onClick={() => router.push(`/projects/create?step=${1}`)}
              className="h-[44px] border border-[#4FD58F] bg-[#4FD58F] text-white cursor-pointer"
            >
              Create Project
            </Button>
          </div>
        </div>
        <Card className="bg-white w-full rounded-xl border-0 py-0">
          <DataTable
            columns={columns}
            data={projects}
            serverSide
            variant="projects"
            onRowClick={handleRowClick}
          />
          {loading && (
            <div className="flex justify-center py-8">
              <div className="text-sm text-gray-500">Loading projects...</div>
            </div>
          )}
        </Card>
      </CardContent>
    </Card>
  );
};

export default ProjectsTable;
