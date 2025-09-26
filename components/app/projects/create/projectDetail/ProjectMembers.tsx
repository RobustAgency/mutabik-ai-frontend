import React from 'react'
import Members from './Members';
import { Button } from '@/components/ui/button';

const ProjectMembers = () => {
  return (
    <div className='flex flex-col gap-2.5'>
        <div className="flex justify-between items-center">
            <p className="font-sans font-semibold text-lg leading-7 tracking-normal text-[#1D2939]">
              Project Members
            </p>
            <Button className="w-[76px] h-[36px] px-3 py-2 gap-2 rounded-lg border border-[#D0D5DD] opacity-100 bg-[#FFFFFF] font-sans font-medium text-sm leading-5 tracking-normal text-[#344054] hover:bg-gray-100">
              Manage
            </Button>
          </div>
      <Members name="Ahmad" email="ahmadraza@gmail.com" role="Owner" />
      <Members name="Ahmad" email="ahmadraza@gmail.com" role="Owner" />
      <Members name="Ahmad" email="ahmadraza@gmail.com" role="Owner" />
      <Members name="Ahmad" email="ahmadraza@gmail.com" role="Owner" />
      <Members name="Ahmad" email="ahmadraza@gmail.com" role="Owner" />
    </div>
  )
}

export default ProjectMembers
