import React from 'react'
import CreateAiAsset from '@/components/app/ai-assets/create/CreateAiAsset'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
    return (
        <PermissionPage permission={PERMISSIONS.AI_ASSETS_CREATE}>
            <CreateAiAsset />
        </PermissionPage>
    )
}

export default page

