import React from 'react'
import Metrics from './Metrics'
import { SlidersHorizontal, SquareCheck } from 'lucide-react'
import { Project } from '@/app/lib/features/projectsApi';

interface RequirementsAndControlsMetrics {
    project: Project;
}

const RequirementsAndControlsMetrics = ({ project }: RequirementsAndControlsMetrics) => {
    return (
        <div className="w-full flex-wrap  flex  gap-4 justify-start">
            <Metrics
                icon={<SquareCheck />}
                label="Requirements"
                value={project.total_requirements || 0}
            />
            <Metrics
                icon={<SlidersHorizontal />}
                label="Controls"
                value={project.total_controls || 0}
            />
        </div>
    )
}

export default RequirementsAndControlsMetrics