import React from 'react'

interface ContainerCardProps {
    children: React.ReactNode
    title: string
    description: string
}

const ContainerCard = ({ children, title, description }: ContainerCardProps) => {
    return (
        <div className='px-6'>
            <div className="mb-8 md:mb-16">
                <h1 className=" text-xl md:text-3xl font-bold text-[#1D2939] mb-2">{title}</h1>
                <p className="text-[#667085] text-sm">{description}</p>
            </div>
            <div className="mb-12">
                {children}
            </div>
        </div>
    )
}

export default ContainerCard