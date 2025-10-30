"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TechnicalDetailsProps {
    architectureType?: string;
    complexity?: string;
    parameterCount?: number;
    modelFileSizeGb?: string;
    trainingDurationHours?: number;
    inputModalities: string[];
    outputModalities: string[];
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({
    architectureType,
    complexity,
    parameterCount,
    modelFileSizeGb,
    trainingDurationHours,
    inputModalities,
    outputModalities
}) => {
    const formatCategory = (value: string | undefined): string => {
        if (!value || value.length === 0) return "-";
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Architecture Type</p>
                        <p className="text-gray-900">{formatCategory(architectureType)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Complexity Level</p>
                        <p className="text-gray-900">{formatCategory(complexity)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {parameterCount && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Parameter Count</p>
                            <p className="text-gray-900">{parameterCount.toLocaleString()}</p>
                        </div>
                    )}
                    {modelFileSizeGb && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">File Size (GB)</p>
                            <p className="text-gray-900">{modelFileSizeGb} GB</p>
                        </div>
                    )}
                    {trainingDurationHours && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Training Duration</p>
                            <p className="text-gray-900">{trainingDurationHours} hours</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Input Modalities</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {inputModalities.map((modality, index) => (
                                <Badge key={index} variant="light" className="text-xs">
                                    {formatCategory(modality)}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Output Modalities</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {outputModalities.map((modality, index) => (
                                <Badge key={index} variant="light" className="text-xs">
                                    {formatCategory(modality)}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TechnicalDetails;
