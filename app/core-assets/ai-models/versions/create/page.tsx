import CreateAiModelVersion from '@/components/app/aiModel/versions/CreateAiModelVersion'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
    return (
        <PermissionPage permission={PERMISSIONS.AI_MODEL_VERSIONS_CREATE}>
            <div>
                <CreateAiModelVersion />
            </div>
        </PermissionPage>
    )
}

export default page
