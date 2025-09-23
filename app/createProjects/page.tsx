import CreateProject from '@/components/app/projects/CreateProject'
import React from 'react'

const page = () => {
  return (
    <div>
        <div className='gap-1 mb-6'>
            <h1 className="font-sans font-semibold text-xl leading-7 tracking-normal text-[#1D2939]">Create a new project</h1>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Projects are the unit of work, give your project a unique name and description.</p>
        </div>

      <CreateProject />
    </div>
  )
}

export default page
