"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReleaseNotesProps {
    releaseNotes?: string;
}

const ReleaseNotes: React.FC<ReleaseNotesProps> = ({ releaseNotes }) => {
    if (!releaseNotes) {
        return null;
    }

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle>Release Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{releaseNotes}</p>
            </CardContent>
        </Card>
    );
};

export default ReleaseNotes;
