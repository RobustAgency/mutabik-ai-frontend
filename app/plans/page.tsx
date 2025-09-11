export const runtime = 'edge';

import React from 'react'
import ContainerCard from '@/components/custom/ContainerCard'
import Plans from '@/components/app/plans/Plans'

const PlansPage = () => {

    return (
        <ContainerCard
            title="Plans & Billing"
            description="Choose the perfect plan for your needs"
        
        >
            <Plans />
        </ContainerCard>

    )
}

export default PlansPage