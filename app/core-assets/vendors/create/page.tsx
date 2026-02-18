import CreateVendorWizard from '@/components/app/vendors/create/CreateVendorWizard'
import React from 'react'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const page = () => {
    return (
        <PermissionPage permission={PERMISSIONS.VENDORS_CREATE}>
            <div>
                <CreateVendorWizard />
            </div>
        </PermissionPage>
    )
}

export default page

