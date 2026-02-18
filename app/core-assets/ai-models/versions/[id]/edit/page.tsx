import EditAiModelVersion from '@/components/app/aiModel/versions/EditAiModelVersion'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

interface PageProps {
    params: Promise<{ id: string }>
}

const page = async ({ params }: PageProps) => {
    const { id } = await params
    return (
        <PermissionPage permission={PERMISSIONS.AI_MODEL_VERSIONS_EDIT}>
            <div>
                <EditAiModelVersion versionId={parseInt(id)} />
            </div>
        </PermissionPage>
    )
}

export default page
