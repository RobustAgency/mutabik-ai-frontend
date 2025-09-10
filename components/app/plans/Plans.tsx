'use client'
import { Card } from '@/components/ui/card'
import React from 'react'

import PlanCard from './PlanCard'


const Plans = () => {
    return (
        <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-0 shadow-none bg-transparent'>
            <PlanCard />
        </Card>
    )
}

export default Plans