import ChooseFrameworks from '@/components/app/projects/ChooseFrameworks'
import React from 'react'

interface PageProps {
  searchParams: { step?: string }; // Next.js automatically pass karega
}

const page = ({ searchParams }: PageProps) => {
    const step = searchParams.step || "3"; 
    console.log(step)
  return (
    <div>
        <div className="gap-1 mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className='flex flex-col justify-center sm:justify-start'>
          <h1 className="font-sans text-center sm:text-start font-semibold text-xl leading-7 tracking-normal text-[#1D2939]">
            Choose frameworks
          </h1>
          <p className="font-sans text-center sm:text-start font-normal text-sm leading-5 tracking-normal text-[#667085]">
           In order to be compliant, choose the frameworks suitable for your project.
          </p>
        </div>
        <p className="font-sans font-medium not-italic text-sm leading-5 tracking-normal">
          Step {step}/3
        </p>
      </div>
      <ChooseFrameworks />
    </div>
  )
}

export default page
