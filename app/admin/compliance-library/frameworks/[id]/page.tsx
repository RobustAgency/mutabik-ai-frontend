"use client";

export const runtime = 'edge';

import React from "react";
import { useParams, useRouter } from "next/navigation";
import FrameworkForm from "@/components/admin/frameworks/createFramework/FrameworkForm";
import { useFramework } from "@/hooks/admin/useFrameworks";
import Spinner from "@/components/ui/spinner";

export default function FrameworkPage() {
    const params = useParams();
    const router = useRouter();
    const isCreateMode = params.id === 'create';

    const { framework, loading, error } = useFramework(
        !isCreateMode ? params.id as string : undefined
    );

    const handleCancel = () => {
        router.push('/admin/frameworks');
    };

    // Show loading state for edit mode
    if (!isCreateMode && loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] px-2 py-8 flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-4 text-[#737373]">Loading framework...</p>
            </div>
        );
    }

    // Show error state for edit mode
    if (!isCreateMode && error) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] px-2 py-8 flex flex-col items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-lg font-semibold">Error loading framework</p>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={handleCancel}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back to Frameworks
                    </button>
                </div>
            </div>
        );
    }

    // Show not found for edit mode if framework doesn't exist
    if (!isCreateMode && !loading && !framework) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] px-2 py-8 flex flex-col items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-[#171717]">Framework not found</p>
                    <p className="mt-2 text-[#737373]">The framework you&apos;re looking for doesn&apos;t exist.</p>
                    <button
                        onClick={handleCancel}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back to Frameworks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FrameworkForm
            framework={framework}
            isEditing={!isCreateMode}
            onCancel={handleCancel}
        />
    );
}
