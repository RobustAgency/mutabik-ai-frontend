"use client"

export const runtime = 'edge';
import React from "react";
import RequirementsList from "@/components/admin/requirements/RequirementsList";

export default function RequirementsPage() {
    return (
        <React.Fragment>
            <RequirementsList />
        </React.Fragment>
    );
}