'use client'

import React, { useMemo } from 'react'
import { DataTable } from '@/components/custom/DataTable'
import { columns } from './projectColumns'
import TableCard from '@/components/custom/TableCard'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'


const ProjectsTable = () => {

     const projects = [
        {
            id: 1,
            date: "May 1, 2023",
            title: "Project 1",
            status: "In Progress",
            actions:"Open"
        },
        {
            id: 2,
            date: "April 28, 2023",
            title: "Project 2",
            status: "Completed",
            actions: "Open"
        },
        {
            id: 3,
            date: "April 27, 2023",
            title: "Project 3",
            status: "Pending",
            actions: "Open"
        },
    ]

    // const columns = useMemo(() => createColumns(handleRefresh))


    return (
        <TableCard title="Latest Projects"  >
            <DataTable
                columns={columns}
                data={projects}
                serverSide={false}
            />
        </TableCard>
    )
}

export default ProjectsTable
