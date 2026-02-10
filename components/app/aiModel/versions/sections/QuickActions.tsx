"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface QuickActionsProps {
    versionId: number;
    modelId?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ versionId, modelId }) => {
    const router = useRouter();

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <PermissionGate permission={PERMISSIONS.AI_MODEL_VERSIONS_EDIT}>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => router.push(`/core-assets/ai-models/versions/${versionId}/edit`)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Version
                    </Button>
                </PermissionGate>
                {modelId && (
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => router.push(`/core-assets/ai-models/${modelId}/details`)}
                    >
                        <Package className="h-4 w-4 mr-2" />
                        View Parent Model
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default QuickActions;
