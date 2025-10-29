"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetadataProps {
    id: number;
    createdAt: string;
    updatedAt: string;
}

const Metadata: React.FC<MetadataProps> = ({ id, createdAt, updatedAt }) => {
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">Version ID</p>
                    <p className="text-sm text-gray-900 font-mono">{id}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(createdAt)}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-900">{formatDate(updatedAt)}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default Metadata;
