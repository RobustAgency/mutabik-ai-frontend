"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface VersionHeaderProps {
    version: string;
    modelName?: string;
    versionId: number;
    modelId?: number;
}

const VersionHeader: React.FC<VersionHeaderProps> = ({ 
    version, 
    modelName, 
    versionId, 
    modelId 
}) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/core-assets/ai-models/versions")}
                    className="h-8 w-8 p-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{version}</h1>
                    <p className="text-sm text-gray-600">
                        {modelName || 'Unknown Model'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <PermissionGate permission={PERMISSIONS.AI_MODEL_VERSIONS_EDIT}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/core-assets/ai-models/versions/${versionId}/edit`)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                </PermissionGate>
                {modelId && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/core-assets/ai-models/${modelId}/details`)}
                    >
                        <Package className="h-4 w-4 mr-2" />
                        View Parent Model
                    </Button>
                )}
            </div>
        </div>
    );
};

export default VersionHeader;
