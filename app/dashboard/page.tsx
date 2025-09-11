"use client"
import React from 'react'
import ContainerCard from '@/components/custom/ContainerCard'
import Greetings from '@/components/app/dashboard/Greetings'

export const runtime = 'edge';

const DashboardPage = () => {
    return (
        <ContainerCard
            title="Dashboard"
            description="Welcome to your dashboard"
        >
            <Greetings />
        </ContainerCard>
    )
}

export default DashboardPage