import LinkUseCasePage from '@/components/app/aiModel/linkUseCase/LinkUseCasePage'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
    return (
        <PermissionPage permission={PERMISSIONS.AI_MODEL_USE_CASES_CREATE}>
            <div>
                <LinkUseCasePage />
            </div>
        </PermissionPage>
    )
}

export default page

