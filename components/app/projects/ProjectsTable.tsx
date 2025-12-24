"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useGetProjectsQuery, ProjectFilters, Project } from "@/app/lib/features/projectsApi";
import { getGovernancePillarLabel } from "@/utils/governancePillar";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const ProjectsTable: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<ProjectFilters>({});

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 10,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetProjectsQuery(queryParams);

  const projects = data?.data ?? [];
  const pagination = data?.pagination;

  const handleRowClick = (project: Project) => {
    router.push(`/projects/${project.id}/details`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Project
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "governance_pillar",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Pillar
        </div>
      ),
      cell: ({ getValue }) => {
        const pillarValue = getValue() as string;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
            {getGovernancePillarLabel(pillarValue)}
          </div>
        );
      },
    },
    {
      accessorKey: "frameworks",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Frameworks
        </div>
      ),
      cell: ({ row }) => {
        // Handle both frameworks array and single framework
        const frameworks = row.original.frameworks || [];
        const singleFramework = row.original.framework;
        const allFrameworks = frameworks.length > 0 
          ? frameworks 
          : singleFramework 
            ? [singleFramework] 
            : [];
        
        if (allFrameworks.length === 0) {
          return (
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              No frameworks
            </div>
          );
        }
        
        return (
          <div className="flex gap-2">
            {allFrameworks.slice(0, 3).map((framework, idx) => (
              <Image
                key={idx}
                src="/projects/fraemwork-logo.png"
                alt={framework.name}
                width={20}
                height={20}
                className="rounded"
                title={framework.name}
              />
            ))}
            {allFrameworks.length > 3 && (
              <span className="text-xs text-gray-500">+{allFrameworks.length - 3}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "users",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Owner
        </div>
      ),
      cell: ({ row }) => {
        const users = row.original.users || [];
        const owner = users.find(user => user.pivot?.role === 'owner');
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {owner?.name || 'No Owner'}
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Last Modified
        </div>
      ),
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Progress
        </div>
      ),
      cell: ({ getValue }) => {
        const progress = getValue() as number;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
            {progress}%
          </div>
        );
      },
    },
  ];



  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Projects</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Manage and track your governance projects</p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="projects"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as ProjectFilters)}
              />
              <Button
                onClick={() => router.push(`/projects/create?step=${1}`)}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Project
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={projects}
              variant="projects"
              loading={isLoading}
              serverSide={true}
              onRowClick={handleRowClick}
              pagination={
                pagination
                  ? {
                      page: pagination.current_page,
                      limit: pagination.per_page,
                      total: pagination.total,
                      totalPages: pagination.last_page,
                    }
                  : undefined
              }
              onPageChange={handlePageChange}
              emptyState={{
                title: "No projects found",
                description: "Get started by creating your first project",
                action: (
                  <Button
                    onClick={() =>
                      router.push("/projects/create?step=1")
                    }
                  >
                    Create Project
                  </Button>
                ),
              }}
            />
          </Card>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectsTable;

