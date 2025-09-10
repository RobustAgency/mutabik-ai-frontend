'use client'
import { Card } from '@/components/ui/card'
import React from 'react'

import PlanCard from '../app/plans/PlanCard'


const Plans = () => {
    return (
        <div>
            <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-0 shadow-none bg-transparent'>
                <PlanCard />
            </Card>
            <div className='flex justify-center'>
            <a href="/dashboard" className='text-center py-5 text-gray-800 hover:text-primary duration-200'>Go to Dashboard (Subscribe later)</a>
            </div>
        </div>
    )
}

export default Plans