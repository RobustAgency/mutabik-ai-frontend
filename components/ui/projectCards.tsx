'use client';

import React from "react";
import { getGovernancePillarLabel } from "@/utils/governancePillar";
import Pagniation from "@/components/custom/Pagniation";
import Image from "next/image";

interface User {
  name: string;
  
}

interface Project {
  id: string | number;
  name: string;
  description: string;
  governance_pillar: string;
  updated_at: string;
  progress: number;
  users?: User[];
  frameworks?: {
    name?: string;
    icon_url?: string;
  }[];
  framework?: {
    name?: string;
    icon_url?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  last_page?: number;
  
}

interface ProjectCardsProps {
  projects: Project[];
  pagination?: Pagination;
  currentPage?: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  onCardClick: (project: Project) => void;
}

interface ProjectCardProps {
  project: Project;
  onCardClick: (project: Project) => void;
}

export default function ProjectCards({
  projects,
  pagination,
  currentPage = 1,
  onPageChange,
  loading = false,
  onCardClick,
}: ProjectCardsProps): React.ReactNode {
  return (
    <>
      <ul
        className="
      grid
      grid-cols-1
      gap-6
      sm:grid-cols-2
      lg:grid-cols-3
      
    "
      >
        {projects.map((project) => {
          return (
            <li key={project.id}>
              <ProjectCard project={project} onCardClick={onCardClick} />
            </li>
          );
        })}
      </ul>

      {pagination && !loading && projects.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagniation 
            pagination={pagination}
            currentPage={currentPage}
            totalPages={pagination.totalPages || pagination.last_page || 0}
            handlePageChange={onPageChange}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}

const ProjectCard = ({ project, onCardClick }: ProjectCardProps): React.ReactNode => {
  const {
    name,
    description,
    governance_pillar: pillar,
    updated_at,
    progress,
    users,
    frameworks,
    framework,
  } = project;
  const allFrameworks = (frameworks && frameworks.length > 0)
    ? frameworks
    : framework
      ? [framework]
      : [];
  const date = new Date(updated_at);

  const handleCardClick = (): void => {
    if (onCardClick) {
      onCardClick(project);
    }
  };

  return (
    <div
      className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between bg-[#F9FAFB] rounded-t-sm p-4 pt-6">
        <div>
          <h3 className="text-base font-semibold text-[#101828] ">{name}</h3>
        </div>
        <span className="rounded-full line-clamp-1 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {getGovernancePillarLabel(pillar)}
        </span>
      </div>

      {/* Description */}
      <div className="p-2">
        <div className="px-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 whitespace-nowrap">
              <span className="text-sm font-semibold">Owner</span>  <br/>
              <span>{users?.[0]?.name || "No Owner"}</span>
            </p>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2 ">{description}</p>

          <div className="mt-3">
            <div className="text-sm font-semibold text-gray-700">Framework</div>
            <div className="mt-2 flex items-center gap-2">
              {allFrameworks.length === 0 ? (
                <span className="text-sm text-gray-500">No frameworks</span>
              ) : (
                <>
                  {allFrameworks.slice(0, 3).map((fw: any, idx: number) => (
                    <Image
                      key={idx}
                      src={fw?.icon_url || "/projects/fraemwork-logo.png"}
                      alt={fw?.name || `framework-${idx}`}
                      width={18}
                      height={18}
                      className="rounded"
                      title={fw?.name}
                    />
                  ))}
                  {allFrameworks.length > 3 && (
                    <span className="text-xs text-gray-500">+{allFrameworks.length - 3}</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Dates */}
      <div className="mt-4 text-sm px-3">
        <div className="w-full">
          <strong className="text-gray-700  text-sm font-semibold">Latest Performance Date</strong>
          <p className="text-gray-600">{date.toLocaleDateString()}</p>
        </div>
        {/* <div>
          <p className="text-gray-500">2025-03-02</p>
          <p className="text-xs text-gray-400">Next Review Date</p>
        </div> */}
      </div>

      {/* Progress */}
      <div className="mt-4 px-3">
        <div className="flex items-center justify-between text-sm">
          <p className="">COMPLETENESS SCORE</p>
          <p className="font-medium text-gray-700">{progress}%</p>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-center px-3 pb-3">
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="rounded-sm border w-full border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View Project
        </button>
      </div>
      </div>
    
  );
};
