import React from 'react'

interface ContainerCardProps {
    children: React.ReactNode
    title: string
    description: string
}

const ContainerCard = ({ children, title, description }: ContainerCardProps) => {
    return (
        <div className="container mx-auto">
            <div className="mb-16">
                <h1 className="text-3xl font-bold text-[#1D2939] mb-2">{title}</h1>
                <p className="text-[#667085]">{description}</p>
            </div>
            <div className="mb-12">
                {children}
            </div>
        </div>
    )
}

export default ContainerCard