"use client"
import React from 'react'
import ContainerCard from '@/components/custom/ContainerCard'
import Greetings from '@/components/app/dashboard/Greetings'
import { Card } from '@/components/ui/card';



const DashboardPage = () => {
    return (
        <div className="w-full h-[70svh] flex flex-col relative">
            <div className="absolute w-full h-full inset-0 blur-md bg-opacity-50 bg-red z-50">

                <div className="w-full px-6 py-4">
                    <Greetings />
                </div>
            </div>
            <div className='absolute w-full h-full inset-0 flex items-center justify-center'>
                <Card className='p-6'>
                    <h2 className='text-2xl font-bold'>
                        Dashboard is in progress....
                    </h2>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage