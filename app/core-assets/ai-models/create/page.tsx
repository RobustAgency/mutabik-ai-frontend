import CreateAiModel from '@/components/app/aiModel/create/CreateAiModel'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
    return (
        <PermissionPage permission={PERMISSIONS.AI_MODELS_CREATE}>
            <div>
                <CreateAiModel />
            </div>
        </PermissionPage>
    )
}

export default page