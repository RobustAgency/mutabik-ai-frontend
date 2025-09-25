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

// ✅ dummy data outside component
const dummyProjects: ProjectData[] = [
  {
    id: 1,
    name: "AI Credit Risk Scoring",
    pillar: "AI Governance",
    frameworks: ["/projects/image-9.png", "/projects/image-10.png"],
    owner: "John Doe",
    lastModified: "2025-09-01",
    progress: "65%",
  },
  {
    id: 2,
    name: "Customer Data Platform",
    pillar: "Data Governance",
   frameworks: ["/projects/image-9.png", "/projects/image-10.png"],
    owner: "Jane Smith",
    lastModified: "2025-09-10",
    progress: "45%",
  },
  {
    id: 3,
    name: "Privacy Compliance Tool",
    pillar: "Privacy/PDPL",
    frameworks: ["/projects/image-9.png", "/projects/image-10.png"],
    owner: "Michael Lee",
    lastModified: "2025-09-15",
    progress: "80%",
  },
];

const AllProjectsTable: React.FC = () => {
  const tabsData: TabData[] = [
    { value: "all", label: "All Projects" },
    { value: "ai", label: "AI Governance" },
    { value: "data", label: "Data Governance" },
    { value: "privacy", label: "Privacy/PDPL" },
  ];

  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [projects, setProjects] = React.useState<ProjectData[]>([]);

  const router = useRouter();

  const columns: ColumnDef<ProjectData>[] = [
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
            className={`font-sans font-medium text-sm leading-5 tracking-normal  `}
          >
            {getValue() as string}
          </div>
        );
      },
    },
    {
      accessorKey: "pillar",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Pillar
        </div>
      ),
      cell: ({ getValue }) => {
        return (
          <div
            className={`font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]   py-1 rounded `}
          >
            {getValue() as string}
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
      cell: ({ getValue }) => {
        const frameworks = getValue() as string[];
        return (
          <div className="flex gap-2">
            {frameworks.map((src, idx) => (
              <Image
              key={idx} 
                src={src} 
                alt="React Logo"
                width={20} 
                height={20} 
                className="rounded"
              />
            ))}
          </div>
        );
      },
    },

    {
      accessorKey: "owner",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Owner
        </div>
      ),
      cell: ({ getValue }) => {
        return (
          <div
            className={`font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]   py-1 rounded `}
          >
            {getValue() as string}
          </div>
        );
      },
    },
    {
      accessorKey: "lastModified",
      header: () => (
        <div className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]  py-1 rounded">
          Last Modified
        </div>
      ),
      cell: ({ getValue }) => {
        return (
          <div
            className={`font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]   py-1 rounded `}
          >
            {getValue() as string}
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

  // ✅ Data filter function
  const fetchProjects = React.useCallback((tab: string) => {
    if (tab === "all") return dummyProjects;
    if (tab === "ai")
      return dummyProjects.filter((p) => p.pillar === "AI Governance");
    if (tab === "data")
      return dummyProjects.filter((p) => p.pillar === "Data Governance");
    if (tab === "privacy")
      return dummyProjects.filter((p) => p.pillar === "Privacy/PDPL");
    return [];
  }, []);


  React.useEffect(() => {
    setProjects(fetchProjects(activeTab));
  }, [activeTab, fetchProjects]);

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
          />
        </Card>
      </CardContent>
    </Card>
  );
};

export default AllProjectsTable;
