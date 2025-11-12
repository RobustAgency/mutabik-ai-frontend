"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAiModelVersion } from "@/hooks/app/useAiModelVersions";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
import VersionHeader from "./sections/VersionHeader";
import StatusCards from "./sections/StatusCards";
import BasicInfo from "./sections/BasicInfo";
import TechnicalDetails from "./sections/TechnicalDetails";
import DeploymentInfo from "./sections/DeploymentInfo";
import ReleaseNotes from "./sections/ReleaseNotes";
import QuickActions from "./sections/QuickActions";
import Metadata from "./sections/Metadata";

interface AiModelVersionDetailsProps {
    versionId: number;
}

const AiModelVersionDetails: React.FC<AiModelVersionDetailsProps> = ({ versionId }) => {
    const { aiModelVersion, loading } = useAiModelVersion(versionId);
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading version details...</p>
                </div>
            </div>
        );
    }

    if (!aiModelVersion) {
        return (
            <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Version not found</h3>
                <p className="mt-1 text-sm text-gray-500">The requested model version could not be found.</p>
                <div className="mt-6">
                    <Button onClick={() => router.push("/core-assets/ai-models/versions")}>
                        Back to Versions
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <VersionHeader
                version={aiModelVersion.version_number}
                modelName={aiModelVersion.ai_model?.name}
                versionId={versionId}
                modelId={aiModelVersion.ai_model_id}
            />

            {/* Status Cards */}
            <StatusCards
                deploymentStatus={aiModelVersion.deployment_status}
                lifecycleStage={aiModelVersion.lifecycle_stage}
                versionType={aiModelVersion.version_type}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <BasicInfo
                        version={aiModelVersion.version_number}
                        modelName={aiModelVersion.ai_model?.name}
                        description={aiModelVersion.description || undefined}
                        versionRole={aiModelVersion.version_role}
                        versionSource={aiModelVersion.version_source}
                        ourInvolvement={aiModelVersion.our_involvement}
                        createdAt={aiModelVersion.created_at}
                    />

                    <TechnicalDetails
                        architectureType={aiModelVersion.architecture_type}
                        complexity={aiModelVersion.complexity_level}
                        parameterCount={aiModelVersion.parameter_count || undefined}
                        modelFileSizeGb={aiModelVersion.model_file_size_gb?.toString() || undefined}
                        trainingDurationHours={aiModelVersion.training_duration_hours || undefined}
                        inputModalities={aiModelVersion.input_modalities}
                        outputModalities={aiModelVersion.output_modalities}
                    />

                    <DeploymentInfo
                        deploymentStatus={aiModelVersion.deployment_status}
                        lifecycleStage={aiModelVersion.lifecycle_stage}
                        deploymentEnvironments={aiModelVersion.deployment_environments}
                        releaseDate={aiModelVersion.release_date || undefined}
                        hasPerformanceData={aiModelVersion.has_performance_data}
                        performanceBaselineEstablished={aiModelVersion.performance_baseline_established}
                        complianceStatus={aiModelVersion.compliance_check_status}
                    />

                    <ReleaseNotes releaseNotes={aiModelVersion.release_notes || undefined} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <QuickActions
                        versionId={versionId}
                        modelId={aiModelVersion.ai_model_id}
                    />

                    <Metadata
                        id={aiModelVersion.id}
                        createdAt={aiModelVersion.created_at}
                        updatedAt={aiModelVersion.updated_at}
                    />
                </div>
            </div>
        </div>
    );
};

export default AiModelVersionDetails;
