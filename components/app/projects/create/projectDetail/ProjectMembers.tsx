import React from 'react'
import Members from './Members';
import { Button } from '@/components/ui/button';
import { Project } from '@/service/app/projects';

interface ProjectMembersProps {
  project: Project;
}

const ProjectMembers = ({ project }: ProjectMembersProps) => {
  return (
    <div className='flex flex-col gap-2.5'>
      <div className="flex justify-between items-center">
        <p className="font-sans font-semibold text-lg leading-7 tracking-normal text-[#1D2939]">
          Project Members ({project.users?.length || 0})
        </p>
        <Button className="w-[76px] h-[36px] px-3 py-2 gap-2 rounded-lg border border-[#D0D5DD] opacity-100 bg-[#FFFFFF] font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] hover:bg-gray-100">
          Manage
        </Button>
      </div>
      {project.users && project.users.length > 0 ? (
        project.users.map((user) => (
          <Members
            key={user.id}
            name={user.name}
            email={user.email}
            role={user.pivot?.role || user.role || 'Member'}
          />
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>No members found</p>
        </div>
      )}
    </div>
  )
}

export default ProjectMembers
