import MembersAdd from '@/components/app/projects/MembersAdd'
import React from 'react'

interface PageProps {
  searchParams: { step?: string }; // Next.js automatically pass karega
}

const Page = ({ searchParams }: PageProps) => {
  const step = searchParams.step || "2"; 


  return (
     <div>
      <div className="gap-1 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className='flex flex-col justify-center sm:justify-start'>
          <h1 className="font-sans text-center sm:text-start font-semibold text-xl leading-7 tracking-normal text-[#1D2939]">
            Add members
          </h1>
          <p className="font-sans text-center sm:text-start font-normal text-sm leading-5 tracking-normal text-[#667085]">
           Add member to work on this project and assign their roles. You can always add more members later and change their roles.
          </p>
        </div>
        <p className="font-sans font-medium not-italic text-sm leading-5 tracking-normal">
          Step {step}/3
        </p>
      </div>

      {/* Step value server component se CreateProject ko pass karo */}
      <MembersAdd />
    </div>
  )
}

export default Page
