"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLong } from "@/lib/helpers/date";

interface BasicInfoProps {
    version: string;
    modelName?: string;
    description?: string;
    versionRole?: string;
    versionSource?: string;
    ourInvolvement?: string;
    createdAt: string;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
    version,
    modelName,
    description,
    versionRole,
    versionSource,
    ourInvolvement,
    createdAt
}) => {
    const formatCategory = (value: string | undefined): string => {
        if (!value || value.length === 0) return "-";
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString: string): string => formatDateLong(dateString);

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Version Number</p>
                        <p className="text-lg font-semibold text-gray-900">{version}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Parent Model</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {modelName || 'Unknown'}
                        </p>
                    </div>
                </div>

                {description && (
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                        <p className="text-gray-900">{description}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Version Role</p>
                        <p className="text-gray-900">{formatCategory(versionRole)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Version Source</p>
                        <p className="text-gray-900">{formatCategory(versionSource)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Our Involvement</p>
                        <p className="text-gray-900">{formatCategory(ourInvolvement)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Created</p>
                        <p className="text-gray-900">{formatDate(createdAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BasicInfo;
